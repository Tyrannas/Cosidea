import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/pages/Home.vue'
import Recif from '../components/pages/Recif.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/:recif',
      name: 'Recif',
      component: Recif
    }
  ]
})
