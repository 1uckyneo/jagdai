# Jagdai

[English] | [中文] | Қазақша🇰🇿

[English]: ./README.md
[中文]: ./README_zh_CN.md
[Қазақша🇰🇿]: ./README_kk_KZ.md

[![npm version](https://img.shields.io/npm/v/jagdai.svg?logo=npm)](https://www.npmjs.com/package/jagdai)
[![bundle size](https://img.shields.io/bundlephobia/minzip/jagdai.svg?label=bundle%20size&logo=javascript)](https://www.npmjs.com/package/jagdai)
![React](https://img.shields.io/npm/dependency-version/jagdai/peer/react?logo=react)

> Бұл, React state және event басқаруды бақылауға арналған жағдайлы шешімді үйрену мүлдемсыз бағдарлама.

## Jagdai деген не?

Jagdai(дыбысы `/ʒɑʁdɑj/`, Жағдай) Бұл, React state және event басқаруды бақылауға арналған жағдайлы шешімді үйрену мүлдемсыз бағдарлама.

- Тәртіптік React Hook API ларын пайдалануға білгенде әдісімен үйрену қиын емес, көптеген кіру-шығуларда қолайлы.
- Статус бақылау библиотекаларын қолданбасаңыз да, әрекеттілікті молайтын жаңарту жобаларын оңтайлы дайындауға болады.
- Компоненттердің арасындағы оңай және қиынсұрапсыз event бақылау жолдары.
- Өте жақсы TypeScript түрліктіруді барлады.

## Оны CodeSandbox-та сынақтауға болады.

[![Edit](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/jagdai-counter-demo-6mbbt3?file=%2Fsrc%2Fstore%2FcounterStore.ts)

## Орнату

```base
npm install jagdai
```

## Қолдану

### Store құрыңыз

Алдымен, **jagdai**-де берілген `create` функциясын қолданып **store** жасаңыз.

`create` функциясы сіздің store-ді анықтау үшін өзгертуші React Hook көруді сұрайды.

Бұл функция бүтінінде барлық түрдегі React Hooks-ті пайдалануға мүмкіндік береді.

Сіз `useState` сияқты стандартты React API-ды қолданып store state-ті анықтауға болады.

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

Бірақ `create` функциясы параметрлік hook-тың қайтару мәніне кейбір талаптар қояды:

1. Бірінші, оның қайтару мәні бір объект болуы керек.
2. Егер сіз кросс-компоненттік state-терді бөлісуді қалайсыңыз, онда оның `query` жолағы үшін бір объект анықтау керек және бөлісетін state-терді оған бірнеше жолмен байланыстыру керек, бұл компоненттер осы state-терді сұрау және жазылуға болады деген мағынасы.

---

### Компонент ағасында store-provider компонентті түйіңкеу

`create` функциясы объектті қайтарады, онда компонент болып табылатын Provider жолағы бар.

> Мында осы store-дің қолданылу сценарийіне негізделіп, оны `CounterStore` деп атау керек.

Сіз `Provider` компонентті React ағасының бір түйініне түйіңкеу керек.

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

Тек келетін компоненттер мен дұрыс қолданылған жағдайда, `query`-да анықталған қолданбаны пайдалану мүмкін.

### State-ді іздеп тұру және қолдану

`create` ті қайтарған объекттің `useQuery` жолағы React Hook-ті, сізге store-дің query жолағында анықталған state-ті сұрау және қолдануға мүмкіндік береді.

Сіз оған сұздап өтушін өтінуіңіз керек, сондықтан ол жазылған стейт-терінің өзгерісін және өзі де өзгеріс етіп табылмай жатқан стейт-терінің өзгерісін көздерінің аударуын көру арқылы осы компонентті қайта-жасауға табыс болады.

Мысалы, `query` кестесінде `count` туралы жазылған басқа стейттерге жазылған жауапты қайтып көруге болады, тек `count` өзгерген кезде бұл компонент қайта-жасалады.

```jsx
const Count = () => {
  const count = CounterStore.useQuery((query) => query.count)

  return <div>{count}</div>
}
```

---

### Компоненттерде store-ге command жіберу

`query` жолағын анықтағаннан басқа, сіз store-ді анықтау кезінде `command` жолағын да анықтауға болады, бұл компоненттер store-ге жібере алатын командаларды көрсетеді.

Мысалы, сіз store-дің анықтау функциясының функция бүтінінде state-ті жаңарту үшін функцияны анықтау және оны `command` жолағына байланыстыруға болады.

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

`create` қайтару мәнінде `useCommand` өрісті бар, ол сондай-ақ Hook. Сіз оны магазинда анықталған бұйрықтарды алу үшін пайдалана аласыз.

```jsx
const Controls = () => {
  const { increase } = CounterStore.useCommand()

  return <button onClick={increase}>+</button>
}
```

Түймешігі басылғанда, `increase` орындалады және store-дегі `count`-ты жаңартады.

Сонымен қатар, `CounterStore.useQuery` арқылы `count`-қа жазылған компоненттер қайта жасалуға және соңғы `count`-ты алуға триггерленеді.

---

### Қалайсыздан `command`-`useCommand` қажет?

> `query` және `useQuery` жұптығымен мен компоненттермен түрінің state ретінде функцияларды бөлісе аламын. `command` және `useCommand` қажеттілігі не?

`useCommand`-тың артықшылығы **_компонент оның салмағы себебімен қайта жасалмайды_**

Бұл `useCommand`-тың қайтару мәні тұрақты болғандықтан. Бұл компонент `command`-де анықталған функциялық жолақ жаңа функцияға сілтенгендіктен ешқашан қайта жасалмайды деген мағынасы.

Бірақ қайғырмайын: `useCommand`-тың қайтару мәні тұрақты болып тұрса да, компонентте алынған функция шақырылған кезде store-дегі ең соңғы функцияны шақыруға жетістіреді.

### Store-event

React-пен жұмыс істеу кезінде тек state-тің болуы кейде жеткіліксіз болады.

Мысалы, заңсыз команда параметрлері енгізілген жағдайлар болуы мүмкін, және store-state өзгермейді, бірақ компонент оның туралы білуі керек.

> TypeScript тек заңсыз параметр түрлерінен сақтануға көмектеседі, бірақ кейбір жағдайларда тек орындағы тексеруді жүргізе аламыз, мысалы, кейбір жағдайлар сервердің растауын талап еткен кезде.

#### Store-event құру

`create`-ке қоса, Jagdai store-event-тарды құру үшін `useEvent` hook-ты қамтиды.

```typescript
import { create, useEvent } from 'jagdai'
```

`useState` арқылы көрсетілген _state_ дегендің құрылуына ұқсас, `useEvent` арқылы _store-event_ құрылуы мүмкін. `useEvent` арқылы қайтарылатын мән event-ті жіберу үшін қолданылуға болады.

> Әрекетті жіберу параметрлермен бірге болуы мүмкін. Сіздің проектіңіз TypeScript-тік жоба мүшеңдігіне негізделген болсаңыз, параметрдің түрін көрсете аласыз.

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

Мында өмірсіз `onUpdateFail` **event** мен `update` **command** қосдық.

`update` бағдарламасы `count`-ты `update` параметрінен келген сандармен жаңартады, және `count` және `update` параметрі алдымен бірдей болса, `count` жаңартуға болмай тұрғанын көрсету үшін (өзінан шақыру арқылы) `onUpdateFail` оқиғасын шығарады.

`query` және `command`-ға қарай, сіз осы оқиғаны компоненттік түрде жазылуы керек болсаңыз, оқиғаны `event` обьектінің кестесіне байлау керек.

`create` қайтару мәнінде `useEvent` өрісі бар, ол компоненттердегі деректерханада оқиғаларға жазылу үшін пайдаланылады.

#### store-event-ға жазылу

`create` қайтару мәнінің `useEvent` өрісі екі параметр қажет:

1. Event атауы, міндетті түрде `create` параметрінің қайтарған `event` объектінің өрістерінен бірі.
2. Event тыңдаушы функциясы.

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

`useEvent` арқылы анықтауға болатын _event_-ке store ішінен де тіркелуге болады, әрі оған тыңдаушы функцияны аргумент ретінде ұтыстыру үшін көбірек қарапайым:

Тек `useEvent` арқылы _event_-ті анықтауға келген кезде, ол үшін тыңдаушы функцияны параметр ретінде таныстыру қажет.

```typescript
const onUpdateFail = useEvent((reason: string) => {
  console.log(`Update failed, the reason is ${reason}`)
})
```

---

### Бірден бірнеше state ларды бақылау

#### Примитивті типтер

```typescript
const income = EmployeeStore.useQuery((query) => query.salary + query.bonus)
```

Егер `query.salary` немесе `query.bonus` өзгерсе, компоненттің қайта жүктелуін тудырады.

#### Беткі салыстыру

Көптеген мемлекеттер объект түрінде біріктірілген кезде қайтарылады, `jagdai` беткі салыстыру арқылы жаңартуларды анықтау үшін `useShallow` функциясын ұсынады. Қолдану мынадай:

```typescript
import { useShallow } from 'jagdai'

const [phone, email] = UserStore.useQuery(
  useShallow((query) => [query.phone, query.email]),
)
```

Егер `query.phone` немесе `query.email` өзгерсе, компоненттің қайта жүктелуін тудырады.

```typescript
import { useShallow } from 'jagdai'

const { name, age } = UserStore.useQuery(
  useShallow((query) => ({
    name: `${query.firstName} ${query.lastName}`,
    age: query.age,
  })),
)
```

Егер `query.firstName`, `query.lastName`, немесе `query.age` өзгерсе, компоненттің қайта жүктелуін тудырады.

Әдепкіде, useQuery өзгерістерді анықтау үшін `Object.is(old, new)` қатаң теңдік салыстыруын қолданады.

- `jagdai`-да, `useShallow` `useQuery` және беткі салыстыру әдісін пайдалану арқылы қайта жүктелу шешімін қабылдау үшін ұсынылады.

- Күрделі жағдайлар үшін, `useQuery` екінші қосымша аргумент ұсынады, ол сізге әдепкі мінез-құлықты өзгерту үшін салыстыру функциясын теңшеуге мүмкіндік береді.

---

## Инспиратциялық мәнер

- [Remesh](https://github.com/remesh-js/remesh) `query`, `command` және `event` ұсынуларының дизайнында Jagdai Remesh-ті құрылғаннан көптеген сызықтары бар. Шарттар тура жүргенде, арнайы жобаларды жетілдіруге үлкен мүмкіндік беретін әрекетті, күшті және көбірек Remesh сіздің таңдауыңыз болмағанда жақсы болады.

- [Hox](https://github.com/umijs/hox) Jagdai құрудың себебі - стейт менеджмент библиотекасын қолданбайтын жоба болды және жиі қайтадан жарияланулар көбінесе тиімді емес жағдайда, төмен бағдарламалау қайта құрастыруы қажет болды. Оның уақытшаған жауапқа нысаны болса, Hox туралы білгіміз болса, Jagdai жасалмаған болар еді. Оған қоса, Store компонентінің ішінде тез қайта пайдалану жағдайының шешімін де Hox-тан алдын алу керек болды.

- [Zustand](https://github.com/pmndrs/zustand) Zustand-тың selector стильді API-сы `useQuery`-ның дизайніне мүнделік болды.
