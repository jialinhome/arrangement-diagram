# 记录 bug 及修复方式

## graph.setItemState(item, state, value) 问题

此函数有三个参数，最后一个参数不能传 true 或者对象，传了之后通过 item.getStates 不能获取到正确的状态值

[graph.setItemState](https://g6.antv.vision/zh/docs/api/graphFunc/state/#graphsetitemstateitem-state-value

崩溃了，出现了奇怪的问题，本来一开始去掉第三个参数可以正常执行的，但是用着用着突然就不灵了，然后都加上 true 又神奇的好用了，而且看了源代码，他们设计的时候明明就是需要加上 true 才会被 item 的 states 收集，这个 G6 的文档真是不行。

这个 bug 简直是一串一串的，对于第三个参数 value 文档描述的不清楚，文档中如此描述：

> stateValue Booelean true 代表该状态是被激活，false 代表该状态被灭活。

啥是激活,啥使灭活,文档中并没有解释。让我想起了滴滴前一段时间开源其自己的编排组件，有一条理由就是由于 G6 文档写的不好，我当时还想着是有多不好才会让你们自己开发一套啊，这么一看果真有道理。

```javascript
if (isBoolean(value)) {
    var index = states.indexOf(filterStateName);

    if (value) {
        // 如果value为true，则当以前没有这个状态的时候会加入states数组
        if (index > -1) {
            return;
        }

        states.push(stateName); // 这里的数组改成Set就好了
    } else if (index > -1) {
        // 如果为false，则不会加入states数组，而且可能还会将以前有的删除
        states.splice(index, 1);
    }
}
```

由以上源码可以看出，true 与 false 的区别

## 连线的时候会向后端请求数据，如果请求数据出错，则会删除连线，那下次再连的时候该 port 就不会高亮展示

原因：连线之后会给 port 设置 hasEdge 属性，删除的时候没有把对应的属性删除。

## 同一个页面中，如果有多个 graph 实例，注册事件后，事件会作用在其他组件上

解决方案：将事件实例与 graph 实例挂钩

## 如何将事件与状态变成与实例相关的配置？
