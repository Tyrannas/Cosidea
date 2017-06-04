import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home'
import Room from '@/components/pages/Room'

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
      name: 'Room',
      component: Room
    }
  ]
})
