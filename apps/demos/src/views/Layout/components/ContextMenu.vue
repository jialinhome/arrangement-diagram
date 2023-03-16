<template>
  <ul class="menu" ref="menu">
    <li v-for="item in list" :key="item" @click="closeMenu">{{ item }}</li>
  </ul>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from "vue";
import ArrangementDiagram from "arrangement-diagram";

const props = defineProps({
  arrangementDiagram: {
    type: ArrangementDiagram,
    defalut: null,
  },
});

const list = ref(["菜单项1", "菜单项2", "菜单项3"]);

const menu = ref<HTMLElement | null>(null);

function showMenu(x: number, y: number) {
  const contextmenu = menu.value!;
  contextmenu.style.top = y + "px";
  contextmenu.style.left = x + "px";
  contextmenu.style.display = "block";
}

function closeMenu() {
  menu.value!.style.display = "none";
}

const unwatch = watch(
  () => props.arrangementDiagram,
  (arrangementDiagram) => {
    if (arrangementDiagram instanceof ArrangementDiagram) {
      const { bus } = props.arrangementDiagram!;
      bus.on("nodeRightClick", (e) => {
        const { x, y } = e.event.originalEvent;
        showMenu(x, y);
      });
      bus.on("canvasClick", (e) => {
        closeMenu();
      });
      unwatch();
    }
  }
);
</script>

<style scoped>
.menu {
  display: none;
  position: fixed;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
  top: 0;
  left: 0;
  padding-left: 20px;
  color: #808080;
}

.menu li {
  padding: 5px 10px;
  cursor: pointer;
}

.menu li:hover {
  background-color: #eee;
}
</style>
