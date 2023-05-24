import { createRouter, createWebHistory } from "vue-router";
import { cityLoadOneResolver } from "@/resolvers/city.resolver";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import CityList from "@/views/cities/CityList.vue";
import CityForm from "@/views/cities/CityForm.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/city",
    name: "city",
    children: [
      {
        path: "list",
        name: "city-list",
        component: CityList,
      },
      {
        path: "form",
        name: "city-add",
        component: CityForm,
      },
      {
        path: "form/:id",
        name: "city-update",
        component: CityForm,
        beforeEnter: cityLoadOneResolver,
      },
    ],
    redirect: { name: "city-list" },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  if (!sessionStorage.getItem("user") && to.name !== "login") {
    return { name: "login" };
  }
  if (sessionStorage.getItem("user") && to.name == "login") {
    return { name: "home" };
  }
});

export default router;
