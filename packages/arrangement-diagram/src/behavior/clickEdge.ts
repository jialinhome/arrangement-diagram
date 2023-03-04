export default function init(bus) {
    return {
        getEvents() {
            return {
                'edge:contextmenu': 'onContextMenu',
                'edge:click': 'onEdgeClick',
            };
        },

        onContextMenu(e) {
            const graph = this.graph;
            bus.emit('edgeRightClick', {
                event: e,
                model: e.item.getModel(),
                item: e.item,
                graph,
            });
        },
        onEdgeClick(e) {
            const graph = this.graph;
            bus.emit('edgeClick', {
                event: e,
                model: e.item.getModel(),
                item: e.item,
                graph,
            });
        },
    };
}
