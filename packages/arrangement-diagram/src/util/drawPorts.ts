import uniqueId from 'lodash/uniqueId';
import { portXY, getOpacityColor } from './tools';

/**
 *
 * @param portList
 * @param group
 * @param width
 * @param color
 * @param offsetX
 * @param offsetY
 * @param portType
 */
export function drawPorts(config) {
    const { portList, group, width, height, color, offsetX, offsetY, portType, orientation } = config;
    const len = portList.length;

    portList.forEach((port, index) => {
        const id = portType + 'port' + uniqueId();
        port.index = index;
        // 连线的圆，要大一些
        group.addShape('circle', {
            attrs: {
                id: portType + 'port' + uniqueId(),
                portType: portType + 'out',
                parent: id,
                x: portXY(width, index, len, orientation, 'x') + offsetX,
                y: portXY(height, index, len, orientation, 'y') + offsetY,
                r: 10,
                fill: getOpacityColor(color, 0.5),
                opacity: 0,
                index: index,
                hasEdge: port.hasEdge || false,
                ...port,
            },
        });
        // 展示的圆
        group.addShape('circle', {
            attrs: {
                id: id,
                portType: portType,
                x: portXY(width, index, len, orientation, 'x') + offsetX,
                y: portXY(height, index, len, orientation, 'y') + offsetY,
                r: 4,
                fill: '#fff',
                stroke: color,
                lineWidth: 2,
                opacity: 0,
                index: index,
                hasEdge: port.hasEdge || false,
                ...port,
            },
        });
    });
}
