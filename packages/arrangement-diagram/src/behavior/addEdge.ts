import uniqueId from 'lodash/uniqueId';
import type EventEmitter from 'eventemitter3';
import type ArrangementDiagram from '../index';

export default function init(bus: EventEmitter, flow: ArrangementDiagram) {
  return {
    startPoint: null,
    startTarget: null,
    startItem: null,
    activeItem: null,
    curInPoint: null,

    getEvents() {
      return {
        mousemove: 'onMousemove',
        mouseup: 'onMouseup',
      };
    },

    onMousemove(e) {
      if (!this.startPoint) {
        const item = e.item;
        const model = item.getModel();
        const startX = parseInt(e.x); // 使用 pointX/pointY 坐标系
        const startY = parseInt(e.y);
        this.startPoint = { x: startX, y: startY };
        this.startItem = item;
        this.startTarget = e.target;

        this.edge = this.graph.addItem('edge', {
          id: `link-edge-${uniqueId()}`,
          source: model.id,
          target: model.id,
          startX,
          startY,
          start: { x: startX, y: startY },
          type: 'link-edge',
        });

        this.graph.find('node', (node) => {
          // 节点不能自己连自己
          if (item !== node) {
            // 高亮可以选择的port
            this.graph.setItemState(node, 'portHighlight');
          }
        });
      } else {
        if (this.edge) {
          const point = { x: e.x, y: e.y };
          this.graph.updateItem(this.edge, {
            source: this.startPoint,
            target: point,
          });
        }
      }
    },

    onMouseup(e) {
      const item = e.item;
      if (item && item.getType() === 'node') {
        const group = item.getContainer();
        if (e.target.attrs.portType == 'in') {
          const children = group.cfg.children;
          children.map((child) => {
            if (child.attrs.portType == 'inout' && child.attrs.parent === e.target.attrs.id) {
              this.activeItem = child;
            }
          });
          this.curInPoint = e.target;
        } else if (e.target.attrs.portType == 'inout') {
          this.activeItem = e.target;
          const children = group.cfg.children;
          children.map((child) => {
            if (child.attrs.portType == 'in' && child.attrs.id === e.target.attrs.parent) {
              this.curInPoint = child;
            }
          });
        }
        if (this.activeItem) {
          if (this.edge) {
            this.graph.removeItem(this.edge);

            const outputNodeData = this.startItem.getModel();
            const outputPortIndex = this.startTarget.attrs.index;
            const inputNodeData = item.getModel();
            const inputPortIndex = e.target.attrs.index;
            const inputPortData = e.target.cfg.attrs;
            const outputPortData = this.startTarget.cfg.attrs;

            const model = {
              id: 'edge' + uniqueId(),
              source: this.startItem,
              target: item,
              sourceId: this.startItem.getModel().id,
              targetId: item.getModel().id,
              type: 'customEdge',
              outputNodeData: outputNodeData,
              inputNodeData: inputNodeData,
              inputPortIndex: inputPortIndex,
              outputPortIndex: outputPortIndex,
              inputPortData,
              outputPortData,
            };

            this.graph.addItem('edge', model);
            this.graph.updateItem(this.startItem, outputNodeData);
            this.graph.updateItem(item, inputNodeData);

            bus.emit('edgeCreate', {
              id: model.id,
              data: model,
              event: e,
              graph: this.graph,
            });
          }
        } else {
          if (this.edge) this.graph.removeItem(this.edge);
        }
      } else {
        if (this.edge) this.graph.removeItem(this.edge);
      }

      // 连线完成后取消备选的port高亮
      this.graph.find('node', (node) => {
        this.graph.setItemState(node, 'default', false);
      });

      if (this.startItem) {
        this.graph.setItemState(this.startItem, 'hover', true);
      }

      this.graph.paint();
      this.startPoint = null;
      this.startTarget = null;
      this.startItem = null;
      this.activeItem = null;
      this.curInPoint = null;
      this.graph.setMode('default');
    },
  };
}
