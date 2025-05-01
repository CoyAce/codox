---
title: "ZGC-读屏障"
date: 2025-04-30T11:40:34+08:00
tags: []
featured_image: ""
description: ""
---

### 为什么GC需要STW？
1. 标记对象的时候可能新增引用或者删除引用
2. 转移存活对象时，可能有多个引用指向同一个存活对象，需要同时更新对象的引用
```mermaid
block-beta
  columns 13
  block:stack:13
    B space A
  end
  space:13
  block:heap:13
    obj space obj'
  end
  A --"X"--> obj
  B --"引用"--> obj
  A --"引用"--> obj'
  obj --"转移"--> obj'
  style obj stroke:#f66,stroke-width:2px,stroke-dasharray: 5 5
```
为了使转移前后的两个对象保持一致，需要满足以下两个要求
>1. 转移完成前应用线程不能更新旧对象，否则，复制后的新对象未同步更新，更新丢失
>2. 转移完成后需要更新所有引用旧对象的指针，将其指向新对象，引用全部更新后对象才可用

问题：怎么实现同时修改所有引用某个对象的指针，不遗漏?  
> 对象引用是指针的指针，保存的是句柄的地址，句柄保存对象真实地址，先访问句柄获取真实地址，再使用真实地址获取对象属性
> ```mermaid
> flowchart LR
> refA & refB---->oop("句柄(oop)")---->obj & obj'
> style obj stroke:#f66,stroke-width:2px,stroke-dasharray: 5 5
> ```
> 对象转移后将句柄中的值修改为转移后的地址即可  
>
>     src/hotspot/cpu/x86/gc/z/zBarrierSetAssembler_x86.cpp
>     #define __ masm->
>     218  void ZBarrierSetAssembler::load_at(MacroAssembler* masm,
>                                DecoratorSet decorators,
>                                BasicType type,
>                                Register dst,
>                                Address src,
>                                Register tmp1) {
>     ...
>     248  // Load address
>     249  __ lea(scratch, src);
>     250
>     251  // Load oop at address
>     252  __ movptr(dst, Address(scratch, 0));

### 为什么ZGC几乎不需要停顿？
1. 解决了存活对象转移长时间停顿的问题
  - GC线程标记对象是否存活，转移存活对象，修改对象句柄中的状态位，更新转发表
  - 转发表保存转移前的对象与转移后的对象之间的地址映射关系
  - 读屏障：应用线程在获取引用类型的字段时对句柄中的真实地址进行检测和更新
  - 根据真实地址中的状态位判断字段是否需要转移
> 核心思想是使应用线程与GC线程可以并行转移对象

> 传统GC需要STW来实现GC前后对象一致，ZGC应用线程与GC线程可以并发转移，不需要STW
2. 优化GC Roots扫描时的停顿问题
### 读屏障解决什么问题
![读屏障的作用](/doc/img/zgc/barrier/4.png)
### 读屏障触发条件
![读屏障的触发场景](/doc/img/zgc/barrier/1.png)
![不触发读屏障的场景](/doc/img/zgc/barrier/2.png)
### 读屏障实现细节
![读屏障实现细节](/doc/img/zgc/barrier/3.png)

### 参考资料
[1] [ZGC-Jfokus-2018.pdf](https://cr.openjdk.org/~pliden/slides/ZGC-Jfokus-2018.pdf)

[2] [How ZGC allocates memory for the Java heap](https://joelsiks.com/posts/zgc-heap-memory-allocation/)
