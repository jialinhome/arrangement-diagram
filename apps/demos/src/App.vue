<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="main-container">
    <!-- <nav class="left">
      <RouterLink class="router-link" to="/">Home</RouterLink>
      <RouterLink class="router-link" to="/about">About</RouterLink>
      <RouterLink class="router-link" to="/layout">Layout</RouterLink>
    </nav> -->
    <RouterView />
  </div>
</template>

<style scoped>
.main-container {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #242424;
}
.left {
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 200px;
}

.right {
  margin-left: 200px;
  height: 100vh;
}

.router-link {
  display: block;
}
</style>
