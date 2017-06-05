import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/pages/Home.vue'
import SigmaRoom from '../components/pages/SigmaRoom.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/room',
      name: 'SigmaRoom',
      component: SigmaRoom
    }
  ]
})
