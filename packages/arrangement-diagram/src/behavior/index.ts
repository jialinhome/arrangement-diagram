import G6 from '@antv/g6';
import hoverNode from './hoverNode';
import selectNodeVisit from './clickNode';
import emitDragNode from './emitDragNode';
import addEdge from './addEdge';
import clickCanvas from './clickCanvas';
import hoverEdge from './hoverEdge';
import clickEdge from './clickEdge';

import type EventEmitter from 'eventemitter3';
import type ArrangementDiagram from '../index';
import type { Bus } from '../types';

const behaviors = {
  'hover-node': hoverNode,
  'select-node-visit': selectNodeVisit,
  'emit-drag-node': emitDragNode,
  'add-edge': addEdge,
  'click-canvas': clickCanvas,
  'hover-edge': hoverEdge,
  'click-edge': clickEdge,
};

export function registerBehaviors(bus: Bus, flow: ArrangementDiagram) {
  for (const key in behaviors) {
    G6.registerBehavior(key, behaviors[key](bus, flow));
  }
}
