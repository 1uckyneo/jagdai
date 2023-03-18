# Jagdai

English | [中文] | [Қазақша🇰🇿]

[English]: ./README.md
[中文]: ./README_zh_CN.md
[Қазақша🇰🇿]: ./README_kk_KZ.md

[![npm version](https://img.shields.io/npm/v/jagdai.svg?logo=npm)](https://www.npmjs.com/package/jagdai)
[![bundle size](https://img.shields.io/bundlephobia/minzip/jagdai.svg?label=bundle%20size&logo=javascript)](https://www.npmjs.com/package/jagdai)
![React](https://img.shields.io/npm/dependency-version/jagdai/peer/react?logo=react)

> A React state and event management solution with almost no learning cost.

## What is Jagdai?

Jagdai (pronounced `/ʒɑʁdɑj/`, it means "state" or "situation" in Kazakh) is a React state and event management solution with almost no learning cost.

- Almost no learning cost, easy to get started as long as you know how to use standard React Hook APIs.
- Refactoring is easy for projects without using a state management library, in order to achieve excellent performance.
- Simple and convenient cross-component event management approach.
- Excellent TypeScript type inference.

## Try it on CodeSandbox

[![Edit](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/jagdai-counter-demo-6mbbt3?file=%2Fsrc%2Fstore%2FcounterStore.ts)

## Installation

```base
npm install jagdai
```

## Usage

### Create a store

First, create a **store** using the `create` function provided in `jagdai`.

The `create` function requires you to pass in a custom React Hook that defines the **store**.

This means you can use all types of React Hooks inside the function body.

You can define your Store state using standard React APIs like `useState`.

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

However, the `create` function has specific requirements for the return value of the hook you pass as its parameter:

1. First, the return value must be an object.
2. If you want to share state across components, you need to declare an object for its `query` field and bind the state you want to share to it, indicating that components can query and subscribe to these states.

---

### Mount the Store component on the component tree

The `create` function will return an object, and the Store field is a component.

> Here, we have renamed it to `CounterStore` based on the usage scenario of this Store (you should do the same).

You need to mount the `CounterStore` component onto a node of the React tree.

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

Only in this way can its child components and even deeper-level components consume the state defined in the `query`.

---

### Query and consume state

The `useQuery` field in the object returned by `create` is a React Hook that allows you to query and consume the state declared in the query field of the Store.

You must pass it a selector as an argument so that it can listen for changes to the subscribed states and decide whether to re-render the component.

> Here, `useQuery` is associated with `CounterStore`, so we have renamed it to `useCounterQuery` (you should do the same).

For example, if you subscribe to the count field in the `query`, the component will only re-render when `count` updates.

```jsx
const Count = () => {
  const count = useCounterQuery((query) => query.count)

  return <div>{count}</div>
}
```

---

### Sending commands to the store in components

In addition to declaring the `query` field, you can also declare the `command` field when defining a store, which represents the commands that components can send to the store.

For example, you can define a function in the store-definition's function body to update the state and bind it to the `command` field.

The object returned by `create` also has a `useCommand` field, which is also a Hook that allows you to send commands to the store in a component.

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

> Here, `useCommand` is associated with `CounterStore`, so we have renamed it to `useCounterCommand` (you should do the same).

```jsx
const Controls = () => {
  const { increase } = useCounterCommand()

  return <button onClick={increase}>+</button>
}
```

Whenever the button is clicked, `increase` is executed and updates the `count` in the store.

Then, components subscribed to `count` through `useCounterQuery` are triggered to re-render and get the latest `count`.

---

### Why do I need `command`-`useCommand`?

> With the pair of `query` and `useQuery`, I can share functions as a type of state with components. Why do I still need `command` and `useCommand`?

The advantage of `useCommand` is that **_the component will never re-render because of it_**

This is because the return value of `useCommand` is constant. This means that the component will never re-render because the function field defined in `command` points to a new function.

But don't worry: even though the return value of `useCommand` is constant, the function obtained in the component will still call the latest function in the store when invoked.

---

### Store-event

In the process of developing business with React, having only state is sometimes not enough.

For example, there may be scenarios where illegal command parameters are entered, and the Store state does not change but the component needs to be aware of it.

> TypeScript can only help us avoid illegal parameter types, but in some cases we can only check at runtime, such as when some scenarios require server confirmation.

#### Creating store-event

In addition to `create`, Jagdai also provides the `useStoreEvent` hook for creating store-event.

```typescript
import { create, useStoreEvent } from 'jagdai'
```

You can use `useStoreEvent` in the function body where you define your store to create a **store-event**, and its return value is a function used to emit this event.

> Emitting event can carry a parameter. If your project environment is based on TypeScript, you can specify the type of its parameter.

```typescript
export const {
  Store: CounterStore,
  useQuery: useCounterQuery,
  useCommand: useCounterCommand,
  useEvent: useCounterEvent,
} = create(() => {
  const [count, setCount] = useState(0)

  const updateFail = useStoreEvent<string>()

  const update = (value: number) => {
    setCount(value)

    if (value === count) {
      updateFail(`The count is already ${count}`)
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
      updateFail,
    },
  }
})
```

Here, based on the previous example, an `updateFail` **event** and an `update` **command** are added.

The `update` command updates `count` to the number from the `update` argument, and if `count` and the `update` argument are already equal, it emits an `updateFail` event (calling itself) to indicate that `count` cannot be updated.

Similar to `query` and `command`, if you want to subscribe to this event in components, you need to bind the event to a field of the `event` object.

The return value of `create` has a `useEvent` field, which is used to subscribe to events in the store from components.

> As usual, it is renamed to `useCounterEvent` here (you should do the same).

#### Subscribing to store-event

`useEvent` takes two parameters:

1. The event name, which must be one of the fields in the event object returned by the Hook parameter of `create`.
2. The event listener function.

```jsx
const Controls = () => {
  const { increase, update } = useCounterCommand()

  useCounterEvent('updateFail', (arg) => {
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

---

### Query multiple states at once

Query multiple states and combine them into one value, and re-rendering will be triggered as long as either `query.salary` or `query.bonus` changes:

```typescript
const income = useEmployeeQuery((query) => query.salary + query.bonus)
```

Query multiple states and combine them into an array return, and re-rendering will be triggered as long as either `query.phone` or `query.email` changes:

```typescript
const [phone, email] = useUserQuery((query) => [query.phone, query.email])
```

Query multiple states and combine them into an object return, and re-rendering will be triggered as long as either `query.firstName`, `query.lastName`, or `query.age` changes:

```typescript
const { name, age } = useUserQuery((query) => ({
  name: `${query.firstName} ${query.lastName}`,
  age: query.age,
}))
```

Whether `useQuery` triggers a re-render is determined by comparing the return value from its first function-type parameter between the previous and the next.

By default, a strict comparison will be performed first. If `Object.is(old, new)` is `true`, there will be no re-rendering.

If they are not strictly equal and are of the `object` type, such as an array, a shallow comparison will be performed. If they are still not equal, re-rendering will be triggered.

The second parameter of `useQuery` is an optional function, and you can customize the comparison function to override this default behavior.

---

## Inspiration

- [Remesh](https://github.com/remesh-js/remesh): In Jagdai's design of APIs such as `query`, `command`, and `event`, there are many traces of imitation of Remesh. If the conditions are appropriate, especially for developing large projects, I hope that the more powerful and advanced Remesh can become your preferred choice.

- [Hox](https://github.com/umijs/hox): Jagdai was born because there was a project that did not use a state management library, and because the frequent re-renders caused performance problems that were unacceptable, a low-cost refactoring solution was needed. If we had known about Hox at that time, Jagdai might not have been created. In addition, the problem of nesting the same Store component within the Store component also borrowed the solution from Hox.

- [Zustand](https://github.com/pmndrs/zustand): The selector-style API of Zustand inspired the design of `useQuery`.
