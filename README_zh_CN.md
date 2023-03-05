# jagdai

[English] | 中文

[english]: ./README.md
[中文]: ./README_zh_CN.md

> 一种新手友好的 React 状态管理方案

## 安装

再稍微等几天

## 使用

### 创建 store

首先通过 **jagdai** 当中的 `create` 函数创建 **store**

`create` 的参数是一个函数，本质上它是一个你自定义的 React hook

这就意味着你可以在其中编写 `useState`, `useEffect`, `useMemo` 等所有类型的 React hook

所以我们可以使用像 `useState` 这样的原生 React hook 定义我们的 store 状态

```typescript
import { create } from 'jagdai'

import { useState } from 'react'
import { create } from 'jagdai'

export const {
  Store: CountStore,
  useQuery: useCountQuery,
} = create(() => {
  const [count, setCount] = useState(0)

  return {
    query: {
      count,
    }
  }
})
```

`create` 参数的自定义 hook 返回值是对象，且必须包含 `query` 对象

我们可以自定义 `query` 的字段，并将函数内定义的状态一一绑定到它们上面

---
### 在组件树上挂载 Store 组件

`create` 会返回一个对象，其中 `Store` 字段是一个组件，我们根据这个 store 的使用场景将它重命名为了 `CountStore`(非常鼓励这么做)

我们需要将这个 `CountStore` 组件挂载到我们的 React 树节点上


```typescript
const CounterApp = () => {
  return (
    <CountStore>
      <Count />
      <Controls />
    </CountStore>
  )
}
```

只有这样它的子组件甚至更深层次的组件内才可以消费我们之前在 `query` 中定义的状态

---

### 订阅并消费状态

`create` 返回对象中 `useQuery` 字段是一个 hook，它的作用是订阅和消费我们之前返回的 `query` 字段中的状态

这里我们将它重命名为 `useCountQuery`(强烈建议)，我们必须传参一个订阅函数给它

比如这里我们订阅了 `query` 中的 `count` 字段，只有 `count` 发生了改变，这个组件才会重新渲染

```typescript
const Count = () => {
  const count = useCountQuery((query) => query.count)

  return <div>{count}</div>
}
```

---
### 在组件中通知 store 更新状态

作为 `create` 的参数的 hook，其返回值有一个可选字段 `command`, 而`command` 的所有字段必须都是函数类型

我们可以在函数体内定义 更新 state 的函数，当做命令绑定到 `command` 的字段上

而 `create` 返回值的最后一个字段 `useCommand` hook 的作用，就是我们可以利用它在组件中使用这些 `command`，从而做到在组件中通知 store 更新状态

```typescript
export const {
  Store: CountStore,
  useQuery: useCountQuery,
  useCommand: useCountCommand,
} = create(() => {
  const [count, setCount] = useState(0)

  const increase = () => {
    setCount(count + 1)
  }

  return {
    query: {
      count,
    },
    command: {
      increase,
    },
  }
})
```

这里我们将它 `useCommand` 重命名为了 `useCountCommand`(再次提醒😄)并在组件中通过它取得了 `command` 字段中的函数

```typescript
const Controls = () => {
  const { increase } = useCountCommand()

  return <button onClick={increase}>+</button>
}
```

只要我们点击按钮，`increase` 就会执行并更新 store 中的 `count`

之后通过 `useCountQuery` 订阅了 `count` 的组件就被触发重渲染并拿到最新的 `count`

---
### 为什么需要 command-useCommand

有了 `query` 和 `useQuery` 组合，为什么我还需要 `command` 和 `useCommand` 组合呢？

`useCommand` 的优点是它返回的函数引用地址不会改变

这意味组件永远不会因为它，也就是不会因为 `command` 中函数引用的改变而重渲染

但是不要担心，虽然 `useCommand` 返回的函数引用地址不会改变，但它们依然能调用到最新的函数

---

### 一次查询多个 state

一次查询多个值并合并为一个值，只要 `query.salary` 或 `query.bonus` 其中一个改变就会触发重渲染

```typescript
const income = useEmployeeQuery((query) => query.salary + query.bonus)
```

一次查询多个值组合为数组返回，只要 `query.phone` 或 `query.email` 其中一个改变就会触发重渲染

```typescript
const [phone, email] = useUserQuery((query) => [query.phone, query.email])
```

一次查询多个值组合为对象返回，只要 `query.firstName` 和 `query.lastName` 以及 `query.age` 其中一个改变就会触发重渲染

```typescript
const { name, age } = useUserQuery((query) => ({
  name: `${query.firstName} ${query.lastName}`,
  age: query.age,
}))
```

`useQuery` 是否触发重渲染，是根据其第一个参数之前的返回值和下一次返回值之间做对比判断的

默认情况下，会先做一次严格比较， `Object.is(old, new)` 的话就不会重渲染

如果不严格相等且为数组这种 `object` 类型的话就会经历一次浅比较，要是还不相等就会触发重渲染

`useQuery` 第二个参数是个可选函数，我们可以自定义比较函数覆盖这种默认情况

---

## 这个库适合什么样的使用者

首先前提是你的项目正在使用 React

但是团队成员并不是那么熟悉 React 生态，或者项目起初阶段并不是那么熟悉

而现在项目的跨组件状态管理遇到了一些性能瓶颈

并且目前项目基于 `useState` 和 `useEffect` 等 React 基础 API 积累了大量业务代码

因为 API 的差距，快速重构迁移到社区流行的状态管理库不太现实

那么 **jagdai** 的 API 设计或许能帮助你降低迁移代码的难度

---

## 启发

- [Remesh](https://github.com/remesh-js/remesh) 启发了区分 state/query 和 command 的重要性。**jagdai** 当中将`query`-`useQuery` 组合与 `command`-`useCommand` 组合区分开正是这个原因。如果条件允许，我还是更希望你将 Remesh 当做首选。

- [zustand](https://github.com/pmndrs/zustand)  `useQuery` 使用 selector 风格的参数作为订阅/查询 state 的方式是受到了它的启发。

- [hox](https://github.com/umijs/hox) 如果一开始我知道有它，那么 **jagdai** 或许就不会出现。因为 **jagdai** 的前身就是因为遇到了上面提到的 **这个库适合什么样的使用者** 里那种情况，而 hox 这套方案和我的核心功能很接近，后来重构过程中也借鉴了其中不少地方。

- [ahooks](https://github.com/alibaba/hooks) 为了做到 `useCommand` “永不触发重渲染，且能调用最新的函数” 这个目标，花费了我太久的时间，直到从 **ahooks** 中的 `useMemoizedFn` 中找到了灵感

