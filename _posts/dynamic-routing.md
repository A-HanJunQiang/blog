---
title: "React那些常用的hook是哪些？"
excerpt: "也许你会问，为什么要学这些hook？这些hook有什么用？它们的底层原理是什么？这些问题都是值得思考的。"
coverImage: "/assets/blog/dynamic-routing/cover.jpg"
date: "2020-03-16T05:35:07.322Z"
author:
  name: king.
  picture: "/assets/blog/authors/jj.jpeg"
ogImage:
  url: "/assets/blog/dynamic-routing/cover.jpg"
---
# 一、定义

`useState` 是一个 React Hook，它允许你向组件添加一个 [状态变量](https://zh-hans.react.dev/learn/state-a-components-memory)。


# 二、使用

```javascript


const [state, setState] = useState(initialState)
```
### 1、参数
`initialState`：你希望 state 初始化的值。它可以是任何类型的值，但对于函数有特殊的行为。在初始渲染后，此参数将被忽略。

-   如果传递函数作为 `initialState`，则它将被视为 **初始化函数**。它应该是纯函数，不应该接受任何参数，并且应该返回一个任何类型的值。当初始化组件时，React 将调用你的初始化函数，并将其返回值存储为初始状态。

### 2、返回

`useState` 返回一个由两个值组成的数组：

1.  当前的 state。在首次渲染时，它将与你传递的 `initialState` 相匹配。
1.  [`set` 函数](https://zh-hans.react.dev/reference/react/useState#setstate)，它可以让你将 state 更新为不同的值并触发重新渲染。
### 3、`set` 函数
`useState` 返回的 `set` 函数允许你将 state 更新为不同的值并触发重新渲染。你可以直接传递新状态，也可以传递一个根据先前状态来计算新状态的函数：

```js
const [name, setName] = useState('Edward');



function handleClick() {

  setName('Taylor');

  setAge(a => a + 1);

  // ...
```

###### 参数 [](https://zh-hans.react.dev/reference/react/useState#setstate-parameters "Link for 参数 ")

-   `nextState`：你想要 state 更新为的值。它可以是任何类型的值，但对于函数有特殊的行为。

    -   如果你将函数作为 `nextState` 传递，它将被视为 **更新函数**。它必须是纯函数，只接受待定的 state 作为其唯一参数，并应返回下一个状态。React 将把你的更新函数放入队列中并重新渲染组件。在下一次渲染期间，React 将通过把队列中所有更新函数应用于先前的状态来计算下一个状态。

###### 返回值 [](https://zh-hans.react.dev/reference/react/useState#setstate-returns "Link for 返回值 ")

`set` 函数没有返回值。
### 4、注意事项 [](https://zh-hans.react.dev/reference/react/useState#setstate-caveats "Link for 注意事项 ")

-   `set` 函数 **仅更新 *下一次* 渲染的状态变量**。如果在调用 `set` 函数后读取状态变量，则 [仍会得到在调用之前显示在屏幕上的旧值](https://zh-hans.react.dev/reference/react/useState#ive-updated-the-state-but-logging-gives-me-the-old-value)。
-   如果你提供的新值与当前 `state` 相同（由 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较确定），React 将 **跳过重新渲染该组件及其子组件**。这是一种优化。虽然在某些情况下 React 仍然需要在跳过子组件之前调用你的组件，但这不应影响你的代码。
-   React 会 [批量处理状态更新](https://zh-hans.react.dev/learn/queueing-a-series-of-state-updates)。它会在所有 **事件处理函数运行** 并调用其 `set` 函数后更新屏幕。这可以防止在单个事件期间多次重新渲染。在某些罕见情况下，你需要强制 React 更早地更新屏幕，例如访问 DOM，你可以使用 [`flushSync`](https://zh-hans.react.dev/reference/react-dom/flushSync)。
-   `set` 函数具有稳定的标识，所以你经常会看到 Effect 的依赖数组中会省略它，即使包含它也不会导致 Effect 重新触发。如果 linter 允许你省略依赖项并且没有报错，那么你就可以安全地省略它。
-   在渲染期间，只允许在当前渲染组件内部调用 `set` 函数。React 将丢弃其输出并立即尝试使用新状态重新渲染。这种方式很少需要，但你可以使用它来存储 **先前渲染中的信息**。
-   在严格模式中，React 将 **两次调用你的更新函数**，以帮助你找到 [意外的不纯性](https://zh-hans.react.dev/reference/react/useState#my-initializer-or-updater-function-runs-twice)。这只是开发时的行为，不影响生产。如果你的更新函数是纯函数（本该是这样），就不应影响该行为。其中一次调用的结果将被忽略。

-   `useState` 是一个 Hook，因此你只能在 **组件的顶层** 或自己的 Hook 中调用它。你不能在循环或条件语句中调用它。如果你需要这样做，请提取一个新组件并将状态移入其中。
- 在严格模式中，React 将 **两次调用初始化函数**，以 [帮你找到意外的不纯性](https://zh-hans.react.dev/reference/react/useState#my-initializer-or-updater-function-runs-twice)。这只是开发时的行为，不影响生产。如果你的初始化函数是纯函数（本该是这样），就不应影响该行为。其中一个调用的结果将被忽略。

# 三、常见场景使用坑点

### 我已经更新了状态，但日志仍显示旧值 [](https://zh-hans.react.dev/reference/react/useState#ive-updated-the-state-but-logging-gives-me-the-old-value "Link for 我已经更新了状态，但日志仍显示旧值 ")

调用 `set` 函数 **不能改变运行中代码的状态**：

```js
function handleClick() {

  console.log(count);  // 0



  setCount(count + 1); // 请求使用 1 重新渲染

  console.log(count);  // 仍然是 0!



  setTimeout(() => {

    console.log(count); // 还是 0!

  }, 5000);

}
```

这是因为 [状态表现为就像一个快照](https://zh-hans.react.dev/learn/state-as-a-snapshot)。更新状态会使用新的状态值请求另一个渲染，但并不影响在你已经运行的事件处理函数中的 `count` JavaScript 变量。

如果你需要使用下一个状态，你可以在将其传递给 `set` 函数之前将其保存在一个变量中：

```js
const nextCount = count + 1;

setCount(nextCount);



console.log(count);     // 0

console.log(nextCount); // 1
```
### 我已经更新了状态，但是屏幕没有更新 [](https://zh-hans.react.dev/reference/react/useState#ive-updated-the-state-but-the-screen-doesnt-update "Link for 我已经更新了状态，但是屏幕没有更新 ")

**如果下一个状态等于先前的状态，React 将忽略你的更新**，这是由 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较确定的。这通常发生在你直接更改状态中的对象或数组时：

```js
obj.x = 10;  // 🚩 错误：直接修改现有的对象

setObj(obj); // 🚩 不会发生任何事情
```

你修改了一个现有的 `obj` 对象并将其传递回 `setObj`，因此 React 忽略了更新。为了解决这个问题，你需要确保始终[在状态中 **替换** 对象和数组，而不是对它们进行 **更改**](https://zh-hans.react.dev/reference/react/useState#updating-objects-and-arrays-in-state)：

```js
// ✅ 正确：创建一个新对象

setObj({

  ...obj,

  x: 10

});
```
### 出现错误：“Too many re-renders” [](https://zh-hans.react.dev/reference/react/useState#im-getting-an-error-too-many-re-renders "Link for 出现错误：“Too many re-renders” ")

有时可能会出现错误：“Too many re-renders”。React 会限制渲染次数，以防止进入无限循环。通常，这意味着 **在渲染期间** 无条件地设置状态，因此组件进入循环：渲染、设置状态（导致重新渲染）、渲染、设置状态（导致重新渲染）等等。通常，这是由错误地指定事件处理函数时引起的：

```js
// 🚩 错误：在渲染过程中调用事件处理函数

return <button onClick={handleClick()}>Click me</button>



// ✅ 正确：将事件处理函数传递下去

return <button onClick={handleClick}>Click me</button>



// ✅ 正确：传递一个内联函数

return <button onClick={(e) => handleClick(e)}>Click me</button>
```

如果找不到这个错误的原因，请单击控制台中错误旁边的箭头，查看 JavaScript 堆栈以找到导致错误的具体 `set` 函数调用。
### 初始化函数或更新函数运行了两次 [](https://zh-hans.react.dev/reference/react/useState#my-initializer-or-updater-function-runs-twice "Link for 初始化函数或更新函数运行了两次 ")

在 [严格模式](https://zh-hans.react.dev/reference/react/StrictMode) 下，React 会调用你的某些函数两次而不是一次：

```js
function TodoList() {

  // 该函数组件会在每次渲染运行两次。



  const [todos, setTodos] = useState(() => {

    // 该初始化函数在初始化期间会运行两次。

    return createTodos();

  });



  function handleClick() {

    setTodos(prevTodos => {

      // 该更新函数在每次点击中都会运行两次

      return [...prevTodos, createTodo()];

    });

  }

  // ...
```

这是所期望的，且不应该破坏你的代码。

这种 **仅在开发环境下生效** 的行为有助于 [保持组件的纯粹性](https://zh-hans.react.dev/learn/keeping-components-pure)。React 使用其中一个调用的结果，而忽略另一个调用的结果。只要你的组件、初始化函数和更新函数是纯粹的，就不会影响你的逻辑。但是，如果它们意外地不纯粹，这将帮助你注意到错误。

例如，这个不纯的更新函数改变了 state 中的一个数组：

```js
setTodos(prevTodos => {

  // 🚩 错误：改变 state

  prevTodos.push(createTodo());

});
```

因为 React 调用了两次更新函数，所以你将看到 todo 被添加了两次，所以你将知道出现了错误。在这个例子中，你可以通过 [替换数组而不是更改数组](https://zh-hans.react.dev/reference/react/useState#updating-objects-and-arrays-in-state) 来修复这个错误：

```js
setTodos(prevTodos => {

  // ✅ 正确：使用新状态替换

  return [...prevTodos, createTodo()];

});
```

现在，这个更新函数是纯粹的，所以多调用一次不会对行为产生影响。这就是 React 调用它两次可以帮助你找到错误的原因。**只有组件、初始化函数和更新函数需要是纯粹的**。事件处理函数不需要是纯粹的，所以 React 不会两次调用你的事件处理函数。

阅读 [保持组件纯粹](https://zh-hans.react.dev/learn/keeping-components-pure) 以了解更多信息。

* * *

### 我尝试将 state 设置为一个函数，但它却被调用了 [](https://zh-hans.react.dev/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead "Link for 我尝试将 state 设置为一个函数，但它却被调用了 ")

你不能像这样把函数放入状态：

```js
const [fn, setFn] = useState(someFunction);



function handleClick() {

  setFn(someOtherFunction);

}
```

因为你传递了一个函数，React 认为 `someFunction` 是一个 [初始化函数](https://zh-hans.react.dev/reference/react/useState#avoiding-recreating-the-initial-state)，而 `someOtherFunction` 是一个 [更新函数](https://zh-hans.react.dev/reference/react/useState#updating-state-based-on-the-previous-state)，于是它尝试调用它们并存储结果。要实际 **存储** 一个函数，你必须在两种情况下在它们之前加上 `() =>`。然后 React 将存储你传递的函数。

```js
const [fn, setFn] = useState(() => someFunction);



function handleClick() {

  setFn(() => someOtherFunction);

}
```