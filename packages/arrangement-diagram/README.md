# Arrangement Diagram

## Arrangement-Diagram 是什么？

基于G6的流程可视化编辑工具核心库，可以快速搭建流程可视化系统。此核心不提供业务相关的逻辑，所有数据都通过事件向外传递，可以根据不同的业务需求定制自己的业务逻辑。

考虑到可维护性，使用此库完全不用担心后续维护问题，所有可配置逻辑都通过ES modules向外暴露，如果有极为特殊的逻辑满足不了，可以对其进行拆分重新组装。

在功能方面，在G6的基础上，提供以下功能：

1. 自定义多场景的behavior，包括：addEdge, clickEdge, hoverEdge, clickCanvas, hoverNode, selectNode,
2. 集成多种node显示状态，包括：default, selected, hover, highlight
3. 封装自定义node样式功能，使自定义样式更加简单
4. 提供节点自动生成port能力
5. 框架无关的事件系统，所有通信都通过事件来完成，向外暴露11种事件
6. 封装G6常用功能，如：createNode，removeNode等

## 使用方式

### 1. 定义并注册节点样式

```javascript
// createCardNode.ts

import type { DrawNodeShapeConfig } from 'arrangement-diagram';
import type { IShape } from '@antv/g6';

export default function createCardNode(cfg: DrawNodeShapeConfig): IShape {
    const { cfg: config, group, keyShapeWidth, keyShapeHeight, flow } = cfg;
    /* 最外面的矩形 */
    const keyShape = group.addShape('rect', {
        attrs: {
            x: 0,
            y: 0,
            width: keyShapeWidth,
            height: keyShapeHeight,
            fill: config.fillColor || flow.fillColor,
            stroke: config.strokeColor || flow.strokeColor,
            radius: 2,
            cursor: 'pointer',
        },
        name: 'rect-shape',
        draggable: true,
    });

    /* name */
    group.addShape('text', {
        attrs: {
            text: config.name,
            x: 19,
            y: 19,
            fontSize: 14,
            fontWeight: 700,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: '#ffffff',
            cursor: 'pointer',
        },
        name: 'name-text-shape',
        draggable: true,
    });

    /* 描述 */
    group.addShape('text', {
        attrs: {
            text: config.keyInfo,
            x: 19,
            y: 45,
            fontSize: 14,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: '#ffffff',
            cursor: 'pointer',
        },
        name: 'bottom-text-shape',
    });

    return keyShape;
}
```

