---
title: "Volatile关键字源码分析"
date: 2025-04-30T23:41:21+08:00
tags: []
featured_image: ""
description: ""
---

### 为了实现Volatile关键字的语义JVM做了哪些事情？
putfield字节码插入了volatile屏障实现volatile语义

Flags: [0000|00|is_final|is_volatile]

2747-2753行：检测是否是volatile，是则插入volatile_barrier: Assembler::StoreLoad | Assembler::StoreStore
```C++
2161    src/hotspot/cpu/x86/templateTable_x86.cpp
2162    // ----------------------------------------------------------------------------
2163    // Volatile variables demand their effects be made known to all CPU's
2164    // in order.  Store buffers on most chips allow reads & writes to
2165    // reorder; the JMM's ReadAfterWrite.java test fails in -Xint mode
2166    // without some kind of memory barrier (i.e., it's not sufficient that
2167    // the interpreter does not reorder volatile references, the hardware
2168    // also must not reorder them).
2169    //
2170    // According to the new Java Memory Model (JMM):
2171    // (1) All volatiles are serialized wrt to each other.  ALSO reads &
2172    //     writes act as acquire & release, so:
2173    // (2) A read cannot let unrelated NON-volatile memory refs that
2174    //     happen after the read float up to before the read.  It's OK for
2175    //     non-volatile memory refs that happen before the volatile read to
2176    //     float down below it.
2177    // (3) Similar a volatile write cannot let unrelated NON-volatile
2178    //     memory refs that happen BEFORE the write float down to after the
2179    //     write.  It's OK for non-volatile memory refs that happen after the
2180    //     volatile write to float up before it.
2181    //
2182    // We only put in barriers around volatile refs (they are expensive),
2183    // not _between_ memory refs (that would require us to track the
2184    // flavor of the previous memory refs).  Requirements (2) and (3)
2185    // require some barriers before volatile stores and after volatile
2186    // loads.  These nearly cover requirement (1) but miss the
2187    // volatile-store-volatile-load case.  This final case is placed after
2188    // volatile-stores although it could just as well go before
2189    // volatile-loads.
2190    
2191    void TemplateTable::volatile_barrier(Assembler::Membar_mask_bits order_constraint ) {
2192      // Helper function to insert a is-volatile test and memory barrier
2193      __ membar(order_constraint);
2194    }
...
2727    void TemplateTable::putfield_or_static(int byte_no, bool is_static, RewriteControl rc) {
2728      transition(vtos, vtos);
2729    
2730      const Register obj = rcx;
2731      const Register cache = rcx;
2732      const Register index = rdx;
2733      const Register tos_state   = rdx;
2734      const Register off   = rbx;
2735      const Register flags = rax;
2736    
2737      resolve_cache_and_index_for_field(byte_no, cache, index);
2738      jvmti_post_field_mod(cache, index, is_static);
2739      load_resolved_field_entry(obj, cache, tos_state, off, flags, is_static);
2740    
2741      // [jk] not needed currently
2742      // volatile_barrier(Assembler::Membar_mask_bits(Assembler::LoadStore |
2743      //                                              Assembler::StoreStore));
2744    
2745      Label notVolatile, Done;
2746    
2747      // Check for volatile store
2748      __ andl(flags, (1 << ResolvedFieldEntry::is_volatile_shift));
2749      __ testl(flags, flags);
2750      __ jcc(Assembler::zero, notVolatile);
2751    
2752      putfield_or_static_helper(byte_no, is_static, rc, obj, off, tos_state);
2753      volatile_barrier(Assembler::Membar_mask_bits(Assembler::StoreLoad |
2754                                                   Assembler::StoreStore));
2755      __ jmp(Done);
2756      __ bind(notVolatile);
2757    
2758      putfield_or_static_helper(byte_no, is_static, rc, obj, off, tos_state);
2759    
2760      __ bind(Done);
2761    }
...
2925    void TemplateTable::putfield(int byte_no) {
2926      putfield_or_static(byte_no, false);
2927    }
```
membar(order_constraint)源码
```C++
src/hotspot/cpu/x86/assembler_x86.cpp
233     void Assembler::membar(Membar_mask_bits order_constraint) {
234       // We only have to handle StoreLoad
235       if (order_constraint & StoreLoad) {
236         // All usable chips support "locked" instructions which suffice
237         // as barriers, and are much faster than the alternative of
238         // using cpuid instruction. We use here a locked add [esp-C],0.
239         // This is conveniently otherwise a no-op except for blowing
240         // flags, and introducing a false dependency on target memory
241         // location. We can't do anything with flags, but we can avoid
242         // memory dependencies in the current method by locked-adding
243         // somewhere else on the stack. Doing [esp+C] will collide with
244         // something on stack in current method, hence we go for [esp-C].
245         // It is convenient since it is almost always in data cache, for
246         // any small C.  We need to step back from SP to avoid data
247         // dependencies with other things on below SP (callee-saves, for
248         // example). Without a clear way to figure out the minimal safe
249         // distance from SP, it makes sense to step back the complete
250         // cache line, as this will also avoid possible second-order effects
251         // with locked ops against the cache line. Our choice of offset
252         // is bounded by x86 operand encoding, which should stay within
253         // [-128; +127] to have the 8-byte displacement encoding.
254         //
255         // Any change to this code may need to revisit other places in
256         // the code where this idiom is used, in particular the
257         // orderAccess code.
258     
259         int offset = -VM_Version::L1_line_size();
260         if (offset < -128) {
261           offset = -128;
262         }
263     
264         lock();
265         addl(Address(rsp, offset), 0);// Assert the lock# signal here
266       }
267     }
...
2867    void Assembler::lock() {
2868      emit_int8((unsigned char)0xF0);
2869    }
```
从上述代码可知，JVM使用locked add [esp-C],0实现StoreLoad屏障
