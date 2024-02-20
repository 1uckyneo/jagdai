# Jagdai

English | [中文] | [Қазақша🇰🇿]

[English]: ./README.md
[中文]: ./README_zh_CN.md
[Қазақша🇰🇿]: ./README_kk_KZ.md

[![npm version](https://img.shields.io/npm/v/jagdai.svg?logo=npm)](https://www.npmjs.com/package/jagdai)
[![bundle size](https://img.shields.io/bundlephobia/minzip/jagdai.svg?label=bundle%20size&logo=javascript)](https://www.npmjs.com/package/jagdai)
![React](https://img.shields.io/npm/dependency-version/jagdai/peer/react?logo=react)

> A React state and event management solution with almost no refactoring cost.

## What is Jagdai?

Jagdai (pronounced `/ʒɑʁdɑj/`, it means "state" or "situation" in Kazakh) is a React state and event management solution with almost no refactoring cost.

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

First, create a **store** using the `create` function provided in **jagdai**.

The `create` function requires you to pass in a custom React Hook that defines the store.

This means you can use all types of React Hooks inside the function body.

You can define your store state using standard React APIs like `useState`.

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

However, the `create` function has specific requirements for the return value of the hook you pass as its parameter:

1. First, the return value must be an object.
2. If you want to share cross-component state, you need to declare an object for its `query` field and bind the shared states one by one within it, indicating that components can query and subscribe to these states.

---

### Mount the store-provider component on the component tree

The create function will return an object, which has a `Provider` field that is a component.

> Here, we named it to `CounterStore` based on the usage scenario of this store.

You need to mount the `Provider` component onto a node of the React tree.

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

Only in this way can its child components and even deeper-level components consume the state defined in the `query`.

---

### Query and consume state

The `useQuery` field in the object returned by `create` is a React Hook that allows you to query and consume the state declared in the query field of the store.

You must pass it a selector as an argument so that it can listen for changes to the subscribed states and decide whether to re-render the component.

For example, if you subscribe to the count field in the `query`, the component will only re-render when `count` updates.

```jsx
const Count = () => {
  const count = CounterStore.useQuery((query) => query.count)

  return <div>{count}</div>
}
```

---

### Sending commands to the store in components

In addition to declaring the `query` field, you can also declare the `command` field when defining a store, which represents the commands that components can send to the store.

For example, you can define a function in the store-definition's function body to update the state and bind it to the `command` field.

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

The `create` return value contains a `useCommand` field, which is also a Hook. You can use it to access the commands defined in the store.

```jsx
const Controls = () => {
  const { increase } = CounterStore.useCommand()

  return <button onClick={increase}>+</button>
}
```

Whenever the button is clicked, `increase` is executed and updates the `count` in the store.

Then, components subscribed to `count` through `CounterStore.useQuery` are triggered to re-render and get the latest `count`.

---

### Why do I need `command`-`useCommand`?

> With the pair of `query` and `useQuery`, I can share functions as a type of state with components. Why do I still need `command` and `useCommand`?

The advantage of `useCommand` is that **_the component will never re-render because of it_**

This is because the return value of `useCommand` is constant. This means that the component will never re-render because the function field defined in `command` points to a new function.

But don't worry: even though the return value of `useCommand` is constant, the function obtained in the component will still call the latest function in the store when invoked.

---

### Store-event

In the process of developing with React, having only state is sometimes not enough.

For example, there may be scenarios where illegal command parameters are entered, and the store-state does not change but the component needs to be aware of it.

> TypeScript can only help us avoid illegal parameter types, but in some cases we can only check at runtime, such as when some scenarios require server confirmation.

#### Create a store-event

In addition to `create`, Jagdai also provides the `useEvent` hook for creating store events.

```typescript
import { create, useEvent } from 'jagdai'
```

You can define a _store-event_ using `useEvent` similar to how you define a _state_ using `useState`. The return value of `useEvent` is a function that can be used to dispatch this event.

> Emitting event can carry a parameter. If your project environment is based on TypeScript, you can specify the type of its parameter.

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

Here, based on the previous example, an `onUpdateFail` **event** and an `update` **command** are added.

The `update` command updates `count` to the number from the `update` argument, and if `count` and the `update` argument are already equal, it emits an `onUpdateFail` event (calling itself) to indicate that `count` cannot be updated.

Similar to `query` and `command`, if you want to subscribe to this event in components, you need to bind the event to a field of the `event` object.

The return value of `create` has a `useEvent` field, which is used to subscribe to events in the store from components.

#### Subscribing to store-event

The `useEvent` field in the return value of `create` requires two parameters:

1. The event name, which must be one of the fields in the event object returned by the Hook parameter of `create`.
2. The event listener function.

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

If you want to subscribe to the _event_ defined using `useEvent` within the store, it's also very simple:

Just pass the listener function as a parameter when defining the _event_ using `useEvent`.

```typescript
const onUpdateFail = useEvent((reason: string) => {
  console.log(`Update failed, the reason is ${reason}`)
})
```

---

### Query multiple states at once

#### Primitive types

```typescript
const income = EmployeeStore.useQuery((query) => query.salary + query.bonus)
```

If either `query.salary` or `query.bonus` changes, it will trigger a re-render of the component.

#### Shallow comparison

When multiple states are combined into an object type returned, `jagdai` provides `useShallow` for determining updates through shallow comparison. The usage is as follows:

```typescript
import { useShallow } from 'jagdai'

// ...

const [phone, email] = UserStore.useQuery(
  useShallow((query) => [query.phone, query.email]),
)
```

If either `query.phone` or `query.email` changes, it will trigger a re-render of the component.

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

If any of `query.firstName`, `query.lastName`, or `query.age changes`, it will trigger a re-render of the component.

By default, `useQuery` uses strict equality comparison `Object.is(old, new)` to detect changes.

- In `jagdai`, `useShallow` is provided to be used in combination with `useQuery`, employing a shallow comparison approach to decide whether to re-render.

- For more complex situations, `useQuery` offers a second optional argument, allowing you to customize the comparison function to override this default behavior.

---

## Inspiration

- [Remesh](https://github.com/remesh-js/remesh): In Jagdai's design of APIs such as `query`, `command`, and `event`, there are many traces of imitation of Remesh. If the conditions are appropriate, especially for developing large projects, I hope that the more powerful and advanced Remesh can become your preferred choice.

- [Hox](https://github.com/umijs/hox): Jagdai was born because there was a project that did not use a state management library, and because the frequent re-renders caused performance problems that were unacceptable, a low-cost refactoring solution was needed. If we had known about Hox at that time, Jagdai might not have been created. In addition, the problem of nesting the same Store component within the Store component also borrowed the solution from Hox.

- [Zustand](https://github.com/pmndrs/zustand): The selector-style API of Zustand inspired the design of `useQuery`.
