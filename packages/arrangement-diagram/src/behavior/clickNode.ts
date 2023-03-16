import { clearAllStatus, handlerHighlight } from '../util/highlight';
import { isBoolean } from '../util';

export default function init(bus) {
  return {
    getEvents() {
      return {
        'node:click': 'onClick',
        'node:contextmenu': 'onContextMenu',
        'canvas:click': 'onCanvasClick',
      };
    },

    /**
     * @fires nodeSelect
     * @fires nodeUnselect
     */
    onClick(e) {
      const self = this;
      const item = e.item;
      const graph = self.graph;
      const autoPaint = graph.get('autoPaint');
      const data = item.getModel();

      let { highlightSelected } = data;
      if (!isBoolean(highlightSelected)) {
        highlightSelected = true;
      }

      graph.setAutoPaint(false);
      clearAllStatus(graph);

      if (item.hasState('selected')) {
        if (highlightSelected) {
          graph.setItemState(item, 'default', true);
        }
        bus.emit('nodeUnselect', {
          event: e,
          model: data,
          item: item,
          graph,
        });
      } else {
        if (highlightSelected) {
          graph.setItemState(item, 'selected', true);
        }
        bus.emit('nodeSelect', {
          event: e,
          model: data,
          item: item,
          graph,
        });
      }

      if (highlightSelected) {
        handlerHighlight(item, graph);
      }

      graph.paint();
      graph.setAutoPaint(autoPaint);
    },

    onCanvasClick() {
      const graph = this.graph;
      const autoPaint = graph.get('autoPaint');
      graph.setAutoPaint(false);

      clearAllStatus(graph);

      graph.paint();
      graph.setAutoPaint(autoPaint);
    },
    /**
     * @fires nodeRightClick
     */
    onContextMenu(e) {
      const graph = this.graph;
      bus.emit('nodeRightClick', {
        event: e,
        model: e.item.getModel(),
        item: e.item,
        graph,
      });
    },
  };
}
