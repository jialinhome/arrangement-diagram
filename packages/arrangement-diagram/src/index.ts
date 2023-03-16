import 'reflect-metadata';
import G6 from '@antv/g6';
import EventEmitter from 'eventemitter3';
import customEdge from './layout/edge';
import { registerBehaviors } from './behavior';
const snapLine = new G6.SnapLine();
import { selectColor, drawPorts, colors } from './util';
import type { Graph, ModelConfig, IGroup, IShape, GraphOptions, EdgeConfig, Item } from '@antv/g6';
import { Bus } from './types';

export interface StatePlugin {
  name: string;
  exec: (
    item: Item,
    params: { keyShape: IShape; circles?: IShape[]; outCircles?: IShape[]; data: NodeData | EdgeData }
  ) => void;
}

export interface NodeModelConfig extends ModelConfig {
  component?: {
    inputs?: Array<{ portId: string }>; // 可以入线的 port
    outputs?: Array<{ portId: string }>; // 可以出线的 port
  };
  [key: string]: any; // 可能存在一些自定义的属性值
}

export interface FlowConfig extends GraphOptions {
  container: string | HTMLElement; // 画布宽度
  width: number; // 画布宽度
  height: number; // 画布高度
  strokeColor?: string; // keyShape 边的颜色
  fillColor?: string; // keyShape 填充颜色
  portColor?: string; // port 颜色
  portSize?: string; // port 大小
  orientation?: 'horizontal' | 'vertical'; // 水平排列 | 垂直排列 默认为垂直排列
  callback?: (graph: Graph) => any; // 初始完画布的回调函数
  registerNodeConfigs?: RegisterNodeConfig[]; // 注册node节点样式配置
  nodeStatePlugins?: StatePlugin[]; // 节点状态复写
  edgeStatePlugins?: StatePlugin[]; // 边状态复写
}

export interface RegisterNodeConfig {
  nodeType: string; // 节点类型
  width: number; // keyShape 宽度
  height: number; // keyShape 高度
  drawNodeShape: (cfg: DrawNodeShapeConfig) => IShape; // 绘制节点样式的方法，返回keyShape
  afterDraw?(cfg: NodeModelConfig, group: IGroup, flow: ArrangementDiagram): void; // 节点绘制之后的回调函数，可以加动画
}

interface InitOptions {
  callback?: () => any;
  registerNodeConfigs?: RegisterNodeConfig[];
}

export interface NodeData {
  type: string; // 节点类型
  id: string; // 节点的唯一标识
  name: string; // 节点名称
  x: number; // 节点位置的 x 值
  y: number; // 节点位置的 y 值
  color?: string; // 默认绘制的 hover, port高亮的值
  fillColor?: string; // 节点填充颜色
  strokeColor?: string; // 节点边的颜色
  highlightSelected?: boolean; // 选中是否高亮，默认为true
  component?: {
    inputs?: { portId: string | number; [key: string]: any }[]; // 可以连入的port
    outputs?: { portId: string | number; [key: string]: any }[]; // 可以练出的port
  };
  [key: string]: any; // 可能存在一些自定义的属性值
}

export interface EdgeData extends EdgeConfig {
  type: string; // 边类型
  source: string; // 起始节点 id
  target: string; // 目标节点 id
  outputPortIndex: number; // 起始点port索引
  inputPortIndex: number; // 目标点port索引
  isDashed?: boolean; // 是否是虚线
}

export interface GraphData {
  nodes: NodeData[]; // 节点列表
  edges: EdgeData[]; // 边列表
}

export interface DrawNodeShapeConfig {
  cfg: NodeModelConfig;
  group: IGroup;
  keyShapeWidth: number;
  keyShapeHeight: number;
  flow: ArrangementDiagram;
}

export default class ArrangementDiagram {
  constructor(config: FlowConfig, graphData: GraphData) {
    // 初始化一些属性的默认值
    this.initDefaultValue(config);

    // 初始化状态
    this.initState();

    // 初始化连线
    customEdge.init(this.setEdgeState.bind(this), this.orientation);

    // 初始化事件
    this.bus = new EventEmitter();
    registerBehaviors(this.bus, this);

    // 注册节点
    config?.registerNodeConfigs?.forEach((config) => {
      this.registerNode(config);
    });

    // 初始化图实例
    this.graph = this.init(config, graphData, config?.callback);
  }

  public graph: Graph = null;
  public bus: Bus = null;

  public orientation: FlowConfig['orientation'];
  public portSize: number;
  public portColor: string;
  public fillColor: string;
  public strokeColor: string;

