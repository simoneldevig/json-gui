import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import PageHome from '@/pages/PageHome.vue';
import PageEntry from '@/pages/PageEntry.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: PageHome
  },
  {
    path: '/:type/:id',
    name: 'Endpoints',
    props: true,
    component: PageEntry
  }
  // {
  //   path: "*",
  //   name: "NotFound",
  //   component: PageNotFound
  // }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
