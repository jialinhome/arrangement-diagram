import G6 from '@antv/g6';
import uniqueId from 'lodash/uniqueId';
import { portXY } from '../util/index';
import type { IGroup, IShape } from '@antv/g6';
import type {
  IPoint,
  Item,
  LabelStyle,
  ModelConfig,
  NodeConfig,
  EdgeConfig,
  ComboConfig,
  TreeGraphData,
} from '@antv/g6';

type Position = { x: number; y: number };

interface IEdgeConfig {
  source: string | Item | Position;
  sourceNode: Item;
  target: string | Item | Position;
  targetNode: Item;
  start: Position;
  end: Position;
  component: IComponent;
  outputPortIndex: number;
  inputPortIndex: number;
}

type ItemConfig = NodeConfig | EdgeConfig | ComboConfig | TreeGraphData;

type NodeItemConfig = ItemConfig & {
  component: {
    outputs: IPort[];
    inputs: IPort[];
  };
};

interface IPort {
  defaultValue: any;
  name: string;
  portId: string | number;
  [key: string]: any;
}

interface IComponent {
  inputs?: IPort[];
  outputs?: IPort[];
}

const MIN_ARROW_SIZE = 3;

const customEdge = {
  init(setEdgeState, orientation) {
    const dashArray = [
      [0, 1],
      [0, 2],
      [1, 2],
      [0, 1, 1, 2],
      [0, 2, 1, 2],
      [1, 2, 1, 2],
      [2, 2, 1, 2],
      [3, 2, 1, 2],
      [4, 2, 1, 2],
    ];

    const lineDash = [4, 2, 1, 2];
    const interval = 9;
    G6.registerEdge('customEdge', {
      draw(cfg: ModelConfig & IEdgeConfig, group: IGroup): IShape {
        let sourceNode: NodeItemConfig;
        let targetNode: NodeItemConfig;
        let start: Position;
        let end: Position;
        // cfg.target 即可能是 string, 又可能是 Item, 又可能是 Position
        // 设计不合理
        // FIXME: 重构，规范格式
        if (typeof cfg.source === 'string') {
          cfg.source = cfg.sourceNode;
        }
        if (typeof cfg.target === 'string') {
          cfg.target = cfg.targetNode;
        }

        const sourceBoxBound = (cfg.source as Item).getBBox();
        const targetBoxBound = (cfg.target as Item).getBBox();

        if (!cfg.start) {
          cfg.start = {
            x: 0,
            y: sourceBoxBound.height,
          };
        }
        if (!cfg.end) {
          cfg.end = {
            x: 0,
            y: -targetBoxBound.height,
          };
        }
        if (!(cfg.source as Position).x) {
          sourceNode = (cfg.source as Item).getModel() as NodeItemConfig;
          if (orientation === 'vertical') {
            start = {
              x:
                sourceNode.x +
                portXY(sourceBoxBound.width, cfg.outputPortIndex, sourceNode?.component?.outputs?.length) +
                cfg.start.x,
              y: sourceNode.y + cfg.start.y,
            };
          } else {
            const { x: customX, y: customY } = sourceNode.component.outputs[cfg.outputPortIndex as number];
            start = {
              x: customX ? sourceNode.x + customX : sourceNode.x + cfg.start.x + sourceBoxBound.width,
              y: customY
                ? sourceNode.y + customY
                : sourceNode.y +
                  portXY(
                    sourceBoxBound.height,
                    cfg.outputPortIndex,
                    sourceNode?.component?.outputs?.length,
                    orientation,
                    'y'
                  ),
            };
          }
        } else {
          start = cfg.source as Position;
        }

        if (!(cfg.target as Position).x) {
          targetNode = (cfg.target as Item).getModel() as NodeItemConfig;
          if (orientation === 'vertical') {
            end = {
              x:
                targetNode.x +
                portXY(targetBoxBound.width, cfg.inputPortIndex, targetNode.component.inputs.length) +
                cfg.end.x,
              y: targetNode.y,
            };
          } else {
            end = {
              x: targetNode.x,
              y:
                targetNode.y +
                portXY(targetBoxBound.height, cfg.inputPortIndex, targetNode.component.inputs.length, orientation, 'y'),
            };
          }
        } else {
          end = cfg.target as Position;
        }
        const hgap = Math.abs(end.x - start.x) || 0.1;
        let path = [];
        if (hgap === 0) {
          path = [
            ['M', start.x, start.y],
            ['L', end.x, end.y],
          ];
        } else {
          if (orientation === 'vertical') {
            path = [
              ['M', start.x, start.y],
              ['C', start.x, start.y + hgap / (hgap / 50), end.x, end.y - hgap / (hgap / 50), end.x, end.y - 6],
              ['L', end.x, end.y],
            ];
          } else {
            path = [
              ['M', start.x, start.y],
              ['C', start.x + hgap / 2, start.y, end.x - hgap / 2, end.y, end.x, end.y],
              ['L', end.x, end.y],
            ];
          }
        }

        let lineWidth = 1;
        lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;

        let endArrowPath = 'M 10,0 L 20,5 L 20,-5 Z';
        if (orientation === 'horizontal') {
          endArrowPath = 'M 10,0 L 0,5 L 0,-5 Z';
        }

        const keyShape = group.addShape('path', {
          attrs: {
            id: 'edge' + uniqueId(),
            path: path,
            stroke: '#b8c3ce',
            endArrow: {
              path: endArrowPath, // 定义三角形
              d: 10,
              fill: '#b8c3ce',
              stroke: '#ffffff00',
            },
          },
          name: 'edgeKeyShape',
        });
        // 加一条透明的线，方便选取等操作
        group.addShape('path', {
          attrs: {
            id: 'edge' + uniqueId(),
            path: path,
            stroke: '#ffffff01',
            lineWidth: 15,
          },
          name: 'edgeBGShape',
        });

        return keyShape;
      },
      afterDraw(cfg: ModelConfig & IEdgeConfig, group) {
        if ((cfg.target as Item).getModel().status === 1 || cfg.isDashed) {
          const shape = group.get('children')[0];
          const length = shape.getTotalLength();
          let totalArray = [];
          for (let i = 0; i < length; i += interval) {
            totalArray = totalArray.concat(lineDash);
          }
          let index = 0;

          function onFrame() {
            const cfg = {
              lineDash: dashArray[index].concat(totalArray),
            };
            index = (index + 1) % interval;
            return cfg;
          }

          shape.animate(
            {
              onFrame: onFrame,
              repeat: true,
            },
            3000
          );
        }
      },
      setState: setEdgeState,
    });

    G6.registerEdge(
      'link-edge',
      {
        draw(cfg, group) {
          console.log('update draw');
          let sourceNode, targetNode, start, end;
          start = { x: cfg.startX, y: cfg.startY };
          end = { x: cfg.startX, y: cfg.startY };

          let path = [];
          const hgap = Math.abs(end.x - start.x);
          path = [
            ['M', start.x, start.y],
            ['C', start.x, start.y + hgap / (hgap / 50), end.x, end.y - hgap / (hgap / 50), end.x, end.y - 6],
            ['L', end.x, end.y],
          ];
          // path = [['M', start.x, start.y], ['L', end.x, end.y]];
          const keyShape = group.addShape('path', {
            attrs: {
              id: 'edge' + uniqueId(),
              path: path,
              stroke: '#697B8C',
              strokeOpacity: 0.9,
              lineDash: [5, 5],
            },
          });
          return keyShape;
        },
      },
      'cubic-vertical' // 定义一个继承edge，在updateItem的时候，就不会调用draw方法了，
    );
  },
};

export default customEdge;
