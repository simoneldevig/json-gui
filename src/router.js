import Vue from "vue";
import Router from "vue-router";
import PageHome from "@/pages/PageHome.vue";
import PageEntry from "@/pages/PageEntry.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: PageHome
    },
    {
      path: "/:type/:id",
      name: "Endpoints",
      props: true,
      component: PageEntry
    },
    // {
    //   path: "*",
    //   name: "NotFound",
    //   component: PageNotFound
    // }
  ],
  mode: "history"
});
