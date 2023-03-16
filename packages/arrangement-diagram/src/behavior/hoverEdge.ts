import { Bus } from '@/types';

export default function init(bus: Bus) {
  return {
    getEvents() {
      return {
        'edge:mouseover': 'onMouseOver',
        'edge:mouseleave': 'onMouseLeave',
        'edge:contextmenu': 'onContextMenu',
      };
    },

    onMouseOver(e) {
      const item = e.item;
      const graph = this.graph;
      if (!item.hasState('selected') && !item.hasState('highlight')) {
        this.graph.setItemState(item, 'hover', false);
      }
      bus.emit('edgeHover', {
        event: e,
        model: e.item.getModel(),
        item: e.item,
        graph,
      });
      this.graph.paint();
    },

    onMouseLeave(e) {
      const item = e.item;
      const graph = this.graph;
      if (!item.hasState('selected') && !item.hasState('highlight')) {
        this.graph.setItemState(item, 'default', false);
      }
      bus.emit('edgeUnHover', {
        event: e,
        model: e.item.getModel(),
        item: e.item,
        graph,
      });
      this.graph.paint();
    },

    /**
     * @fires onEdgeRightClick
     */
    onContextMenu(e) {
      const graph = this.graph;
      bus.emit('edgeRightClick', {
        event: e,
        model: e.item.getModel(),
        item: e.item,
        graph,
      });
    },
  };
}
