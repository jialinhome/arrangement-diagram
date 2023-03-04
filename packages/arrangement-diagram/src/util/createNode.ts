import uniqueId from 'lodash/uniqueId';
import type { Graph } from '@antv/g6';
import type { NodeData, NodeConfig } from '../types/nodeType';

export function createNode(graph: Graph, config: NodeConfig, type: string = 'rectNode') {
    const xy = graph.getPointByClient(config.clientX, config.clientY);
    const node: NodeData = {
        ...config,
        x: xy.x,
        y: xy.y,
    };
    node.type = type;
    if (!node.id) {
        node.id = 'node' + uniqueId();
    }
    if (!node.color) {
        node.color = '#1B77EC';
    }
    graph.addItem('node', node);
}
