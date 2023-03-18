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

## Оны Codesandbox-та сынақтауға болады.

[![Edit](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/jagdai-counter-demo-6mbbt3?file=%2Fsrc%2Fstore%2FcounterStore.ts)

## Орнату

```base
npm install jagdai
```

## Қолдану

### Store құрыңыз

Алдында `jagdai` пакетінен берілген `create` функциясын қолдана отырып `store` құрыңыз.

create функциясы өзгертілген React Hook-ты қолдануға мүлдем керек етеді, бұл `store` құрамын анықтайтын Hook.

Бұл себепті, функция ішінде `useState` сияқты стандартты React API-ларын қолдану арқылы store мәртебесін анықтауға болады.

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

`create` функциясының параметрі ретінде қабылданған Hook-тың қайтақ жолында табысты міндетті талаптары бар:

1. Бірінші рет, оның қайтарымы нысанды болуы керек
2. Егер сіз бірнеше компонент арасындағы бөлінетін мәліметтерді бөлісу керек болсаңыз, онда `query` аумағы үшін нысанның объектін көрсетуіңіз керек және бөлісетін мәліметтерді бірбіріне байланыстыруыңыз керек, олардың бетбелгілерімен сұрау және жазылуы мүмкін болады.

---

### Жолаудың құрылуын бағдарлау

`create` функциясы объект қайтарады, оның Store төрі компонент болып табылады.

> Бұл деректердің пайдалану сценарийіне сәйкес оны `CounterStore` деп атындауыңызға болады (сіз де сол жасауыңыз керек).

`CounterStore` компонентіні React деревесінің нодына салуыңыз керек.

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

Тек келетін компоненттер мен дұрыс қолданылған жағдайда, `query`-да анықталған қолданбаны пайдалану мүмкін.

### State-ді іздеп тұру және қолдану

`create` функциясынан келген нәтижелерге қосымша қайтару параметрі ретінде берілген `useQuery` кестесі - бұл React Hook, ол Стор-да анықталған `query` кестесіндегі мәндерді сұрау және пайдалануға мүмкіндік береді.

Сіз оған сұздап өтушін өтінуіңіз керек, сондықтан ол жазылған стейт-терінің өзгерісін және өзі де өзгеріс етіп табылмай жатқан стейт-терінің өзгерісін көздерінің аударуын көру арқылы осы компонентті қайта-жасауға табыс болады.

> Мысалы, `useQuery` функциясы `CounterStore`-мен қосылған, сондықтан оны `useCounterQuery` ретінде атақтаңыз (Сіз де осындағы мүмкіндіктерді пайдалануыңыз керек).

Мысалы, `query` кестесінде `count` туралы жазылған басқа стейттерге жазылған жауапты қайтып көруге болады, тек `count` өзгерген кезде бұл компонент қайта-жасалады.

---

### Компонент ішінде store-ға команда жіберу

Store-ді анықтау мәндері `query` көрсетуінен тәуекелді, `command` көрсетуге де болады, бұл компоненттердің Store-ға жібере алатын бұйрықтарын белгілейді.

Мысалы, өзінің функциясының тілінде кеңейту үшін функцияны анықтап, оны `command` көрсетуінен байланыстыруға болады.

`create` арқылы қайтарылатын нысанда `useCommand` аймағы да бар, бұл сізге компонентте store-ға бұйрықтарды жіберу мүмкіндігін беретін Hook.

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

> `useCommand` жаңадан `CounterStore` меніңдерімен байланыстыруы мүмкін, сондықтан оны `useCounterCommand` түріне өзгертуіміз керек (сіз де оған оңай өзгертуіңіз керек).

```jsx
const Controls = () => {
  const { increase } = useCounterCommand()

  return <button onClick={increase}>+</button>
}
```

Басқармадағы `count` орнатылғанда, өзгерістер менмен және `increase` нұсқасы орындалып, бастаушыдағы басылған кезде `count` жаңартылады.

Олардың кейбірі құрамында `count` қолданбасына `useCounterQuery` арқылы жазылған болсаңыз, соғысы жаңартылады және соңғы `count` деректерін алу үшін өзінің қайта өңдеуін орындайды.

---

### Қалайсыздан `command`-`useCommand` қажет?

> `query` және `useQuery` жинағымен, мен функцияларды компоненттермен бөлісуге болады. Сондықтан, бізде қалай `command` және `useCommand` қажет?

`useCommand` мүмкіндігі бұл: **_компонент онымен қайта құрушылық туындауы мүмкін емес_**

Бұл себебі `useCommand` қайталану мәні сапалы. Бұл, `command` құрылған функция өрістері жаңа функцияға бауландыру кезінде компонент қайта құрулмағанын маңызды

Бірақ ойланбаңыз: `useCommand` қайталану мәні сапалы болса да, компонентте алынған функциялар жүйедегі соңғы функцияны шақыруда қолданылады.

### Store event

React пайдаланып жоба құру процесінде, кейбір ситуацияларда тек state қарайсыз болуы мүмкін емес.

Мысалы, келесі сценарилерде, келесі қадамдық параметрлерді енгізу, Store мәні өзгермей алмаса да компонент оны түсінуі керек.

> TypeScript тек қате параметр түрлерін кері қоюға көмектесе де, бәзі сценарилерде сервер растау қажет болғанда тексеруіміз қажет.

#### Store Event құру

`create`-дан басқа, Jagdai `useStoreEvent` хуқуғын да қамтып алады, store-event жасау үшін пайдаланылады.

```typescript
import { create, useStoreEvent } from 'jagdai'
```

Сіз сіздің store-ның функциясында `useStoreEvent` пайдалана отырып **store-event** құруға боладыңыз, оның қайтару мәні бұл оқиғаны жіберу үшін қолданылады.

> Әрекетті жіберу параметрлермен бірге болуы мүмкін. Сіздің проектіңіз TypeScript-тік жоба мүшеңдігіне негізделген болсаңыз, параметрдің түрін көрсете аласыз.

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

Мында өмірсіз `updateFail` **event** мен `update` **command** қосдық.

`update` бағдарламасы `count`-ты `update` параметрінен келген сандармен жаңартады, және `count` және `update` параметрі алдымен бірдей болса, `count` жаңартуға болмай тұрғанын көрсету үшін (өзінан шақыру арқылы) `updateFail` оқиғасын шығарады.

`query` және `command`-ға қарай, сіз осы оқиғаны компоненттік түрде жазылуы керек болсаңыз, оқиғаны `event` обьектінің кестесіне байлау керек.

`create` қайтару мәнінде `useEvent` өрісі бар, ол компоненттердегі деректерханада оқиғаларға жазылу үшін пайдаланылады.

> Дәйекі ойыншық бойынша, осында ол `useCounterEvent` деп атын қайта атауы керек (сіз де сол жасауыңызға болады).

#### store-event-ға жазылу

`useEvent` функциясының екі параметрі бар:

1. Event атауы, міндетті түрде `create` параметрінің қайтарған `event` объектінің өрістерінен бірі.
2. Event тыңдаушы функциясы.

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

### Бірден бірнеше state ларды бақылау

state-дарды біріктіру және `query.salary` не `query.bonus` өзгерістерінен байқау кезінде қайта құрастыру орындалады

```typescript
const income = useEmployeeQuery((query) => query.salary + query.bonus)
```

state-дарды біріктіру және `query.phone` не `query.email` өзгерістерінен байқау кезінде массив ретінде қайта құрастыру орындалады

```typescript
const [phone, email] = useUserQuery((query) => [query.phone, query.email])
```

state-дарды біріктіру және `query.firstName`, `query.lastName` не `query.age` өзгерістерінен байқау кезінде объект ретінде қайта құрастыру орындалады.

```typescript
const { name, age } = useUserQuery((query) => ({
  name: `${query.firstName} ${query.lastName}`,
  age: query.age,
}))
```

`useQuery` функциясының қайта құрастыруды тигізу, оның бірінші функциялық параметрінің өмірдің алдыңғы және келесі есептерінің қайталану нәтижесін қарыстыру арқылы анықталады.

Әдепкі түрде, ерекшеліксіз салыстыру орын алатын болады. `Object.is(old, new)` функциясын орындау кезінде `true` болса, қайта құрастыру орындалмайды.

Егер олар әлдеқайдағы түрдегі емес, себебі массив түріндегі `object` түрінде болса, олардың арасында жетілдіру орын алатын болады. Олар әлдеқайда сәйкес келмесе, қайта құрастыру орындалады.

`useQuery` функциясының екінші параметрі опциялық функция болып табылады және сіз бұл әдепкі әрекетті өзгерту үшін салыстыру функциясын қайта құруға болады.

---

## Инспиратциялық мәнер

- [Remesh](https://github.com/remesh-js/remesh) `query`, `command` және `event` ұсынуларының дизайнында Jagdai Remesh-ті құрылғаннан көптеген сызықтары бар. Шарттар тура жүргенде, арнайы жобаларды жетілдіруге үлкен мүмкіндік беретін әрекетті, күшті және көбірек Remesh сіздің таңдауыңыз болмағанда жақсы болады.

- [Hox](https://github.com/umijs/hox) Jagdai құрудың себебі - стейт менеджмент библиотекасын қолданбайтын жоба болды және жиі қайтадан жарияланулар көбінесе тиімді емес жағдайда, төмен бағдарламалау қайта құрастыруы қажет болды. Оның уақытшаған жауапқа нысаны болса, Hox туралы білгіміз болса, Jagdai жасалмаған болар еді. Оған қоса, Store компонентінің ішінде тез қайта пайдалану жағдайының шешімін де Hox-тан алдын алу керек болды.

- [Zustand](https://github.com/pmndrs/zustand) Zustand-тың selector стильді API-сы useQuery-ның дизайніне мүнделік болды.