  private nodeStatePlugins: StatePlugin[] = [];
  private edgeStatePlugins: StatePlugin[] = [];

  private nodeState = {
    selected(item, { keyShape, circles, data }) {
      const { fillColor, strokeColor } = data;
      keyShape.attr('fill', selectColor(fillColor || this.fillColor));
      keyShape.attr('stroke', strokeColor || this.strokeColor);
      keyShape.attr('cursor', 'move');
      circles.forEach((circle) => {
        circle.attr('opacity', 1);
      });
    },

    hover(item, { keyShape, circles, outCircles, data }) {
      const { fillColor, strokeColor } = data;
      keyShape.attr('fill', selectColor(fillColor || this.fillColor));
      keyShape.attr('stroke', strokeColor || this.strokeColor);
      keyShape.attr('cursor', 'move');
      circles.forEach((circle) => {
        circle.attr('opacity', 1);
      });
    },

    highlight(item, { keyShape, circles, data }) {
      const { fillColor, strokeColor } = data;
      keyShape.attr('fill', selectColor(fillColor || this.fillColor));
      keyShape.attr('stroke', strokeColor || this.strokeColor);
      keyShape.attr('cursor', 'move');
      circles.forEach((circle) => {
        circle.attr('opacity', 1);
      });
    },

    failHighlight(item, { keyShape, circles, data }) {
      const { fillColor, failStrokeColor } = data;
      keyShape.attr('fill', selectColor(fillColor || this.fillColor));
      keyShape.attr('stroke', failStrokeColor || this.strokeColor);
      keyShape.attr('cursor', 'move');
      circles.forEach((circle) => {
        circle.attr('opacity', 1);
      });
    },

    portHighlight(item, { keyShape, circles, data }, value) {
      const group = item.get('group');
      const children = group.cfg.children;
      children.map((child) => {
        if ((child.attrs.portType == 'in' || child.attrs.portType == 'inout') && !child.attrs.hasEdge) {
          child.attr('opacity', 1);
        }
      });
    },

    default(item, { keyShape, circles, outCircles, data }) {
      const { $originAttrs } = item.getKeyShape();
      const { fill, stroke } = $originAttrs;
      const { white } = colors;
      keyShape.attr('fill', fill);
      keyShape.attr('stroke', stroke);
      circles.forEach((circle) => {
        circle.attr('fill', white);
        circle.attr('opacity', 0);
      });
      outCircles.forEach((circle) => {
        circle.attr('opacity', 0);
      });
    },
  };

  private edgeState = {
    hover(item: Item, { keyShape }) {
      // keyShape.attr(key,value)会自动更新箭头属性，所以我们这里需要这样设置，具体可以查看源码
      const endArrow = keyShape.attr('endArrow');
      const { blue } = colors;
      endArrow.fill = blue;
      keyShape.attr('stroke', blue);
      keyShape.attr('lineWidth', 1.4);
    },
    unHover(item: Item, { keyShape }) {
      const { gray } = colors;
      const endArrow = keyShape.attr('endArrow');
      endArrow.fill = gray;
      keyShape.attr('stroke', gray);
      keyShape.attr('lineWidth', 1);
    },
    selected(item: Item, { keyShape }) {
      const { blue } = colors;
      keyShape.attr('stroke', blue);
      keyShape.attr('lineWidth', 1.4);
    },
    highlight(item: Item, { keyShape }) {
      const { blue } = colors;
      const endArrow = keyShape.attr('endArrow');
      endArrow.fill = blue;
      keyShape.attr('stroke', blue);
      keyShape.attr('lineWidth', 1.4);
    },
    default(item: Item, { keyShape }) {
      const { gray } = colors;
      const endArrow = keyShape.attr('endArrow');
      endArrow.fill = gray;
      keyShape.attr('stroke', gray);
      keyShape.attr('lineWidth', 1);
    },
  };

  private setNodeState(name, value, item) {
    const group = item.getContainer();
    const keyShape = item.getKeyShape();
    const data = item.getModel();

    // 实际连接的圆
    const circles = group.findAll((circle) => {
      return circle.attrs.portType === 'in' || circle.attrs.portType === 'out';
    });

    // 外部更大范围便于选中的圆
    const outCircles = group.findAll((circle) => {
      return circle.attrs.portType === 'inout' || circle.attrs.portType === 'outout';
    });

    this.nodeState[name] && this.nodeState[name].call(this, item, { keyShape, circles, outCircles, data }, value);
  }

  private setEdgeState(name, value, item) {
    const keyShape = item.getKeyShape();
    const data = item.getModel();
    this.edgeState[name] && this.edgeState[name](item, { keyShape, data });
  }

