import { selectColor } from './index';

export interface StatePlugin {
    name: string;
    exec: (shape: any, circles, outCircles, data) => void;
}

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

const edgeState = {
    hover(item: Item) {
        const shape = item.getKeyShape();
        // shape.attr(key,value)会自动更新箭头属性，所以我们这里需要这样设置，具体可以查看源码
        const endArrow = shape.attr('endArrow');
        endArrow.fill = '#1B77EC';
        shape.attr('stroke', '#1B77EC');
        shape.attr('lineWidth', 1.4);
    },
    unHover(item: Item) {
        const shape = item.getKeyShape();
        const endArrow = shape.attr('endArrow');
        endArrow.fill = '#b8c3ce';
        shape.attr('stroke', '#b8c3ce');
        shape.attr('lineWidth', 1);
    },
    selected(item) {
        const shape = item.getKeyShape();
        if (shape.attr('stroke') === '#b8c3ce') {
            shape.attr('stroke', '#1B77EC');
            shape.attr('lineWidth', 1.4);
        }
    },
    highlight(item) {
        const shape = item.getKeyShape();
        const endArrow = shape.attr('endArrow');
        endArrow.fill = '#0bb867';
        shape.attr('stroke', '#0bb867');
        shape.attr('lineWidth', 1.4);
    },
    default(item) {
        const shape = item.getKeyShape();
        const endArrow = shape.attr('endArrow');
        endArrow.fill = '#b8c3ce';
        shape.attr('stroke', '#b8c3ce');
        shape.attr('lineWidth', 1);
    },
};

export function setEdgeState(name, value, item) {
    edgeState[name] && edgeState[name](item);
}
