import type { NodeData } from 'arrangement-diagram';

export const nodes: NodeData[] = [
    {
        type: 'flow-node',
        id: 'node0',
        x: 456,
        y: 72,
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
    {
        type: 'card-node',
        id: 'node1',
        x: 166,
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
        x: 438,
        y: 490,
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
        x: 717,
        y: 200,
        portColor: '#69c0ff',
        fillColor: '#98fb98',
        strokeColor: '#ffefd5',
        icon: '',
        name: '节点3',
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
        isDashed: true
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