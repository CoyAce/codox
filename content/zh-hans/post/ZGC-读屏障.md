---
title: "ZGC-读屏障"
date: 2025-04-30T11:40:34+08:00
tags: []
featured_image: ""
description: ""
---

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
