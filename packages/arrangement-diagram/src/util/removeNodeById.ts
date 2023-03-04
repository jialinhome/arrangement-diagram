export function removeNodeById(graph, id) {
    const item = graph.findById(id);
    graph.removeItem(item);
}
