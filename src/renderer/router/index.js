import Vue from 'vue'
import Router from 'vue-router'
import ControlPanel from '../pages/ControlPanel.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'controlPanel',
      component: ControlPanel
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
