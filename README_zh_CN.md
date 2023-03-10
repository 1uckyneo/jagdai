# Jagdai

[English] | 中文 | [Қазақша🇰🇿]

[English]: ./README.md
[中文]: ./README_zh_CN.md
[Қазақша🇰🇿]: ./README_kk_KZ.md

## 什么是 Jagdai?

Jagdai（发音 `/ʒɑʁdɑj/`，哈萨克语含义「状态」或「情况」）一款几乎没有学习成本的 React 状态与事件管理方案。

- 几乎没有学习成本，只要会使用标准 React Hook APIs 就能轻松上手
- 易于未使用状态管理库开发的项目重构，以获得优秀的性能
- 简单、方便的跨组件事件管理方式
- 优秀的 TypeScript 类型推导

## 安装

```base
npm install jagdai
```

## 使用

### 创建 Store

首先通过 **jagdai** 当中的 `create` 函数创建 **Store**

`create` 的参数要求你传入一个你自定义的 React Hook 用于定义 Store

这意味着你可以在这个函数体内调用所有类型的 React Hook

所以你可以使用像 `useState` 这样的标准 React API 定义你的 Store 状态

```typescript
import { create } from 'jagdai'
import { useState } from 'react'

export const { Store: CounterStore, useQuery: useCounterQuery } = create(() => {
  const [count, setCount] = useState(0)

  return {
    query: {
      count,
    },
  }
})
```

只不过 `create` 的参数 hook 的返回值有所要求：

1. 首先它的返回值必须是一个对象
2. 如果你要分享跨组件的 state，你需要为其 `query` 字段声明一个对象，并把你要分享的 state 一一绑定到其中，代表组件可以查询和订阅这些 state

---

### 在组件树上挂载 Store 组件

`create` 会返回一个对象，其中 `Store` 字段是一个组件

> 这里根据这个 Store 的使用场景将它重命名为了 `CounterStore`（你也应该这么做）

你需要将这个 `CounterStore` 组件挂载到 React 树节点上

```jsx
const CounterApp = () => {
  return (
    <CounterStore>
      <Count />
      <Controls />
    </CounterStore>
  )
}
```

只有这样它的子组件甚至更深层次的组件内才可以消费在 `query` 中定义的状态

---

### 查询并消费状态

`create` 返回对象中的 `useQuery` 字段是一个 React Hook，它的作用是查询并消费你为 Store 声明的 `query` 字段中的状态

你必须给它传参一个选择器，这样它会监听你订阅的 state 的变更与否来决定是否重渲染这个组件

> 这里的 `useQuery` 与 `CounterStore` 关联, 所以将它重命名为 `useCounterQuery`（你也应该这么做）

比如这里订阅了 `query` 中的 `count` 字段，那只有 `count` 更新，这个组件才会重新渲染

```jsx
const Count = () => {
  const count = useCounterQuery((query) => query.count)

  return <div>{count}</div>
}
```

---

### 在组件中给 store 发送命令

定义 store 除了可以声明 `query` 字段以外，我还可以声明 `command` 字段，代表组件可以给 store 发送的命令

比如你可以在定义 store 的函数体内定义 更新 state 的函数，并把它绑定到 `command` 的字段上

而 `create` 返回值中有 `useCommand` 字段，它同样是一个 Hook, 你可以利用它在组件中给 store 发送命令

