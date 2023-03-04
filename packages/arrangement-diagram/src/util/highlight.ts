import type { Graph, INode } from '@antv/g6';

export function handlerHighlight(item: INode, graph: Graph) {
    let highlightItem = [];

    graph.getEdges().forEach((edge) => {
        if (edge.getTarget() === item) {
            let target = edge.getSource();
            highlightItem.push(target);
            highlightItem.push(edge);
        }
    });

    for (let item of highlightItem) {
        graph.setItemState(item, 'highlight', true);
    }
}

export function clearAllStatus(graph: Graph) {
    const nodes = graph.getNodes();
    graph.getNodes().forEach(function (node) {
        graph.clearItemStates(node);
        graph.setItemState(node, 'default', true);
    });
    graph.getEdges().forEach(function (edge) {
        graph.clearItemStates(edge);
        graph.setItemState(edge, 'default', true);
    });
}

function findHighlightItem(item, highlightItem, graph) {
    let model = item.getModel();
    graph.getEdges().forEach((edge) => {
        if (edge.getTarget() === item) {
            let target = edge.getSource();

            highlightItem.push(target);
            highlightItem.push(edge);

            findHighlightItem(target, highlightItem, graph);
        }
    });
}

/**
 * 局部运行路径。
 *
 * @param {*} items array 需高亮的节点
 * @param {*} graph graph 实例
 */
export function handlerLocalOperationlightPath(items, graph) {
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    clearAllStatus(graph);
    items.map((item) => {
        let node = graph.findById(item.id);
        handlerHighlight(node, graph);
    });
    graph.paint();
    graph.setAutoPaint(autoPaint);
}

export function handlerLocalHighlight(item, graph) {
    let highlightItem = [];
    let failHighlightItem = [];
    let model = item.getModel();

    if (model.failStatus) {
        failHighlightItem.push(item);
    } else {
        highlightItem.push(item);
    }
    graph.getEdges().forEach((edge) => {
        if (edge.getTarget() === item) {
            let target = edge.getSource();
            let model = target.getModel();
            if (model.failStatus) {
                failHighlightItem.push(target);
                failHighlightItem.push(edge);
            } else {
                highlightItem.push(edge);
            }
        }
    });

    for (let item of highlightItem) {
        graph.setItemState(item, 'highlight', true);
    }

    for (let item of failHighlightItem) {
        graph.setItemState(item, 'failHighlight', true);
    }
    return highlightItem;
}
