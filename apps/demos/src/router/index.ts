import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "demo",
      component: () => import("../views/Layout/Basic.vue"),
    },
  ],
});

export default router;
