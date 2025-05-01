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
### 为什么ZGC几乎不需要停顿？
1. 解决了存活对象转移长时间停顿的问题
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
