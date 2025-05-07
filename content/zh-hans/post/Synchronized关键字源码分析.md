---
title: "Synchronized关键字源码分析"
date: 2025-04-30T23:40:56+08:00
tags: []
featured_image: ""
description: ""
---

### Synchronized如何实现锁升级？
Synchronized加锁对应字节码monitorenter
```C++
src/hotspot/cpu/x86/templateTable_x86.cpp
3833    void TemplateTable::monitorenter() {
...
3851      // initialize entry pointer
...
3854      // find a free slot in the monitor block (result in rmon)
...
3887      // allocate one if there's no free slot
...
3920      // store object
3921      __ movptr(Address(rmon, BasicObjectLock::obj_offset()), rax);
3922      __ lock_object(rmon);
3923    
3924      // check to make sure this monitor doesn't cause stack overflow after locking
...
3931    }
```

加锁需要用到lock_object，默认使用轻量级锁

```C++
src/hotspot/cpu/x86/interp_masm_x86.cpp
996      // Lock object
997      //
998      // Args:
999      //      rdx, c_rarg1: BasicObjectLock to be used for locking
1000     //
1001     // Kills:
1002     //      rax, rbx
1003     void InterpreterMacroAssembler::lock_object(Register lock_reg) {
1004       assert(lock_reg == c_rarg1, "The argument is only for looks. It must be c_rarg1");
1005     
           // LockingMode - monitors & new lightweight locking (LM_LIGHTWEIGHT, default) 1032
...
1032         if (LockingMode == LM_LIGHTWEIGHT) {
1033           lightweight_lock(lock_reg, obj_reg, swap_reg, tmp_reg, slow_case);
1034         } else if (LockingMode == LM_LEGACY) {
...
1090         jmp(done);
1091     
1092         bind(slow_case);
1093     
1094         // Call the runtime routine for slow case
1095         call_VM_preemptable(noreg,
1096                 CAST_FROM_FN_PTR(address, InterpreterRuntime::monitorenter),
1097                 lock_reg);
1098         bind(done);
1099       }
1100     }
```

markWord描述，关注锁标志位
```C++
src/hotspot/share/oops/markWord.hpp
35      // The markWord describes the header of an object.
36      //
37      // Bit-format of an object header (most significant first, big endian layout below):
38      //
39      //  32 bits:
40      //  --------
41      //             hash:25 ------------>| age:4  self-fwd:1  lock:2 (normal object)
42      //
43      //  64 bits:
44      //  --------
45      //  unused:22 hash:31 -->| unused_gap:4  age:4  self-fwd:1  lock:2 (normal object)
46      //
47      //  64 bits (with compact headers):
48      //  -------------------------------
49      //  klass:22  hash:31 -->| unused_gap:4  age:4  self-fwd:1  lock:2 (normal object)
50      //
51      //  - hash contains the identity hash value: largest value is
52      //    31 bits, see os::random().  Also, 64-bit vm's require
53      //    a hash value no bigger than 32 bits because they will not
54      //    properly generate a mask larger than that: see library_call.cpp
55      //
56      //  - the two lock bits are used to describe three states: locked/unlocked and monitor.
57      //
58      //    [ptr             | 00]  locked             ptr points to real header on stack (stack-locking in use)
59      //    [header          | 00]  locked             locked regular object header (fast-locking in use)
60      //    [header          | 01]  unlocked           regular object header
61      //    [ptr             | 10]  monitor            inflated lock (header is swapped out, UseObjectMonitorTable == false)
62      //    [header          | 10]  monitor            inflated lock (UseObjectMonitorTable == true)
63      //    [ptr             | 11]  marked             used to mark an object
64      //    [0 ............ 0| 00]  inflating          inflation in progress (stack-locking in use)
65      //
66      //    We assume that stack/thread pointers have the lowest two bits cleared.
67      //
68      //  - INFLATING() is a distinguished markword value of all zeros that is
69      //    used when inflating an existing stack-lock into an ObjectMonitor.
70      //    See below for is_being_inflated() and INFLATING().
```

接下来看一下lightweight_lock怎么实现的。

lightweight_lock方法先尝试用汇编指令加锁，加锁失败会跳转至slow标签执行InterpreterRuntime::monitorenter进行加锁尝试。

