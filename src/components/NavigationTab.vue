<template>
  <nav class="navbar navbar-expand-lg bg-white">
    <div class="container-fluid">
      <RouterLink class="ps-1 navbar-brand fw-bold d-flex" to="/">
        <SoundCloud
          class="me-1"
          fillColor="#F36921"
          title="app-logo"
          :size="48"
        ></SoundCloud>
        <span class="align-self-center">Streaming Web</span>
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="ps-2 navbar-nav me-auto mb-2 mb-lg-0">
          <li
            class="nav-item mb-3"
            :class="{ selected: selected === 'Home' }"
            @click="updateSelected('Home')"
          >
            <RouterLink to="/">
              <Home title="Home" class="icon me-1"></Home>
              <span class="align-self-end"> Home</span>
            </RouterLink>
          </li>
          <li
            class="nav-item mb-3"
            :class="{ selected: selected === 'Search' }"
            @click="updateSelected('Search')"
          >
            <Magnify title="Search" class="icon me-1"></Magnify>
            <span class="align-self-end"> Search</span>
          </li>
          <li
            class="nav-item mb-3"
            :class="{ selected: selected === 'Playlists' }"
            @click="updateSelected('Playlists')"
          >
            <RouterLink to="/myplaylists">
              <PlaylistMusic
                title="Playlists"
                class="icon me-1"
              ></PlaylistMusic>
              <span class="align-self-end"> Playlists</span>
            </RouterLink>
          </li>
          <li
            class="nav-item mb-3"
            :class="{ selected: selected === 'Settings' }"
            @click="updateSelected('Settings')"
          >
            <Cog title="Settings" class="icon me-1"></Cog>
            <span class="align-self-end"> Settings</span>
          </li>
          <li
            class="nav-item mb-3"
            :class="{ selected: selected === 'Logout' }"
            @click="updateSelected('Logout')"
          >
            <Logout title="Logout" class="icon me-1"></Logout>
            <span class="align-self-end"> Logout</span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import Home from "vue-material-design-icons/Home.vue";
import Magnify from "vue-material-design-icons/Magnify.vue";
import PlaylistMusic from "vue-material-design-icons/PlaylistMusic.vue";
import Cog from "vue-material-design-icons/Cog.vue";
import Logout from "vue-material-design-icons/Logout.vue";
import SoundCloud from "vue-material-design-icons/Soundcloud.vue";
import { RouterLink } from "vue-router";
import { ref } from "vue";

let selected = ref("Home");

function updateSelected(item) {
  selected.value = item;
}
</script>

<style scoped>
@media screen and (min-width: 992px) {
  /*
      Change the direction of the navbar
      Nav bar collapse when screen width < 992px
    */
  .navbar .container-fluid,
  .navbar-expand-lg .navbar-collapse,
  .navbar-expand-lg .navbar-nav {
    flex-direction: column;
    align-items: flex-start;
  }
  .navbar {
    height: 100vh;
    align-items: flex-start;
  }
}
.navbar .navbar-nav .nav-item {
  color: #2e3271;
}

.icon {
  color: rgba(124, 141, 181, 0.72);
}
.selected span,
.selected .icon {
  color: #f36921;
}

li:hover {
  cursor: pointer;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
