---
title: "Synchronized关键字源码分析"
date: 2025-04-30T23:40:56+08:00
tags: []
featured_image: ""
description: ""
---

### Synchronized如何实现锁升级？
Synchronized加锁和释放锁对应字节码monitorenter和monitorexit，加锁需要用到lock_object，重点关注该方法，默认使用轻量级锁，需关注lightweight_lock方法，加锁失败会进入InterpreterRuntime::monitorenter进行加锁尝试，失败则进行锁升级。
<details>
<summary>字节码monitorenter与monitorexit对应的C++代码</summary>

```C++
src/hotspot/cpu/x86/templateTable_x86.cpp
3816    //-----------------------------------------------------------------------------
3817    // Synchronization
3818    //
3819    // Note: monitorenter & exit are symmetric routines; which is reflected
3820    //       in the assembly code structure as well
3821    //
3822    // Stack layout:
3823    //
3824    // [expressions  ] <--- rsp               = expression stack top
3825    // ..
3826    // [expressions  ]
3827    // [monitor entry] <--- monitor block top = expression stack bot
3828    // ..
3829    // [monitor entry]
3830    // [frame data   ] <--- monitor block bot
3831    // ...
3832    // [saved rbp    ] <--- rbp
3833    void TemplateTable::monitorenter() {
3834      transition(atos, vtos);
3835    
3836      // check for null object
3837      __ null_check(rax);
3838    
3839      const Address monitor_block_top(
3840            rbp, frame::interpreter_frame_monitor_block_top_offset * wordSize);
3841      const Address monitor_block_bot(
3842            rbp, frame::interpreter_frame_initial_sp_offset * wordSize);
3843      const int entry_size = frame::interpreter_frame_monitor_size_in_bytes();
3844    
3845      Label allocated;
3846    
3847      Register rtop = c_rarg3;
3848      Register rbot = c_rarg2;
3849      Register rmon = c_rarg1;
3850    
3851      // initialize entry pointer
3852      __ xorl(rmon, rmon); // points to free slot or null
3853    
3854      // find a free slot in the monitor block (result in rmon)
3855      {
3856        Label entry, loop, exit;
3857        __ movptr(rtop, monitor_block_top); // derelativize pointer
3858        __ lea(rtop, Address(rbp, rtop, Address::times_ptr));
3859        // rtop points to current entry, starting with top-most entry
3860    
3861        __ lea(rbot, monitor_block_bot);    // points to word before bottom
3862                                            // of monitor block
3863        __ jmpb(entry);
3864    
3865        __ bind(loop);
3866        // check if current entry is used
3867        __ cmpptr(Address(rtop, BasicObjectLock::obj_offset()), NULL_WORD);
3868        // if not used then remember entry in rmon
3869        __ cmovptr(Assembler::equal, rmon, rtop);   // cmov => cmovptr
3870        // check if current entry is for same object
3871        __ cmpptr(rax, Address(rtop, BasicObjectLock::obj_offset()));
3872        // if same object then stop searching
3873        __ jccb(Assembler::equal, exit);
3874        // otherwise advance to next entry
3875        __ addptr(rtop, entry_size);
3876        __ bind(entry);
3877        // check if bottom reached
3878        __ cmpptr(rtop, rbot);
3879        // if not at bottom then check this entry
3880        __ jcc(Assembler::notEqual, loop);
3881        __ bind(exit);
3882      }
3883    
3884      __ testptr(rmon, rmon); // check if a slot has been found
3885      __ jcc(Assembler::notZero, allocated); // if found, continue with that one
3886    
3887      // allocate one if there's no free slot
3888      {
3889        Label entry, loop;
3890        // 1. compute new pointers          // rsp: old expression stack top
3891        __ movptr(rmon, monitor_block_bot); // rmon: old expression stack bottom
3892        __ lea(rmon, Address(rbp, rmon, Address::times_ptr));
3893        __ subptr(rsp, entry_size);         // move expression stack top
3894        __ subptr(rmon, entry_size);        // move expression stack bottom
3895        __ mov(rtop, rsp);                  // set start value for copy loop
3896        __ subptr(monitor_block_bot, entry_size / wordSize); // set new monitor block bottom
3897        __ jmp(entry);
3898        // 2. move expression stack contents
3899        __ bind(loop);
3900        __ movptr(rbot, Address(rtop, entry_size)); // load expression stack
3901                                                    // word from old location
3902        __ movptr(Address(rtop, 0), rbot);          // and store it at new location
3903        __ addptr(rtop, wordSize);                  // advance to next word
3904        __ bind(entry);
3905        __ cmpptr(rtop, rmon);                      // check if bottom reached
3906        __ jcc(Assembler::notEqual, loop);          // if not at bottom then
3907                                                    // copy next word
3908      }
3909    
3910      // call run-time routine
3911      // rmon: points to monitor entry
3912      __ bind(allocated);
3913    
3914      // Increment bcp to point to the next bytecode, so exception
3915      // handling for async. exceptions work correctly.
3916      // The object has already been popped from the stack, so the
3917      // expression stack looks correct.
3918      __ increment(rbcp);
3919    
3920      // store object
3921      __ movptr(Address(rmon, BasicObjectLock::obj_offset()), rax);
3922      __ lock_object(rmon);
3923    
3924      // check to make sure this monitor doesn't cause stack overflow after locking
3925      __ save_bcp();  // in case of exception
3926      __ generate_stack_overflow_check(0);
3927    
3928      // The bcp has already been incremented. Just need to dispatch to
3929      // next instruction.
3930      __ dispatch_next(vtos);
3931    }
3932    
3933    void TemplateTable::monitorexit() {
3934      transition(atos, vtos);
3935    
3936      // check for null object
3937      __ null_check(rax);
3938    
3939      const Address monitor_block_top(
3940            rbp, frame::interpreter_frame_monitor_block_top_offset * wordSize);
3941      const Address monitor_block_bot(
3942            rbp, frame::interpreter_frame_initial_sp_offset * wordSize);
3943      const int entry_size = frame::interpreter_frame_monitor_size_in_bytes();
3944    
3945      Register rtop = c_rarg1;
3946      Register rbot = c_rarg2;
3947    
3948      Label found;
3949    
3950      // find matching slot
3951      {
3952        Label entry, loop;
3953        __ movptr(rtop, monitor_block_top); // derelativize pointer
3954        __ lea(rtop, Address(rbp, rtop, Address::times_ptr));
3955        // rtop points to current entry, starting with top-most entry
3956    
3957        __ lea(rbot, monitor_block_bot);    // points to word before bottom
3958                                            // of monitor block
3959        __ jmpb(entry);
3960    
3961        __ bind(loop);
3962        // check if current entry is for same object
3963        __ cmpptr(rax, Address(rtop, BasicObjectLock::obj_offset()));
3964        // if same object then stop searching
3965        __ jcc(Assembler::equal, found);
3966        // otherwise advance to next entry
3967        __ addptr(rtop, entry_size);
3968        __ bind(entry);
3969        // check if bottom reached
3970        __ cmpptr(rtop, rbot);
3971        // if not at bottom then check this entry
3972        __ jcc(Assembler::notEqual, loop);
3973      }
3974    
3975      // error handling. Unlocking was not block-structured
3976      __ call_VM(noreg, CAST_FROM_FN_PTR(address,
3977                       InterpreterRuntime::throw_illegal_monitor_state_exception));
3978      __ should_not_reach_here();
3979    
3980      // call run-time routine
3981      __ bind(found);
3982      __ push_ptr(rax); // make sure object is on stack (contract with oopMaps)
3983      __ unlock_object(rtop);
3984      __ pop_ptr(rax); // discard object
3985    }
```
</details>
<details>
<summary>lock_object与unlock_object</summary>