```C++
src/hotspot/cpu/x86/macroAssembler_x86.cpp
10620   // Implements lightweight-locking.
10621   //
10622   // obj: the object to be locked
10623   // reg_rax: rax
10624   // thread: the thread which attempts to lock obj
10625   // tmp: a temporary register
10626   void MacroAssembler::lightweight_lock(Register basic_lock, Register obj, Register reg_rax, Register tmp, Label& slow) {
10627     Register thread = r15_thread;
10628   
10629     assert(reg_rax == rax, "");
10630     assert_different_registers(basic_lock, obj, reg_rax, thread, tmp);
10631   
10632     Label push;
10633     const Register top = tmp;
10634   
10635     // Preload the markWord. It is important that this is the first
10636     // instruction emitted as it is part of C1's null check semantics.
10637     movptr(reg_rax, Address(obj, oopDesc::mark_offset_in_bytes()));
10638   
10639     if (UseObjectMonitorTable) {
10640       // Clear cache in case fast locking succeeds.
10641       movptr(Address(basic_lock, BasicObjectLock::lock_offset() + in_ByteSize((BasicLock::object_monitor_cache_offset_in_bytes()))), 0);
10642     }
10643   
10644     // Load top.
10645     movl(top, Address(thread, JavaThread::lock_stack_top_offset()));
10646   
10647     // Check if the lock-stack is full.
10648     cmpl(top, LockStack::end_offset());
10649     jcc(Assembler::greaterEqual, slow);
10650   
10651     // Check for recursion.
10652     cmpptr(obj, Address(thread, top, Address::times_1, -oopSize));
10653     jcc(Assembler::equal, push);
10654   
10655     // Check header for monitor (0b10).
10656     testptr(reg_rax, markWord::monitor_value);
10657     jcc(Assembler::notZero, slow);
10658   
10659     // Try to lock. Transition lock bits 0b01 => 0b00
10660     movptr(tmp, reg_rax);
10661     andptr(tmp, ~(int32_t)markWord::unlocked_value);
10662     orptr(reg_rax, markWord::unlocked_value);
10663     lock(); cmpxchgptr(tmp, Address(obj, oopDesc::mark_offset_in_bytes()));
10664     jcc(Assembler::notEqual, slow);
10665   
10666     // Restore top, CAS clobbers register.
10667     movl(top, Address(thread, JavaThread::lock_stack_top_offset()));
10668   
10669     bind(push);
10670     // After successful lock, push object on lock-stack.
10671     movptr(Address(thread, top), obj);
10672     incrementl(top, oopSize);
10673     movl(Address(thread, JavaThread::lock_stack_top_offset()), top);
10674   }
```
10655-10674的解释：
1. 如果markWord锁标志位是10（monitor），跳转到slow标签
2. 如果markWord锁标志位是01（unlocked），修改为00（locked），将对象头压入lock_stack，如果修改失败，跳转到slow标签。使用lock_stack可以支持重入，每次重入会将对象头压入lock_stack。

