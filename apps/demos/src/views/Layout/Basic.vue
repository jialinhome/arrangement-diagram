<template>
  <!-- <header class="header">
        <span>Arrangement Diagram</span>
        <span class="desc">基于@antv/g6的编排可视化解决方案</span>
    </header> -->
  <div class="content">
    <div
      class="graph-container"
      ref="graphContainer"
      @drop="drop($event as E)"
    ></div>
    <div class="left">
      <Left />
    </div>
    <div class="right">
      <Rigth :selected-item="selectedItem" />
    </div>
  </div>
  <ContextMenu :arrangementDiagram="arrangementDiagram" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ArrangementDiagram from "arrangement-diagram";
import data from "./data";
import createCardNode from "./createCardNode";
import createFlowNode from "./createFlowNode";
import Left from "./components/Left.vue";
import Rigth from "./components/Right.vue";
import ContextMenu from "./components/ContextMenu.vue";
import type {
  StatePlugin,
  DrawNodeShapeConfig,
  NodeData,
} from "arrangement-diagram";
type E = DragEvent & Pick<MouseEvent, "offsetX" | "offsetY">;

let arrangementDiagram = ref<ArrangementDiagram>();
let count = 1;
let selectedItem = ref({});

const drop = (e: E) => {
  e.preventDefault();
  const { graph } = arrangementDiagram.value!;
  const data = e.dataTransfer!.getData("item");
  const { type, id, text, bgColor } = JSON.parse(data);
  let model: NodeData = {
    type,
    id: "" + id + count++,
    x: e.offsetX,
    y: e.offsetY,
    name: text,
    fillColor: bgColor,
    component: {
      inputs: [
        {
          portId: 101 + count++,
        },
      ],
      outputs: [
        {
          portId: 989 + count++,
        },
      ],
    },
  };
  if (type === "flow-node") {
    model = {
      ...model,
      name: "节点名称",
      keyInfo: "this is keyInfo",
      count: 123456,
      label: "538.90",
      currency: "Yuan",
      rate: 1.0,
      status: "B",
      variableName: "V1",
      variableValue: 0.341,
      variableUp: false,
    };
  }
  graph.addItem("node", model, false);
};

const registerNodeConfigs = [
  {
    nodeType: "card-node",
    width: 234,
    height: 64,
    drawNodeShape: (cfg: DrawNodeShapeConfig) => {
      return createCardNode(cfg);
    },
  },
  {
    nodeType: "flow-node",
    width: 200,
    height: 60,
    drawNodeShape: (cfg: DrawNodeShapeConfig) => {
      return createFlowNode(cfg);
    },
  },
];

const nodeStatePlugins: StatePlugin[] = [
  {
    name: "selected",
    exec: (item, params) => {
      const { keyShape, data, circles } = params;
      keyShape.attr("fill", "#ff0000");
      keyShape.attr("stroke", "#00ffff");
      keyShape.attr("cursor", "move");
      circles?.forEach((circle) => {
        circle.attr("opacity", 1);
      });
    },
  },
];

const graphContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  const graphContainerElement = graphContainer.value as HTMLElement;
  arrangementDiagram.value = new ArrangementDiagram(
    {
      container: graphContainerElement,
      width: graphContainerElement.offsetWidth,
      height: graphContainerElement.offsetHeight,
      renderer: "canvas",
      registerNodeConfigs,
      nodeStatePlugins,
    },
    data
  );

  graphContainerElement.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
  const { bus } = arrangementDiagram.value;

  bus.on("nodeSelect", (e) => {
    const { model } = e;
    selectedItem.value = model;
  });

  bus.on("canvasClick", (e) => {
    selectedItem.value = {};
  });
});
</script>

<style scoped>
.header {
  font-size: 25px;
  height: 50px;
  line-height: 45px;
  vertical-align: baseline;
  color: #ffffff;
  border-bottom: 1px solid #dcdfe6;
  padding-left: 5px;
}

.header .desc {
  font-size: 14px;
  vertical-align: baseline;
  color: darkgray;
  margin-left: 10px;
}
.content {
  height: calc(100vh - 45px);
  padding: 0 200px 0 140px;
}
.graph-container {
  float: left;
  width: 100%;
  height: 100%;
  background-color: #323232;
}

.left {
  float: left;
  width: 140px;
  height: 100%;
  margin-left: -100%;
  position: relative;
  left: -140px;
  border-right: 1px solid #dcdfe6;
}
.right {
  float: left;
  width: 200px;
  height: 100%;
  margin-left: -200px;
  position: relative;
  left: 200px;
  border-left: 1px solid #dcdfe6;
  overflow-y: scroll;
}
</style>
