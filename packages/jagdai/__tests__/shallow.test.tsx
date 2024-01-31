import type { FC } from 'react'
import { useState } from 'react'
import { render, fireEvent } from '@testing-library/react'

import { shallow } from '../src/shallow'
import { create, useShallow } from '../src'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore config react testing environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('shallow', () => {
  it('compares primitive values', () => {
    expect(shallow(true, true)).toBe(true)
    expect(shallow(true, false)).toBe(false)

    expect(shallow(1, 1)).toBe(true)
    expect(shallow(1, 2)).toBe(false)

    expect(shallow('jagdai', 'jagdai')).toBe(true)
    expect(shallow('jagdai', 'zustand')).toBe(false)
  })

  it('compares objects', () => {
    expect(shallow({ foo: 'bar', asd: 123 }, { foo: 'bar', asd: 123 })).toBe(
      true,
    )

    expect(
      shallow({ foo: 'bar', asd: 123 }, { foo: 'bar', foobar: true }),
    ).toBe(false)

    expect(
      shallow({ foo: 'bar', asd: 123 }, { foo: 'bar', asd: 123, foobar: true }),
    ).toBe(false)
  })

  it('compares arrays', () => {
    expect(shallow([1, 2, 3], [1, 2, 3])).toBe(true)

    expect(shallow([1, 2, 3], [2, 3, 4])).toBe(false)

    expect(
      shallow([{ foo: 'bar' }, { asd: 123 }], [{ foo: 'bar' }, { asd: 123 }]),
    ).toBe(false)

    expect(shallow([{ foo: 'bar' }], [{ foo: 'bar', asd: 123 }])).toBe(false)
  })

  it('compares Maps', () => {
    function createMap<T extends object>(obj: T) {
      return new Map(Object.entries(obj))
    }

    expect(
      shallow(
        createMap({ foo: 'bar', asd: 123 }),
        createMap({ foo: 'bar', asd: 123 }),
      ),
    ).toBe(true)

    expect(
      shallow(
        createMap({ foo: 'bar', asd: 123 }),
        createMap({ foo: 'bar', foobar: true }),
      ),
    ).toBe(false)

    expect(
      shallow(
        createMap({ foo: 'bar', asd: 123 }),
        createMap({ foo: 'bar', asd: 123, foobar: true }),
      ),
    ).toBe(false)
  })

  it('compares Sets', () => {
    expect(shallow(new Set(['bar', 123]), new Set(['bar', 123]))).toBe(true)

    expect(shallow(new Set(['bar', 123]), new Set(['bar', 2]))).toBe(false)

    expect(shallow(new Set(['bar', 123]), new Set(['bar', 123, true]))).toBe(
      false,
    )
  })

  it('compares functions', () => {
    function firstFnCompare() {
      return { foo: 'bar' }
    }

    function secondFnCompare() {
      return { foo: 'bar' }
    }

    expect(shallow(firstFnCompare, firstFnCompare)).toBe(true)

    expect(shallow(secondFnCompare, secondFnCompare)).toBe(true)

    expect(shallow(firstFnCompare, secondFnCompare)).toBe(false)
  })
})

describe('useShallow', () => {
  let ageSnapshot = 23

  const UserStore = create(() => {
    const [firstName, setFirstName] = useState('Lumine')
    const [lastName, setLastName] = useState('Lee')
    const [age, setAge] = useState(ageSnapshot)
    const [noiseCount, setNoiseCount] = useState(0)

    const increaseNoiseCount = () => setNoiseCount((c) => c + 1)

    return {
      query: {
        firstName,
        lastName,
        age,
        noiseCount,
      },
      command: {
        setFirstName,
        setLastName,
        setAge,
        increaseNoiseCount,
      },
    }
  })

  it('UserStore changes causes unrelated components without useShallow', async () => {
    const nameRenderSpy = jest.fn()

    const Name: FC = () => {
      const [firstName, lastName] = UserStore.useQuery((query) => [
        query.firstName,
        query.lastName,
      ])

      nameRenderSpy()

      return (
        <>
          <div>{firstName}</div>
          <div>{lastName}</div>
        </>
      )
    }

    const AgeControls: FC = () => {
      const { setAge } = UserStore.useCommand()

      const increaseAge = () =>
        setAge((age) => {
          return (ageSnapshot = age + 1)
        })

      return <button onClick={increaseAge}>increaseAge</button>
    }

    const { getByText } = render(
      <UserStore.Provider>
        <Name />
        <AgeControls />
      </UserStore.Provider>,
    )

    fireEvent.click(getByText('increaseAge'))
    fireEvent.click(getByText('increaseAge'))

    expect(nameRenderSpy).toHaveBeenCalledTimes(3) // mounted once, re-render twice
  })

  it('UserStore changes do not cause unrelated components to re-render with useShallow', async () => {
    const nameRenderSpy = jest.fn()

    const Name: FC = () => {
      const [firstName, lastName] = UserStore.useQuery(
        useShallow((query) => [query.firstName, query.lastName]),
      )

      nameRenderSpy()

      return (
        <>
          <div>{firstName}</div>
          <div>{lastName}</div>
        </>
      )
    }

    const AgeControls: FC = () => {
      const { setAge } = UserStore.useCommand()

      const increaseAge = () =>
        setAge((age) => {
          return (ageSnapshot = age + 1)
        })

      return <button onClick={increaseAge}>increaseAge</button>
    }

    const { getByText } = render(
      <UserStore.Provider>
        <Name />
        <AgeControls />
      </UserStore.Provider>,
    )

    fireEvent.click(getByText('increaseAge'))
    fireEvent.click(getByText('increaseAge'))

    expect(nameRenderSpy).toHaveBeenCalledTimes(1) // mounted once
  })

  it('UserStore changes causes only related components to re-render with useShallow', async () => {
    const nameRenderSpy = jest.fn()

    const Display: FC = () => {
      const { name, age } = UserStore.useQuery(
        useShallow((query) => ({
          name: `${query.firstName} ${query.lastName}`,
          age: query.age,
        })),
      )

      nameRenderSpy()

      return (
        <div>
          <div>Full Name: {name}</div>
          <div>Age: {age}</div>
        </div>
      )
    }

    const AgeControls: FC = () => {
      const { setAge, increaseNoiseCount } = UserStore.useCommand()

      const increaseAge = () =>
        setAge((age) => {
          return (ageSnapshot = age + 1)
        })

      return (
        <>
          <button onClick={increaseAge}>increaseAge</button>
          <button onClick={increaseNoiseCount}>increaseNoiseCount</button>
        </>
      )
    }

    const { findByText, getByText } = render(
      <UserStore.Provider>
        <Display />
        <AgeControls />
      </UserStore.Provider>,
    )

    fireEvent.click(getByText('increaseAge'))
    fireEvent.click(getByText('increaseAge'))
    fireEvent.click(getByText('increaseNoiseCount'))
    fireEvent.click(getByText('increaseNoiseCount'))

    expect(nameRenderSpy).toHaveBeenCalledTimes(3) // mounted once, re-render twice

    await findByText('Full Name: Lumine Lee')
    await findByText(`Age: ${ageSnapshot}`)
  })
})