slow_case执行以下代码：
```C++
src/hotspot/cpu/x86/interp_masm_x86.cpp
1092         bind(slow_case);
1093     
1094         // Call the runtime routine for slow case
1095         call_VM_preemptable(noreg,
1096                 CAST_FROM_FN_PTR(address, InterpreterRuntime::monitorenter),
1097                 lock_reg);
```
接下来看一下InterpreterRuntime::monitorenter怎么实现锁升级
```C++
src/hotspot/share/interpreter/interpreterRuntime.cpp
716     // Synchronization
717     //
718     // The interpreter's synchronization code is factored out so that it can
719     // be shared by method invocation and synchronized blocks.
720     //%note synchronization_3
721     
722     //%note monitor_1
723     JRT_ENTRY_NO_ASYNC(void, InterpreterRuntime::monitorenter(JavaThread* current, BasicObjectLock* elem))
724     #ifdef ASSERT
725       current->last_frame().interpreter_frame_verify_monitor(elem);
726     #endif
727       Handle h_obj(current, elem->obj());
728       assert(Universe::heap()->is_in_or_null(h_obj()),
729              "must be null or an object");
730       ObjectSynchronizer::enter(h_obj, elem->lock(), current);
731       assert(Universe::heap()->is_in_or_null(elem->obj()),
732              "must be null or an object");
733     #ifdef ASSERT
734       if (!current->preempting()) current->last_frame().interpreter_frame_verify_monitor(elem);
735     #endif
736     JRT_END
```
730行：ObjectSynchronizer::enter
```C++
src/hotspot/share/runtime/synchronizer.inline.hpp
45      inline void ObjectSynchronizer::enter(Handle obj, BasicLock* lock, JavaThread* current) {
46        assert(current == Thread::current(), "must be");
47      
48        if (LockingMode == LM_LIGHTWEIGHT) {
49          LightweightSynchronizer::enter(obj, lock, current);
50        } else {
51          enter_legacy(obj, lock, current);
52        }
53      }
```
```C++
src/hotspot/share/runtime/lightweightSynchronizer.cpp
659     void LightweightSynchronizer::enter(Handle obj, BasicLock* lock, JavaThread* current) {
660       assert(LockingMode == LM_LIGHTWEIGHT, "must be");
661       assert(current == JavaThread::current(), "must be");
662     
663       if (obj->klass()->is_value_based()) {
664         ObjectSynchronizer::handle_sync_on_value_based_class(obj, current);
665       }
666     
667       CacheSetter cache_setter(current, lock);
668     
669       // Used when deflation is observed. Progress here requires progress
670       // from the deflator. After observing that the deflator is not
671       // making progress (after two yields), switch to sleeping.
672       SpinYield spin_yield(0, 2);
673       bool observed_deflation = false;
674     
675       LockStack& lock_stack = current->lock_stack();
676     
677       if (!lock_stack.is_full() && lock_stack.try_recursive_enter(obj())) {
678         // Recursively fast locked
679         return;
680       }
681     
682       if (lock_stack.contains(obj())) {
683         ObjectMonitor* monitor = inflate_fast_locked_object(obj(), ObjectSynchronizer::inflate_cause_monitor_enter, current, current);
684         bool entered = monitor->enter(current);
685         assert(entered, "recursive ObjectMonitor::enter must succeed");
686         cache_setter.set_monitor(monitor);
687         return;
688       }
689     
690       while (true) {
691         // Fast-locking does not use the 'lock' argument.
692         // Fast-lock spinning to avoid inflating for short critical sections.
693         // The goal is to only inflate when the extra cost of using ObjectMonitors
694         // is worth it.
695         // If deflation has been observed we also spin while deflation is ongoing.
696         if (fast_lock_try_enter(obj(), lock_stack, current)) {
697           return;
698         } else if (UseObjectMonitorTable && fast_lock_spin_enter(obj(), lock_stack, current, observed_deflation)) {
699           return;
700         }
701     
702         if (observed_deflation) {
703           spin_yield.wait();
704         }
705     
706         ObjectMonitor* monitor = inflate_and_enter(obj(), lock, ObjectSynchronizer::inflate_cause_monitor_enter, current, current);
707         if (monitor != nullptr) {
708           cache_setter.set_monitor(monitor);
709           return;
710         }
711     
712         // If inflate_and_enter returns nullptr it is because a deflated monitor
713         // was encountered. Fallback to fast locking. The deflater is responsible
714         // for clearing out the monitor and transitioning the markWord back to
715         // fast locking.
716         observed_deflation = true;
717       }
718     }
```
696行：自旋尝试获取锁，没有竞争时会成功，无需锁升级  
706行：锁升级，进入monitor，inflate_and_enter
```C++
src/hotspot/share/runtime/lightweightSynchronizer.cpp
1002    ObjectMonitor* LightweightSynchronizer::inflate_and_enter(oop object, BasicLock* lock, ObjectSynchronizer::InflateCause cause, JavaThread* locking_thread, JavaThread* current) {
1003      assert(LockingMode == LM_LIGHTWEIGHT, "only used for lightweight");
1004      VerifyThreadState vts(locking_thread, current);
1005    
1006      // Note: In some paths (deoptimization) the 'current' thread inflates and
1007      // enters the lock on behalf of the 'locking_thread' thread.
1008    
1009      ObjectMonitor* monitor = nullptr;
1010    
1011      if (!UseObjectMonitorTable) {
1012        // Do the old inflate and enter.
1013        monitor = inflate_into_object_header(object, cause, locking_thread, current);
1014    
1015        bool entered;
1016        if (locking_thread == current) {
1017          entered = monitor->enter(locking_thread);
1018        } else {
1019          entered = monitor->enter_for(locking_thread);
1020        }
1021    
1022        // enter returns false for deflation found.
1023        return entered ? monitor : nullptr;
1024      }
...
1162    }
```
1011行：UseObjectMonitorTable默认值是false，使用object header进行锁升级
```C++
src/hotspot/share/runtime/lightweightSynchronizer.cpp
827     ObjectMonitor* LightweightSynchronizer::inflate_into_object_header(oop object, ObjectSynchronizer::InflateCause cause, JavaThread* locking_thread, Thread* current) {
828     
829       // The JavaThread* locking_thread parameter is only used by LM_LIGHTWEIGHT and requires
830       // that the locking_thread == Thread::current() or is suspended throughout the call by
831       // some other mechanism.
832       // Even with LM_LIGHTWEIGHT the thread might be nullptr when called from a non
833       // JavaThread. (As may still be the case from FastHashCode). However it is only
834       // important for the correctness of the LM_LIGHTWEIGHT algorithm that the thread
835       // is set when called from ObjectSynchronizer::enter from the owning thread,
836       // ObjectSynchronizer::enter_for from any thread, or ObjectSynchronizer::exit.
837       EventJavaMonitorInflate event;
838     
839       for (;;) {
840         const markWord mark = object->mark_acquire();
841     
842         // The mark can be in one of the following states:
843         // *  inflated     - Just return if using stack-locking.
844         //                   If using fast-locking and the ObjectMonitor owner
845         //                   is anonymous and the locking_thread owns the
846         //                   object lock, then we make the locking_thread
847         //                   the ObjectMonitor owner and remove the lock from
848         //                   the locking_thread's lock stack.
849         // *  fast-locked  - Coerce it to inflated from fast-locked.
850         // *  unlocked     - Aggressively inflate the object.
851     
852         // CASE: inflated
853         if (mark.has_monitor()) {
854           ObjectMonitor* inf = mark.monitor();
855           markWord dmw = inf->header();
856           assert(dmw.is_neutral(), "invariant: header=" INTPTR_FORMAT, dmw.value());
857           if (inf->has_anonymous_owner() &&
858               locking_thread != nullptr && locking_thread->lock_stack().contains(object)) {
859             inf->set_owner_from_anonymous(locking_thread);
860             size_t removed = locking_thread->lock_stack().remove(object);
861             inf->set_recursions(removed - 1);
862           }
863           return inf;
864         }
865     
866         // CASE: fast-locked
867         // Could be fast-locked either by the locking_thread or by some other thread.
868         //
869         // Note that we allocate the ObjectMonitor speculatively, _before_
870         // attempting to set the object's mark to the new ObjectMonitor. If
871         // the locking_thread owns the monitor, then we set the ObjectMonitor's
872         // owner to the locking_thread. Otherwise, we set the ObjectMonitor's owner
873         // to anonymous. If we lose the race to set the object's mark to the
874         // new ObjectMonitor, then we just delete it and loop around again.
875         //
876         if (mark.is_fast_locked()) {
877           ObjectMonitor* monitor = new ObjectMonitor(object);
878           monitor->set_header(mark.set_unlocked());
879           bool own = locking_thread != nullptr && locking_thread->lock_stack().contains(object);
880           if (own) {
881             // Owned by locking_thread.
882             monitor->set_owner(locking_thread);
883           } else {
884             // Owned by somebody else.
885             monitor->set_anonymous_owner();
886           }
887           markWord monitor_mark = markWord::encode(monitor);
888           markWord old_mark = object->cas_set_mark(monitor_mark, mark);
889           if (old_mark == mark) {
890             // Success! Return inflated monitor.
891             if (own) {
892               size_t removed = locking_thread->lock_stack().remove(object);
893               monitor->set_recursions(removed - 1);
894             }
895             // Once the ObjectMonitor is configured and object is associated
896             // with the ObjectMonitor, it is safe to allow async deflation:
897             ObjectSynchronizer::_in_use_list.add(monitor);
898     
899             log_inflate(current, object, cause);
900             if (event.should_commit()) {
901               post_monitor_inflate_event(&event, object, cause);
902             }
903             return monitor;
904           } else {
905             delete monitor;
906             continue;  // Interference -- just retry
907           }
908         }
909     
910         // CASE: unlocked
911         // TODO-FIXME: for entry we currently inflate and then try to CAS _owner.
912         // If we know we're inflating for entry it's better to inflate by swinging a
913         // pre-locked ObjectMonitor pointer into the object header.   A successful
914         // CAS inflates the object *and* confers ownership to the inflating thread.
915         // In the current implementation we use a 2-step mechanism where we CAS()
916         // to inflate and then CAS() again to try to swing _owner from null to current.
917         // An inflateTry() method that we could call from enter() would be useful.
918     
919         assert(mark.is_unlocked(), "invariant: header=" INTPTR_FORMAT, mark.value());
920         ObjectMonitor* m = new ObjectMonitor(object);
921         // prepare m for installation - set monitor to initial state
922         m->set_header(mark);
923     
924         if (object->cas_set_mark(markWord::encode(m), mark) != mark) {
925           delete m;
926           m = nullptr;
927           continue;
928           // interference - the markword changed - just retry.
929           // The state-transitions are one-way, so there's no chance of
930           // live-lock -- "Inflated" is an absorbing state.
931         }
932     
933         // Once the ObjectMonitor is configured and object is associated
934         // with the ObjectMonitor, it is safe to allow async deflation:
935         ObjectSynchronizer::_in_use_list.add(m);
936     
937         log_inflate(current, object, cause);
938         if (event.should_commit()) {
939           post_monitor_inflate_event(&event, object, cause);
940         }
941         return m;
942       }
943     }
```
888行：自旋加monitor锁

大致流程：如果是轻量级锁，尝试升级成monitor锁，如果是monitor锁，返回monitor对象，执行monitor->enter(locking_thread)进入等待队列或者获得锁
