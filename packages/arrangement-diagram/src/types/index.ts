import type { IG6GraphEvent, NodeConfig, EdgeConfig, ComboConfig, Item, Graph } from '@antv/g6';
import { events } from '../util';
import type EventEmitter from 'eventemitter3';

type EventNames = keyof typeof events;

export type Bus = EventEmitter<EventNames>;
export interface portType {
  type: string;
  node: any;
  e: IG6GraphEvent;
  port: any;
  portType: 'in' | 'out';
}

// TODO: fix
export interface ArrangementDiagram {
  bus: any;
  graph: any;
}

export interface LayoutFlowEvent {
  event: IG6GraphEvent;
  model: NodeConfig | EdgeConfig | ComboConfig;
  item: Item;
  graph: Graph;
}
