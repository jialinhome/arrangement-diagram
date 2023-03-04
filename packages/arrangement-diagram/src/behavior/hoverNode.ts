import { outPortColor } from '../util/index';
import type EventEmitter from 'eventemitter3';
import type ArrangementDiagram from '../index';

export default function init(bus: EventEmitter, flow: ArrangementDiagram) {
    return{
        getEvents() {
            return {
                'node:mousedown': 'onMouseDown',
                'node:mouseover': 'onMouseOver',
                'node:mouseleave': 'onMouseLeave',
            };
        },

        onMouseDown(e) {
            const graph = this.graph;
            bus.emit('nodeUnHover', {
                event: e,
                model: e.item.getModel(),
                item: e.item,
                graph
            });
            // 右键取消hover
            if (e.originalEvent.button == 2) {
                this.graph.setItemState(e.item, 'default', true);
            }
            // 右键不换mode
            if (e.originalEvent.button == 2 || this.graph.getCurrentMode() !== 'default') {
                return;
            }
            if (e.target.attrs.portType === 'out' || e.target.attrs.portType === 'outout') {
                // 触发自定义 addEdge behavior
                this.graph.setMode('addEdge');
            } else {
                // 触发自定义 dragNode behavior
                this.graph.setMode('dragNode');
            }
        },

        onMouseOver(e) {
            const graph = this.graph;
            const item = e.item;
            const group = item.getContainer();
            const model = item.getModel();
            let portColor = model.portColor || flow.portColor;

            if (e.target.attrs.portType === 'out' || e.target.attrs.portType === 'outout') {
                e.target.attr('cursor', 'crosshair');
                group.find((g) => {
                    if (g.attrs.portType === 'in' || g.attrs.portType === 'out') {
                        g.attr('fill', '#fff');
                    }
                });
                // hover内圆
                group.find((g) => {
                    if (g.attrs.id === e.target.attrs.id && g.attrs.portType === 'out') {
                        g.attr('fill', portColor);
                        group.find((gOut) => {
                            if (gOut.attrs.parent === e.target.attrs.id) {
                                gOut.attr('fill', outPortColor(portColor));
                                gOut.attr('opacity', 1);
                            }
                        });
                    }
                });
                // hover外圆
                group.find((g) => {
                    if (g.attrs.id === e.target.attrs.id && g.attrs.portType === 'outout') {
                        g.attr('fill', outPortColor(portColor));
                        g.attr('opacity', 1);
                        group.find((gIn) => {
                            if (gIn.attrs.id === e.target.attrs.parent) {
                                gIn.attr('fill', portColor);
                            }
                        });
                    }
                });
                bus.emit('portHover', {
                    item: item,
                    portType: 'out',
                    model: item.getModel(),
                    event: e,
                    port: item.getModel().component.outputs[e.target.attrs.index],
                });
            } else if (e.target.attrs.portType === 'in' || e.target.attrs.portType === 'inout') {
                bus.emit('portHover', {
                    item: item,
                    portType: 'in',
                    model: e.item.getModel(),
                    event: e,
                    port: item.getModel().component.inputs[e.target.attrs.index],
                });
            } else {
                e.target.attr('cursor', 'move');
                group.find((g) => {
                    if (g.attrs.portType === 'in' || g.attrs.portType === 'out') {
                        g.attr('fill', '#fff');
                    }
                    if (g.attrs.portType === 'inout' || g.attrs.portType === 'outout') {
                        g.attr('opacity', 0);
                    }
                });
                bus.emit('nodeHover', {
                    event: e,
                    model: item.getModel(),
                    item: item,
                    graph
                });
            }
            if (!item.hasState('selected')) {
                this.graph.setItemState(item, 'hover', false);
                this.graph.paint();
            }
        },

        onMouseLeave(e) {
            const graph = this.graph;
            const item = e.item;
            const group = item.getContainer();
            if (!(item.hasState('highlight') || item.hasState('selected'))) {
                // this.graph.clearItemStates(item, ['hover']);
                this.graph.setItemState(item, 'default', false); // 第三个参数为false，表示不会被item.states收集
                this.graph.paint();
            }
            group.find((g) => {
                if (g.attrs.portType === 'in' || g.attrs.portType === 'out') {
                    g.attr('fill', '#fff');
                }
                if (g.attrs.portType === 'inout' || g.attrs.portType === 'outout') {
                    g.attr('opacity', 0);
                }
            });
            bus.emit('nodeUnHover', {
                event: e,
                model: e.item.getModel(),
                item: item,
                graph
            });
        },

        hoverItem: null,
    };
}
