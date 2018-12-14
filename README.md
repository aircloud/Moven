### Moven.js

>正在完善中。

Moven.js 是一个基于浏览器的用户行为记录库，其主要作用为监听用户的所有记录，生成描述语言，该描述语言可以用于分析用户日志，或者可以用于进一步生成[puppteer](https://github.com/GoogleChrome/puppeteer)的执行代码，从而可以用于自动化测试。

Moven.js 可以支持大部分用户交互操作，并且可以通过配置化的方式来选择性的记录一部分用户交互操作，其全部支持的交互操作方式如下文支持的交互操作列表所示。


### 支持的交互操作列表

#### input

对于基本的以输入型为主的 input，其支持如下事件：

* input：这里的 input 是经过处理的 input，会将 dom 触发的多个 input 进行一定的整合。
* focus：聚焦事件
* blur：失焦事件
* click：点击事件

支持的 input 的 type 类型包括如下：

```
'text', 'date', 'datetime-local','color', 'email', 'range', 'month', 'number', 'password', 'search', 'tel', 'time', 'url', 'week'
```

备注：对于 checkbox、radio 等通过点击交互的 input，不对其值变更作出监听，可以自行通过 click 跟踪来进行判断。

#### keyboard

keyboard 相关的内容主要是记录用户的键盘操作，但这里需要注意的是，用户在表单类组件打字的时候不算做键盘操作。

#### click

click 事件默认绑定在 document 中，并且每次记录均会生成用户点击内容的查询路径，可以通过 `document.querySelector` 来获取对应的元素。