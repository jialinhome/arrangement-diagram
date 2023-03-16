<template>
  <el-table class="table" :data="list" style="width: 100%">
    <el-table-column prop="key" label="属性名" />
    <el-table-column prop="value" label="属性值" />
  </el-table>
</template>

<script setup lang="ts">
import { defineProps, computed, onMounted, watch } from "vue";

const props = defineProps({
  selectedItem: {
    type: Object,
    default: () => {},
  },
});

const list = computed(() => {
  const entires = Object.entries(props.selectedItem);
  return entires.map(([key, value]) => {
    return { key, value };
  });
});
</script>

<style scoped>
.table {
  background-color: #242424;
}
</style>

<style>
.el-table tr {
  background-color: #242424;
}
.el-table th.el-table__cell {
  background-color: #242424;
}
</style>
