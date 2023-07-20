import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MyPlaylistsView from '@/views/MyPlaylistsView.vue'
// import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      name: 'HomeView'
    },
    // {
    //   path: '/login',
    //   component: LoginView,
    //   name: 'LoginView' 
    // },
    {
      path: '/myplaylists',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: MyPlaylistsView,
      name: 'MyPlaylistsView'
    }
  ]
})

export default router
