export default function init(bus) {
  return {
    getEvents() {
      return {
        'canvas:click': 'onCanvasClick',
      };
    },

    onCanvasClick(e) {
      e.preventDefault();
      bus.emit('canvasClick', {
        event: e,
      });
    },
  };
}