```typescript
export const {
  Store: CounterStore,
  useQuery: useCounterQuery,
  useCommand: useCounterCommand,
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

> 这里的 `useCommand` 与 `CounterStore` 关联, 所以将它重命名为 `useCounterCommand`（你也应该这么做）

```jsx
const Controls = () => {
  const { increase } = useCounterCommand()

  return <button onClick={increase}>+</button>
}
```

只要点击按钮，`increase` 就会执行并更新 store 中的 `count`

之后通过 `useCounterQuery` 订阅了 `count` 的组件就被触发重渲染并拿到最新的 `count`

---

### 为什么需要 command-useCommand

> 有了 `query` 和 `useQuery` 这对组合，我可以把函数当做一种 state 分享给组件。为什么还需要 `command` 和 `useCommand` 呢？

`useCommand` 的优点是：**组件永远不会因为它而重渲染**

因为它的返回值是恒定的。这意味组件永远不会因为你在 `command` 中定义的函数字段指向新的函数而重渲染

但请不要担心，虽然 `useCommand` 的返回值是恒定的，但组件中拿到的函数在调用时，依然会调用 Store 中最新的函数

---

### Store 事件

在用 React 开发业务的过程中，有场景下光有 state 是不够的

比如，非法的 command 参数输入，Store state 不会改变但却要被组件感知的场景

> TypeScript 只能帮助我们规避非法参数的类型，但是有些情况我们只能在运行时检查，比如有些场景需要服务端确认

#### 创建 store 事件

Jagdai 除了 `create` 外还提供了 `useStoreEvent` 这个 Hook，用以创建 store 事件

```typescript
import { create, useStoreEvent } from 'jagdai'
```

你可以在定义 Store 的函数体使用 `useStoreEvent` 创建一个 **store-event**，它的返回值是一个函数，用于发送这个事件

> 发送事件可以携带一个参数。如果你的项目环境基于 TypeScript, 你可以为其参数指定类型

```typescript
export const {
  Store: CounterStore,
  useQuery: useCounterQuery,
  useCommand: useCounterCommand,
  useEvent: useCounterEvent,
} = create(() => {
  const [count, setCount] = useState(0)

  const increase = () => {
    setCount(count + 1)
  }

  const updateFail = useStoreEvent<string>()

  const update = (num: number) => {
    setCount(num)

    if (count === num) {
      updateFail(`The count is already ${count}`)
    }
  }

  return {
    query: {
      count,
    },
    command: {
      increase,
      update,
    },
    event: {
      updateFail,
    },
  }
})
```

这里基于之前的示例，新增了一个 `updateFail` event，和 `update` command.

`update` 的作用是将 `count` 更新至 `update` 参数的数字，并且在 `count` 和 `update` 参数已经相等的情况下，发送一个 `updateFail` 事件（调用它自己），表示 `count` 无法更新

就像 `query` 和 `command`, 如果你需要在组件中订阅这个事件就需要将事件绑定在 `event` 对象的字段上

`create` 返回值中有 `useEvent` 字段，它的作用是在组件中订阅这个 Store 中的事件

> 依照惯例，这里将它重命名为了 `useCounterEvent`（你也应该这么做）

#### 订阅 store 事件

`useEvent` 需要两个参数:

1. 事件名称，必须是 `create` 参数 Hook 的返回值中 `event` 的字段之一
2. 这个事件的监听函数

```jsx
const Controls = () => {
  const { increase, update } = useCounterCommand()

  useCounterEvent('updateFail', (arg) => {
    console.log(arg)
  })

  return (
    <>
      <input
        type="number"
        onChange={(e) => {
          setInput(parseInt(e.target.value, 10))
        }}
      />
      <button onClick={() => update(input)}>update to {input}</button>
      <button onClick={increase}>+</button>
    </>
  )
}
```

---

### 一次查询多个 state

一次查询多个状态并合并为一个值，只要 `query.salary` 或 `query.bonus` 其中一个改变就会触发重渲染：

```typescript
const income = useEmployeeQuery((query) => query.salary + query.bonus)
```

一次查询多个状态组合为数组返回，只要 `query.phone` 或 `query.email` 其中一个改变就会触发重渲染：

```typescript
const [phone, email] = useUserQuery((query) => [query.phone, query.email])
```

一次查询多个状态组合为对象返回，只要 `query.firstName` 和 `query.lastName` 以及 `query.age` 其中一个改变就会触发重渲染：

```typescript
const { name, age } = useUserQuery((query) => ({
  name: `${query.firstName} ${query.lastName}`,
  age: query.age,
}))
```

`useQuery` 是否触发重渲染，是根据其第一个参数之前的返回值和下一次返回值之间做对比判断的

默认情况下，会先做一次严格比较， `Object.is(old, new)` 为 `true` 就不会重渲染

如果不严格相等且为数组这种 `object` 类型的话就会经历一次浅比较，要是还不相等就会触发重渲染

`useQuery` 第二个参数是个可选函数，你可以自定义比较函数覆盖这种默认情况

---

## 灵感来源

- [Remesh](https://github.com/remesh-js/remesh) Jagdai 的 `query`, `command`, `event` 等 API 设计，存在许多对 Remesh 模仿的痕迹。如果条件合适，尤其是开发大型的项目，我希望更强大、更先进的 Remesh 成为你的首选。

- [Hox](https://github.com/umijs/hox) Jagdai 诞生的最初原因，是因为有一个未使用状态管理库的项目，因为重渲染太频繁，性能问题已经到了不可接受的程度，需要一个低成本的重构方案。当时要是知道已经有了 Hox，那 Jagdai 或许就不会诞生。另外 Store 组件中嵌套同一 Store 组件产生的问题，也借鉴了 Hox 的解决方案。

- [Zustand](https://github.com/pmndrs/zustand) selector 风格的 API，启发了 `useQuery` 的设计。