> 注意：
>
> 定义节点时，需要定义一个[KeyShape](https://antv-g6.gitee.io/zh/docs/manual/middle/elements/shape/shape-keyshape/#keyshape)并返回，`KeyShape`是 g6 中的一个概念，指的是每一种节点/边/Combo唯一的关键图形，需要在`draw()`方法或`drawShape()`方法中返回。

### 2. 配置节点与边的数据

```javascript
// data.ts
import type { NodeData } from 'arrangement-diagram';

export const nodes: NodeData[] = [
    {
        type: 'card-node',
        id: 'node1',
        x: 100,
        y: 200,
        name: '节点1',
        highlightSelected: false,
        component: {
            inputs: [
                {
                    portId: 31,
                },
            ],
            outputs: [
                {
                    portId: 32,
                },
            ],
        },
    },
    {
        type: 'card-node',
        id: 'node2',
        x: 300,
        y: 500,
        portColor: '#98fb98',
        fillColor: '#db7093',
        strokeColor: '#ffefd5',
        name: '节点2',
        keyInfo: 'this is keyInfo',
        component: {
            inputs: [
                {
                    portId: 33,
                },
            ],
            outputs: [
                {
                    portId: 34,
                },
                {
                    portId: 341,
                },
            ],
        },
    },
    {
        type: 'card-node',
        id: 'node3',
        x: 400,
        y: 200,
        portColor: '#69c0ff',
        fillColor: '#98fb98',
        strokeColor: '#ffefd5',
        icon: '',
        name: '节点2',
        status: 1,
        component: {
            inputs: [
                {
                    portId: 35,
                },
                {
                    portId: 351,
                },
            ],
            outputs: [
                {
                    portId: 36,
                },
            ],
        },
    },
];

export const edges = [
    {
        type: 'customEdge',
        source: 'node1',
        target: 'node2',
        outputPortIndex: 0,
        inputPortIndex: 0,
    },
    {
        type: 'customEdge',
        source: 'node3',
        target: 'node2',
        outputPortIndex: 0,
        inputPortIndex: 0,
    },
];

const data = {
    nodes,
    edges,
};

export default data;
```

> 在节点的数据中，最基本的属性是构造图形所需的数据，可以参照`NodeData`中的结构。再此基础上，你还可以自己定义业务属性，业务属性需要配合第一步中定义的节点来使用。

### 3. 初始化渲染

- 以vue3为例进行演示

```javascript
import { ref, onMounted } from 'vue'
import ArrangementDiagram from 'arrangement-diagram';
import data from './data';
import createCardNode from './createCardNode';

import type { NodeModelConfig } from 'arrangement-diagram';
import type { IGroup } from '@antv/g6';

const registerNodeConfigs = [{
    nodeType: 'card-node',
    width: 234,
    height: 64,
    drawNodeShape: (cfg: NodeModelConfig, group: IGroup, width: number, height: number, flow: ArrangementDiagram) => {
        return createCardNode(cfg, group, width, height, flow);
    },
}];

const graphContainer = ref<HTMLElement | null>(null);

onMounted(() => {
    const graphContainerElement = graphContainer.value as HTMLElement;    
    const graph  = new ArrangementDiagram(
        {
            container: graphContainerElement,
            width: graphContainerElement.offsetWidth,
            height: graphContainerElement.offsetHeight,
            renderer: 'canvas',
            registerNodeConfigs 
        },
        data
    )   
});
```

引入之后，在画布上即可呈现如下效果：![效果图]()

## 进阶教程

### 定义多个节点样式

在现实业务场景中，为了区分业务类型，可能需要多种样式的节点，此组件支持定义多种节点样式。上面的例子我们定义了一个名为`card-node`的节点，接下来我们在定义一个名为`flow-node`的节点。

首先，定义节点样式：

```typescript
import type { DrawNodeShapeConfig } from 'arrangement-diagram';
import type { IShape } from "@antv/g6";

export default function createFlowNode(cfg: DrawNodeShapeConfig):IShape {
  const { cfg: config, group, keyShapeWidth, keyShapeHeight, flow } = cfg;
  const {
    name = "",
    variableName,
    variableValue,
    variableUp,
    label,
    currency,
    status,
    rate,
  } = config;

  const { fillColor } = flow;

  const grey = "#CED4D9";
  const colors = {
    B: '#5B8FF9',
    R: '#F46649',
    Y: '#EEBC20',
    G: '#5BD8A6',
    DI: '#A7A7A7',
  };
  const rectConfig = {
    width: keyShapeWidth,
    height: keyShapeHeight,
    lineWidth: 1,
    fontSize: 12,
    fill: config.fillColor || fillColor,
    radius: 4,
    stroke: colors.B,
    opacity: 1,
  };

  const nodeOrigin = {
    x: 0,
    y: 0,
  };

  const textConfig = {
    textAlign: "left",
    textBaseline: "bottom",
  } as const;

  const rect = group.addShape("rect", {
    attrs: {
      x: nodeOrigin.x,
      y: nodeOrigin.y,
      ...rectConfig,
    },
  });

  const rectBBox = rect.getBBox();

  // label title
  group.addShape("text", {
    attrs: {
      ...textConfig,
      x: 12 + nodeOrigin.x,
      y: 20 + nodeOrigin.y,
      text: name.length > 28 ? name.substr(0, 28) + "..." : name,
      fontSize: 12,
      opacity: 0.85,
      fill:  "#000",
      cursor: "pointer",
    },
    name: "name-shape",
  });

  // price
  const price = group.addShape("text", {
    attrs: {
      ...textConfig,
      x: 12 + nodeOrigin.x,
      y: rectBBox.maxY - 12,
      text: label,
      fontSize: 16,
      fill: "#000",
      opacity: 0.85,
    },
  });

  // label currency
  group.addShape("text", {
    attrs: {
      ...textConfig,
      x: price.getBBox().maxX + 5,
      y: rectBBox.maxY - 12,
      text: currency,
      fontSize: 12,
      fill: "#000",
      opacity: 0.75,
    },
  });

  // percentage
  const percentText = group.addShape("text", {
    attrs: {
      ...textConfig,
      x: rectBBox.maxX - 8,
      y: rectBBox.maxY - 12,
      text: `${((variableValue || 0) * 100).toFixed(2)}%`,
      fontSize: 12,
      textAlign: "right",
      fill: colors[status as keyof typeof colors],
    },
  });

  // percentage triangle
  const symbol = variableUp ? "triangle" : "triangle-down";
  const triangle = group.addShape("marker", {
    attrs: {
      ...textConfig,
      x: percentText.getBBox().minX - 10,
      y: rectBBox.maxY - 12 - 6,
      symbol,
      r: 6,
      fill: colors[status as keyof typeof colors],
    },
  });

  // variable name
  group.addShape("text", {
    attrs: {
      ...textConfig,
      x: triangle.getBBox().minX,
      y: rectBBox.maxY - 12,
      text: variableName,
      fontSize: 12,
      textAlign: "right",
      fill: "#000",
      opacity: 0.45,
    },
  });

  // bottom line background
  const bottomBackRect = group.addShape("rect", {
    attrs: {
      x: nodeOrigin.x,
      y: rectBBox.maxY - 4,
      width: rectConfig.width,
      height: 4,
      radius: [0, 0, rectConfig.radius, rectConfig.radius],
      fill: "#E0DFE3",
    },
  });

  // bottom percent
  const bottomRect = group.addShape("rect", {
    attrs: {
      x: nodeOrigin.x,
      y: rectBBox.maxY - 4,
      width: rate * rectBBox.width,
      height: 4,
      radius: [0, 0, 0, rectConfig.radius],
      fill: colors[status as keyof typeof colors],
    },
  });
  return rect;
}
```

其次，定义节点的宽高，并在这里给节点命名为`flow-node`

```typescript
const registerNodeConfigs = [{
    nodeType: 'flow-node',
    width: 200,
    height: 60,
    drawNodeShape: (cfg: DrawNodeShapeConfig) => {
        return createFlowNode(cfg);
    }
}];
```

最后，初始化的时候注册节点

```typescript
const graph  = new ArrangementDiagram(
    {
        container: graphContainerElement,
        width: graphContainerElement.offsetWidth,
        height: graphContainerElement.offsetHeight,
        renderer: 'canvas',
        registerNodeConfigs // <- 在这里注册节点 
    },
    data
)
```

这样，我们就定义了一个新的节点，只需要配置`type`属性为`flow-node`节点数据，它就会显示在画布中。

```javascript
{
    type: 'flow-node',
    id: 'node0',
    x: 100,
    y: 100,
    name: '节点名称',
    keyInfo: 'this is keyInfo',
    count: 123456,
    label: '538.90',
    currency: 'Yuan',
    rate: 1.0,
    status: 'B',
    variableName: 'V1',
    variableValue: 0.341,
    variableUp: false,
    component: {
        inputs: [
            {
                portId: 29,
            },
        ],
        outputs: [
            {
                portId: 30,
            },
        ],
    },
},
```

### 给节点设置不同的交互状态

`arrangement-diagram`本身对节点提供了4种状态，分别为：

- `selected` - 用鼠标单机节点的选中状态
- `hover` - 用鼠标悬停在节点上的状态
- `highlight` - 一般高亮状态
- `default` - 初始化节点的时候默认状态

其中，除了`default`状态，其他状态都可以使节点处于半透明的形态，即给`keyShape`的填充色增加了50%的透明度。

如果您希望更多的交互样式，可以通过复写样式或者增加新的样式函数进行配置，比如我们希望hover的时候使节点变为红色，则可以这样复写节点：

```javascript
// ① 定义需要改变的状态
const nodeStatePlugins: StatePlugin[] = [{
    name: 'selected',
    exec: (item, params) => {
        const { keyShape, data, circles } = params;
        keyShape.attr('fill', '#ff0000');
        keyShape.attr('stroke', '#00ffff');
        keyShape.attr('cursor', 'move');
        circles?.forEach((circle) => {
            circle.attr('opacity', 1);
        });
    }
}]

// ② 传入初始化配置项中
const graph  = new ArrangementDiagram(
        {
            nodeStatePlugins
        },
        data
    )

```

### 事件监听

事件部分是最重要的，因为如果我们想要交互，都是通过事件来进行的。`arrangement-diagram`的事件系统集成了三类事件，主要是针对节点、边、画布的各种操作给出反馈，你在这些阶段可以进行业务操作。

下表列出了具体的事件名称，以及触发事件的动作，如果你的业务包含对节点、画布的操作，直接监听这些事件即可。

| 事件         | 触发条件                     |
| -------------- | -------------------------------- |
| nodeDragStart  | 鼠标拖拽节点开始         |
| nodeDragEnd    | 鼠标拖拽节点结束         |
| nodeHover      | 鼠标移动到节点上面      |
| nodeUnHover    | 鼠标从hover状态移出节点 |
| nodeRightClick | 鼠标右键单击节点         |
| nodeSelect     | 鼠标左键单击节点         |
| nodeUnselect   | 节点从Select状态变为正常状态 |
| portHover      | 鼠标移到port上面           |
| edgeCreate     | 鼠标连接两个port形成一条新的连线 |
| edgeRightClick | 鼠标右键单击连线         |
| canvasClick    | 鼠标左键单击空白画布   |
| edgeHover      | 鼠标移动到连线上         |
| edgeUnHover    | 连线从hover状态变为正常状态 |
| edgeClick      | 鼠标左键单击连线         |

`arrangement-diagram`以事件总线的方式处理事件，事件总线实例挂载在`ArrangementDiagram`实例上，下面通过一个例子进行演示。

```typescript
// ① 首先创建LayoutFlow实例
const arrangementDiagram  = new ArrangementDiagram(
    {
        container: graphContainerElement,
        width: graphContainerElement.offsetWidth,
        height: graphContainerElement.offsetHeight,
    },
    data
)

// ② 接下来监听我们需要的事件
arrangementDiagram.bus.on('nodeSelect', e => {
    console.log(e);
})
arrangementDiagram.bus.on('edgeCreate', e => {
    console.log(e);
})
```

### 节点数据与服务器交互

现实业务中，我们可能需要在以下场景与服务器交互。

1. 从服务端获取数据以渲染节点和边

> 对于第一点，我们需要关注初始化阶段，获取到数据之后将其传入配置项即可。

2. 对节点或边的操作

> 对于第二点，我们需要监听对应的事件，现实中我们可能会将节点数据放置在数据库中，可以每次操作之后都请求一下接口以存储数据，也可以在操作完之后统一点击报错按键全量保存。
