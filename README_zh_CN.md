# Jagdai

[English] | 中文 | [Қазақша🇰🇿]

[English]: ./README.md
[中文]: ./README_zh_CN.md
[Қазақша🇰🇿]: ./README_kk_KZ.md

[![npm version](https://img.shields.io/npm/v/jagdai.svg?logo=npm)](https://www.npmjs.com/package/jagdai)
[![bundle size](https://img.shields.io/bundlephobia/minzip/jagdai.svg?label=bundle%20size&logo=javascript)](https://www.npmjs.com/package/jagdai)
![React](https://img.shields.io/npm/dependency-version/jagdai/peer/react?logo=react)

> 一款几乎没有迁移成本的 React 状态与事件管理方案

## 什么是 Jagdai?

Jagdai（发音 `/ʒɑʁdɑj/`，哈萨克语含义「状态」或「情况」）是一款几乎没有迁移成本的 React 状态与事件管理方案。

- 几乎没有学习成本，只要会使用标准 React Hook APIs 就能轻松上手
- 迁移成本低，对于尚未使用状态管理库的项目来说，该方案可以轻松重构，同时确保出色的性能
- 简单、方便的跨组件事件管理方式
- 出色的 TypeScript 类型推导

## 在线体验

[![Edit](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/jagdai-counter-demo-6mbbt3?file=%2Fsrc%2Fstore%2FcounterStore.ts)

## 安装

```base
npm install jagdai
```

## 使用

### 创建 store

首先通过 **jagdai** 当中的 `create` 函数创建 **store**

`create` 的参数要求你传入一个你自定义的 React Hook 用于定义 store

这意味着你可以在这个函数体内调用所有类型的 React Hook

所以你可以使用像 `useState` 这样的标准 React API 定义你的 store 状态

```typescript
import { create } from 'jagdai'
import { useState } from 'react'

export const CounterStore = create(() => {
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

### 在组件树上挂载 store-provider 组件

`create` 会返回一个对象，其中 `Provider` 字段是一个组件

> 这里根据这个 store 的使用场景将它命名为了 `CounterStore`

你需要将这个 `Provider` 组件挂载到 React 树节点上

```jsx
const CounterApp = () => {
  return (
    <CounterStore.Provider>
      <Count />
      <Controls />
    </CounterStore.Provider>
  )
}
```

只有这样它的子组件甚至更深层次的组件内才可以消费在 `query` 中定义的状态

---

### 查询并消费状态

`create` 返回对象中的 `useQuery` 字段是一个 React Hook，它的作用是查询并消费你为 store 声明的 `query` 字段中的状态

你必须给它传参一个选择器，这样它会监听你订阅的 state 的变更与否来决定是否重渲染这个组件

比如这里订阅了 `query` 中的 `count` 字段，那只有 `count` 更新，这个组件才会重新渲染

```jsx
const Count = () => {
  const count = CounterStore.useQuery((query) => query.count)

  return <div>{count}</div>
}
```

---

### 在组件中给 store 发送命令

定义 store 除了可以声明 `query` 字段以外，你还可以声明 `command` 字段，代表组件可以给 store 发送的命令

比如你可以在定义 store 的函数体内定义 更新 state 的函数，并把它绑定到 `command` 的字段上

```typescript
export const CounterStore = create(() => {
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

而 `create` 返回值中有 `useCommand` 字段，它同样是一个 Hook, 你可以通过它取得 store 中定义的命令

```jsx
const Controls = () => {
  const { increase } = CounterStore.useCommand()

  return <button onClick={increase}>+</button>
}
```

只要点击按钮，`increase` 就会执行并更新 store 中的 `count`

之后通过 `CounterStore.useQuery` 订阅了 `count` 的组件就被触发重渲染并拿到最新的 `count`

---

### 为什么需要 `command`-`useCommand`?

> 有了 `query` 和 `useQuery` 这对组合，我可以把函数当做一种 state 分享给组件。我为什么还需要 `command` 和 `useCommand` 呢？

`useSCommand` 的优点是：**_组件永远不会因为它而重渲染_**

因为它的返回值是恒定的。这意味组件永远不会因为你在 `command` 中定义的函数字段指向新的函数而重渲染

但请不要担心，虽然 `useCommand` 的返回值是恒定的，但组件中拿到的函数在调用时，依然会调用 Store 中最新的函数

---

### Store 事件

在用 React 开发项目的过程中，有些场景下光有 state 是不够的

比如，非法的 command 参数输入，store-state 不会改变但却要被组件感知的场景

> TypeScript 只能帮助我们规避非法参数的类型，但是有些情况我们只能在运行时检查，比如有些场景需要服务端确认

#### 创建 store 事件

Jagdai 除了 `create` 外还提供了 `useEvent` 这个 Hook，用以创建 store 事件

```typescript
import { create, useEvent } from 'jagdai'
```

你可以像使用 `useState` 定义一个 state 一样，使用 `useEvent` 定义一个 **store-event**，它的返回值是一个函数，用于发送这个事件

> 发送事件可以携带一个参数。如果你的项目环境基于 TypeScript, 你可以为其参数指定类型

```typescript
export const CounterStore = create(() => {
  const [count, setCount] = useState(0)

  const onUpdateFail = useEvent<string>()

  const update = (value: number) => {
    setCount(value)

    if (value === count) {
      onUpdateFail(`The count is already ${count}`)
    }
  }

  const increase = () => {
    update(count + 1)
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
      onUpdateFail,
    },
  }
})
```

这里基于之前的示例，新增了一个 `onUpdateFail` event，和 `update` command.

`update` 的作用是将 `count` 更新至 `update` 参数的数字，并且在 `count` 和 `update` 参数已经相等的情况下，发送一个 `onUpdateFail` 事件（调用它自己），表示 `count` 无法更新

就像 `query` 和 `command`, 如果你需要在组件中订阅这个事件就需要将事件绑定在 `event` 对象的字段上

`create` 返回值中有 `useEvent` 字段，它的作用是在组件中订阅这个 store 中的事件

#### 订阅 store 事件

`create` 返回值中的 `useEvent`字段需要两个参数:

1. 事件名称，必须是 `create` 参数 Hook 的返回值中 `event` 的字段之一
2. 这个事件的监听函数

```jsx
const Controls = () => {
  const { increase, update } = CounterStore.useCommand()

  CounterStore.useEvent('onUpdateFail', (arg) => {
    console.log(arg)
  })

  const [input, setInput] = useState(0)

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

如果你想在 store 内部订阅这个使用 `useEvent` 定义的事件，那也非常简单：

只需要在用 `useEvent` 定义这个事件的时候，传参给它监听函数

```typescript
const onUpdateFail = useEvent((reason: string) => {
  console.log(`Update failed, the reason is ${reason}`)
})
```

---

### 一次查询多个 state

#### 基础类型

```typescript
const income = EmployeeStore.useQuery((query) => query.salary + query.bonus)
```

只要 `query.salary` 或 `query.bonus` 其中一个改变就会触发组件重渲染

#### 浅比较

多个状态合并为对象类型返回，`jagdai` 中提供了 `useShallow` 以浅比较判断是否更新，用法如下：

```typescript
import { useShallow } from 'jagdai'

// ...

const [phone, email] = UserStore.useQuery(
  useShallow((query) => [query.phone, query.email]),
)
```

只要 `query.phone` 或 `query.email` 其中一个改变就会触发组件重渲染

```typescript
import { useShallow } from 'jagdai'

// ...

const { name, age } = UserStore.useQuery(
  useShallow((query) => ({
    name: `${query.firstName} ${query.lastName}`,
    age: query.age,
  })),
)
```

只要 `query.firstName` 和 `query.lastName` 以及 `query.age` 其中一个改变就会触发组件重渲染

`useQuery` 默认使用使用严格相等比较 `Object.is(old, new)` 来检测变化

- `jagdai` 中提供了 `useShallow` 与 `useQuery` 组合使用，使用浅层比较的方式判断是否重渲染

- 对于更复杂的情况， `useQuery` 提供了第二个可选参数项，你可以自定义比较函数，覆盖这种默认情况

---

## 灵感来源

- [Remesh](https://github.com/remesh-js/remesh): Jagdai 的 `query`, `command`, `event` 等 API 设计，存在许多对 Remesh 模仿的痕迹。如果条件合适，尤其是开发大型的项目，我希望更强大、更先进的 Remesh 成为你的首选。

- [Hox](https://github.com/umijs/hox): Jagdai 诞生的最初原因，是因为有一个未使用状态管理库的项目，因为重渲染太频繁，性能问题已经到了不可接受的程度，需要一个低成本的重构方案。当时要是知道已经有了 Hox，那 Jagdai 或许就不会诞生。另外 Store 组件中嵌套同一 Store 组件产生的问题，也借鉴了 Hox 的解决方案。

- [Zustand](https://github.com/pmndrs/zustand): selector 风格的 API，启发了 `useQuery` 的设计。
