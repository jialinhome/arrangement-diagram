export default function init(bus) {
  return {
    getEvents() {
      return {
        'node:dragstart': 'dragStart',
        'node:drag': 'drag',
        'node:dragend': 'dragEnd',
      };
    },
    /**
     * @fires nodeDragStart
     */
    dragStart(e) {
      const graph = this.graph;
      bus.emit('nodeDragStart', {
        event: e,
        model: e.item.getModel(),
        item: e.item,
        graph,
      });
    },

    drag(e) {
      // 不派发 dragging 事件，因为可能会造成性能问题
    },

    /**
     * @fires nodeDragEnd
     */
    dragEnd(e) {
      const graph = this.graph;
      this.graph.paint();
      bus.emit('nodeDragEnd', {
        event: e,
        model: e.item.getModel(),
        item: e.item,
        graph,
      });
    },
  };
}