  /**
   * 注册或重写 state。
   *
   * @example
   * ```ts
   * const plugins = [{
   *   name: 'pluginName',
   *   exec: ({ shape, circles, outCircles, data }) => {
   *     // do something
   *   }
   * }]
   * registerState(plugins)
   * ```
   *
   * @param plugins 需要注册的组件列表
   * @param type 需要传入node与edge两种类型，必传
   */
  public registerState(plugins: StatePlugin[], type: 'node' | 'edge' = 'node') {
    if (!Array.isArray(plugins)) {
      throw Error('registerState参数不合法，需要传入一个数组');
    }

    plugins.forEach((plugin: StatePlugin) => {
      const { name, exec } = plugin;
      if (!name) {
        console.error('registerState参数不合法，需要name值');
        return;
      }
      if (typeof exec !== 'function') {
        console.error('registerState参数不合法, 需要exec为function');
        return;
      }

      if (type === 'node') {
        this.nodeState[name] = exec;
      } else {
        this.edgeState[name] = exec;
      }
    });
  }

  private registerNode(registerNodeConfig: RegisterNodeConfig) {
    const that = this;
    // const offset = this.portSize / 2;
    const offset = 0;
    const { width: keyShapeWidth, height: keyShapeHeight } = registerNodeConfig;

    G6.registerNode(registerNodeConfig.nodeType, {
      draw: (cfg: NodeModelConfig, group: IGroup): IShape => {
        // 绘制图形
        const keyShape = registerNodeConfig.drawNodeShape({ cfg, group, keyShapeWidth, keyShapeHeight, flow: that });
        if (!keyShape) {
          throw new Error('自定义结点的时候需要返回keyShape');
        }
        const attrs = keyShape.attr();
        keyShape['$originAttrs'] = { ...attrs };

        // 输入 ports
        if (cfg.component && cfg.component.inputs) {
          drawPorts({
            portList: cfg.component.inputs,
            group: group,
            width: keyShapeWidth,
            height: keyShapeHeight,
            color: cfg.portColor || that.portColor,
            offsetX: offset,
            offsetY: 0,
            portType: 'in',
            orientation: this.orientation,
          });
        }

        // 输出 ports
        if (cfg.component && cfg.component.outputs) {
          drawPorts({
            portList: cfg.component.outputs,
            group: group,
            width: keyShapeWidth,
            height: keyShapeHeight,
            color: cfg.portColor || that.portColor,
            offsetX: this.orientation === 'vertical' ? offset : registerNodeConfig.width,
            offsetY: this.orientation === 'vertical' ? registerNodeConfig.height : offset,
            portType: 'out',
            orientation: this.orientation,
          });
        }
        return keyShape;
      },
      afterDraw(cfg: NodeModelConfig, group: IGroup): void {
        typeof registerNodeConfig.afterDraw === 'function' && registerNodeConfig.afterDraw(cfg, group, that);
      },
      setState: this.setNodeState.bind(this),
    });
  }

  private initState(): void {
    this.registerState(this.nodeStatePlugins, 'node');
    this.registerState(this.edgeStatePlugins, 'edge');
  }

  private initDefaultValue(config: FlowConfig): void {
    const { portSize, portColor, fillColor, strokeColor, orientation, nodeStatePlugins, edgeStatePlugins } = config;
    this.portSize = typeof portSize === 'number' ? portSize : 10;
    this.orientation = orientation || 'vertical';
    this.portColor = portColor || colors['deepskyblue'];
    this.fillColor = fillColor || colors['deepskyblue'];
    this.strokeColor = strokeColor || colors['gray'];
    this.nodeStatePlugins = nodeStatePlugins || [];
    this.edgeStatePlugins = edgeStatePlugins || [];
  }

  private init(config: GraphOptions, graphData: GraphData, callback?: (graph: Graph) => any) {
    const graph = new G6.Graph({
      container: '',
      width: 1000,
      height: 500,
      renderer: 'canvas',
      modes: {
        default: [
          'drag-canvas',
          'zoom-canvas',
          'hover-node',
          'select-node-visit',
          'click-canvas',
          'drag-node',
          'hover-edge',
          'click-edge',
          'emit-drag-node',
        ], // 允许拖拽画布、放缩画布、拖拽节点
        addEdge: ['add-edge'],
      },
      plugins: [snapLine],
      layout: { type: 'Random', workerEnabled: true },
      ...config,
    });

    if (graphData) {
      graph.data(graphData);
      graph.render();
    }

    callback && callback(graph);
    return graph;
  }
}

export { createNode } from './util/createNode';
import * as graphUtil from './util';
export { graphUtil };
