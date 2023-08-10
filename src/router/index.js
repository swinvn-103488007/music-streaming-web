import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PlaylistsDetailView from '@/views/PlaylistsDetailView.vue'
// import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      name: 'HomeView'
    },
    {
      path: "/myplaylists/:playlistId",
      component: PlaylistsDetailView,
      name: 'PlaylistsDetailView'
    }
  ]
})

export default router