```C++
src/hotspot/cpu/x86/interp_masm_x86.cpp
996     // Lock object
997     //
998     // Args:
999     //      rdx, c_rarg1: BasicObjectLock to be used for locking
1000     //
1001     // Kills:
1002     //      rax, rbx
1003     void InterpreterMacroAssembler::lock_object(Register lock_reg) {
1004       assert(lock_reg == c_rarg1, "The argument is only for looks. It must be c_rarg1");
1005     
           // LockingMode - monitors & new lightweight locking (LM_LIGHTWEIGHT, default) 1032
1006       if (LockingMode == LM_MONITOR) {
1007         call_VM_preemptable(noreg,
1008                 CAST_FROM_FN_PTR(address, InterpreterRuntime::monitorenter),
1009                 lock_reg);
1010       } else {
1011         Label count_locking, done, slow_case;
1012     
1013         const Register swap_reg = rax; // Must use rax for cmpxchg instruction
1014         const Register tmp_reg = rbx;
1015         const Register obj_reg = c_rarg3; // Will contain the oop
1016         const Register rklass_decode_tmp = rscratch1;
1017     
1018         const int obj_offset = in_bytes(BasicObjectLock::obj_offset());
1019         const int lock_offset = in_bytes(BasicObjectLock::lock_offset());
1020         const int mark_offset = lock_offset +
1021                                 BasicLock::displaced_header_offset_in_bytes();
1022     
1023         // Load object pointer into obj_reg
1024         movptr(obj_reg, Address(lock_reg, obj_offset));
1025     
1026         if (DiagnoseSyncOnValueBasedClasses != 0) {
1027           load_klass(tmp_reg, obj_reg, rklass_decode_tmp);
1028           testb(Address(tmp_reg, Klass::misc_flags_offset()), KlassFlags::_misc_is_value_based_class);
1029           jcc(Assembler::notZero, slow_case);
1030         }
1031     
1032         if (LockingMode == LM_LIGHTWEIGHT) {
1033           lightweight_lock(lock_reg, obj_reg, swap_reg, tmp_reg, slow_case);
1034         } else if (LockingMode == LM_LEGACY) {
1035           // Load immediate 1 into swap_reg %rax
1036           movl(swap_reg, 1);
1037     
1038           // Load (object->mark() | 1) into swap_reg %rax
1039           orptr(swap_reg, Address(obj_reg, oopDesc::mark_offset_in_bytes()));
1040     
1041           // Save (object->mark() | 1) into BasicLock's displaced header
1042           movptr(Address(lock_reg, mark_offset), swap_reg);
1043     
1044           assert(lock_offset == 0,
1045                  "displaced header must be first word in BasicObjectLock");
1046     
1047           lock();
1048           cmpxchgptr(lock_reg, Address(obj_reg, oopDesc::mark_offset_in_bytes()));
1049           jcc(Assembler::zero, count_locking);
1050     
1051           const int zero_bits = 7;
1052     
1053           // Fast check for recursive lock.
1054           //
1055           // Can apply the optimization only if this is a stack lock
1056           // allocated in this thread. For efficiency, we can focus on
1057           // recently allocated stack locks (instead of reading the stack
1058           // base and checking whether 'mark' points inside the current
1059           // thread stack):
1060           //  1) (mark & zero_bits) == 0, and
1061           //  2) rsp <= mark < mark + os::pagesize()
1062           //
1063           // Warning: rsp + os::pagesize can overflow the stack base. We must
1064           // neither apply the optimization for an inflated lock allocated
1065           // just above the thread stack (this is why condition 1 matters)
1066           // nor apply the optimization if the stack lock is inside the stack
1067           // of another thread. The latter is avoided even in case of overflow
1068           // because we have guard pages at the end of all stacks. Hence, if
1069           // we go over the stack base and hit the stack of another thread,
1070           // this should not be in a writeable area that could contain a
1071           // stack lock allocated by that thread. As a consequence, a stack
1072           // lock less than page size away from rsp is guaranteed to be
1073           // owned by the current thread.
1074           //
1075           // These 3 tests can be done by evaluating the following
1076           // expression: ((mark - rsp) & (zero_bits - os::vm_page_size())),
1077           // assuming both stack pointer and pagesize have their
1078           // least significant bits clear.
1079           // NOTE: the mark is in swap_reg %rax as the result of cmpxchg
1080           subptr(swap_reg, rsp);
1081           andptr(swap_reg, zero_bits - (int)os::vm_page_size());
1082     
1083           // Save the test result, for recursive case, the result is zero
1084           movptr(Address(lock_reg, mark_offset), swap_reg);
1085           jcc(Assembler::notZero, slow_case);
1086     
1087           bind(count_locking);
1088           inc_held_monitor_count();
1089         }
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
1101     
1102     
1103     // Unlocks an object. Used in monitorexit bytecode and
1104     // remove_activation.  Throws an IllegalMonitorException if object is
1105     // not locked by current thread.
1106     //
1107     // Args:
1108     //      rdx, c_rarg1: BasicObjectLock for lock
1109     //
1110     // Kills:
1111     //      rax
1112     //      c_rarg0, c_rarg1, c_rarg2, c_rarg3, ... (param regs)
1113     //      rscratch1 (scratch reg)
1114     // rax, rbx, rcx, rdx
1115     void InterpreterMacroAssembler::unlock_object(Register lock_reg) {
1116       assert(lock_reg == c_rarg1, "The argument is only for looks. It must be c_rarg1");
1117     
1118       if (LockingMode == LM_MONITOR) {
1119         call_VM_leaf(CAST_FROM_FN_PTR(address, InterpreterRuntime::monitorexit), lock_reg);
1120       } else {
1121         Label count_locking, done, slow_case;
1122     
1123         const Register swap_reg   = rax;  // Must use rax for cmpxchg instruction
1124         const Register header_reg = c_rarg2;  // Will contain the old oopMark
1125         const Register obj_reg    = c_rarg3;  // Will contain the oop
1126     
1127         save_bcp(); // Save in case of exception
1128     
1129         if (LockingMode != LM_LIGHTWEIGHT) {
1130           // Convert from BasicObjectLock structure to object and BasicLock
1131           // structure Store the BasicLock address into %rax
1132           lea(swap_reg, Address(lock_reg, BasicObjectLock::lock_offset()));
1133         }
1134     
1135         // Load oop into obj_reg(%c_rarg3)
1136         movptr(obj_reg, Address(lock_reg, BasicObjectLock::obj_offset()));
1137     
1138         // Free entry
1139         movptr(Address(lock_reg, BasicObjectLock::obj_offset()), NULL_WORD);
1140     
1141         if (LockingMode == LM_LIGHTWEIGHT) {
1142           lightweight_unlock(obj_reg, swap_reg, header_reg, slow_case);
1143         } else if (LockingMode == LM_LEGACY) {
1144           // Load the old header from BasicLock structure
1145           movptr(header_reg, Address(swap_reg,
1146                                      BasicLock::displaced_header_offset_in_bytes()));
1147     
1148           // Test for recursion
1149           testptr(header_reg, header_reg);
1150     
1151           // zero for recursive case
1152           jcc(Assembler::zero, count_locking);
1153     
1154           // Atomic swap back the old header
1155           lock();
1156           cmpxchgptr(header_reg, Address(obj_reg, oopDesc::mark_offset_in_bytes()));
1157     
1158           // zero for simple unlock of a stack-lock case
1159           jcc(Assembler::notZero, slow_case);
1160     
1161           bind(count_locking);
1162           dec_held_monitor_count();
1163         }
1164         jmp(done);
1165     
1166         bind(slow_case);
1167         // Call the runtime routine for slow case.
1168         movptr(Address(lock_reg, BasicObjectLock::obj_offset()), obj_reg); // restore obj
1169         call_VM_leaf(CAST_FROM_FN_PTR(address, InterpreterRuntime::monitorexit), lock_reg);
1170     
1171         bind(done);
1172     
1173         restore_bcp();
1174       }
1175     }
```
</details>

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
接下来看一下lightweight_lock怎么实现的
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
737     
738     JRT_LEAF(void, InterpreterRuntime::monitorexit(BasicObjectLock* elem))
739       oop obj = elem->obj();
740       assert(Universe::heap()->is_in(obj), "must be an object");
741       // The object could become unlocked through a JNI call, which we have no other checks for.
742       // Give a fatal message if CheckJNICalls. Otherwise we ignore it.
743       if (obj->is_unlocked()) {
744         if (CheckJNICalls) {
745           fatal("Object has been unlocked by JNI");
746         }
747         return;
748       }
749       ObjectSynchronizer::exit(obj, elem->lock(), JavaThread::current());
750       // Free entry. If it is not cleared, the exception handling code will try to unlock the monitor
751       // again at method exit or in the case of an exception.
752       elem->set_obj(nullptr);
753     JRT_END
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

大致流程：如果是轻量级锁，尝试升级成monitor锁，如果是monitor锁，返回monitor对象，执行monitor->enter(locking_thread)进入等待队列
