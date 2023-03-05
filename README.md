# jagdai

English | [中文]

[english]: ./README.md
[中文]: ./README_zh_CN.md

> A beginner-friendly state management solution for React.

## Installation

Just wait a few more days.

## Usage

Create a store

First, create a store using the create function in jagdai.

The argument for create is a function that is essentially a custom React hook.

This means that you can write any type of React hook in it, such as `useState`, `useEffect`, and `useMemo`.

Therefore, we can use native React hooks like `useState` to define our store state.


```typescript
import { create } from 'jagdai'

import { useState } from 'react'

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

The return value of the custom hook passed to the `create` parameter is an object, which must contain the `query` object.

We can customize the fields of `query` and bind the states defined in the function to them one by one.

---

## Mount the Store component on the component tree

`create` returns an object, of which the `Store` field is a component. We renamed it to `CountStore` based on the usage scenario of this store (which is strongly encouraged).

We need to mount this `CountStore` component on our React tree node.

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

Only in this way can its child components or even deeper components consume the states defined in `query` before.

---

Subscribe and consume state

The `useQuery` field returned by `create` is a hook, which subscribes to and consumes the states in the `query` field returned earlier.

We renamed it to `useCountQuery` (which is strongly recommended). We must pass a subscription function to it.

Here, we subscribe to the `count` field in `query`. The component will only be re-rendered if `count` changes.

```typescript
const Count = () => {
  const count = useCountQuery((query) => query.count)

  return <div>{count}</div>
}
```

---

## Notify the store to update the state from components

As a hook parameter of `create` function, the return value of the hook has an optional field `command`, and all fields of `command` must be of function type.

We can define the function to update the state in the function body and bind it to the `command` field as a command.

The last field returned by `create`, the `useCommand` hook, allows us to use these `command` in the component and notify the store to update the state from components.

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

Here, we renamed it to `useCountCommand` (reminder 😄) and obtained the functions in the `command` field in the component through it.

```typescript
const Controls = () => {
  const { increase } = useCountCommand()

  return <button onClick={increase}>+</button>
}
```

Once we click the button, `increase` will be executed and update the `count` in the store.
Then the component subscribed to `count` through `useCountQuery` will be triggered for re-rendering and receive the latest `count`.

---

## Why do we need command-useCommand?

With the pair of `query` and `useQuery`, why do we still need `command` and `useCommand`?

The advantage of `useCommand` is that the function reference address it returns will not change.

This means that the component will never be re-rendered because of it, that is, it will not be re-rendered because of changes in the function reference in `command`.

But don't worry, although the function reference address returned by `useCommand` does not change, they can still call the latest function.

---

## Query multiple states at once

Query multiple values and combine them into one value, and re-rendering will be triggered as long as either `query.salary` or `query.bonus` changes:

```typescript
const income = useEmployeeQuery((query) => query.salary + query.bonus)
```

Query multiple values and combine them into an array return, and re-rendering will be triggered as long as either `query.phone` or `query.email` changes:

```typescript
const [phone, email] = useUserQuery((query) => [query.phone, query.email])
```

Query multiple values and combine them into an object return, and re-rendering will be triggered as long as either `query.firstName`, `query.lastName`, or `query.age` changes:

```typescript
const { name, age } = useUserQuery((query) => ({
  name: `${query.firstName} ${query.lastName}`,
  age: query.age,
}))
```

Whether `useQuery` triggers re-rendering depends on the comparison between the return value before its first parameter and the next return value.

By default, a strict comparison will be performed first. If `Object.is(old, new)` is true, there will be no re-rendering.

If they are not strictly equal and are of the `object` type, such as an array, a shallow comparison will be performed. If they are still not equal, re-rendering will be triggered.

The second parameter of `useQuery` is an optional function, and we can customize the comparison function to override this default behavior.

---

## Who is this library for?

First, the premise is that your project is using React.

However, team members may not be very familiar with the React ecosystem, or the project may not be very familiar with it in the initial stage.

Now, there are some performance bottlenecks in the cross-component state management of the project.

And currently, a large amount of business code has been accumulated based on React's basic APIs such as `useState` and `useEffect`.

Due to the difference in APIs, it is not practical to quickly refactor and migrate to popular community state management libraries.

Then, the API design of **jagdai** may help you reduce the difficulty of migrating code.

---

## Inspiration
- [Remesh](https://github.com/remesh-js/remesh) inspired the importance of distinguishing between **state/query** and **command**. The reason why jagdai distinguishes between `query`-`useQuery` combination and `command`-`useCommand` combination is for this reason. If conditions permit, I still hope you will consider Remesh as your first choice.

- [zustand](https://github.com/pmndrs/zustand) was inspired by the use of selector-style parameters in `useQuery` as a way to subscribe/query state.

- [hox](https://github.com/umijs/hox) If I had known about it at the beginning, perhaps **jagdai** would not have appeared. Because the predecessor of **jagdai** was due to the situation mentioned in **Who is this library for**?

- [ahooks](https://github.com/alibaba/hooks) To achieve the goal of "never triggering a re-render and being able to call the latest function" with `useCommand`, I spent a long time on it until I found inspiration from `useMemoizedFn` in **ahooks**.