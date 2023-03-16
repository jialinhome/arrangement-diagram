<template>
  <div class="title">组件列表</div>
  <ul class="container">
    <li
      class="item"
      :draggable="true"
      v-for="item in list"
      :key="item.id"
      :style="{ 'background-color': item.bgColor }"
      @dragstart="handleDragStart($event, item)"
    >
      {{ item.text }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const list = reactive([
  { type: "card-node", bgColor: "#add8e6", id: 1001, text: "card-node组件1" },
  { type: "card-node", bgColor: "#e6e6fa", id: 1002, text: "card-node组件2" },
  { type: "flow-node", bgColor: "#f0e68c", id: 2001, text: "flow-node组件2" },
  { type: "flow-node", bgColor: "#f08080", id: 2002, text: "flow-node组件2" },
]);

const handleDragStart = (e: DragEvent, item: (typeof list)[0]) => {
  const content = JSON.stringify(item);
  e.dataTransfer!.setData("item", content);
  console.log(e);
  console.log(item);
};
</script>

<style scoped>
.container {
  padding: 0 10px;
}

.title {
  padding-left: 10px;
}
.item {
  width: 100%;
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 34px;
  padding: 0 9px;
  margin-top: 8px;
  font-size: 14px;
  line-height: 1;
  border-width: 1px;
  border-style: solid;
  border-radius: 4;
  box-sizing: border-box;
  white-space: nowrap;
  cursor: move;
}
</style>
