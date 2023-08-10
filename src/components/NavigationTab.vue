
<script setup>
import useEmitter from "@/composables/useEmitter";
import Home from "vue-material-design-icons/Home.vue";
import Magnify from "vue-material-design-icons/Magnify.vue";
import PlaylistMusic from "vue-material-design-icons/PlaylistMusic.vue";
import SoundCloud from "vue-material-design-icons/Soundcloud.vue";
import PlusCircleOutline from "vue-material-design-icons/PlusCircleOutline.vue";
import Menu from "vue-material-design-icons/Menu.vue";
import { RouterLink, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import SpotifyWebApi from "spotify-web-api-js";
import PlaylistCard from "./PlaylistCard.vue";

// selected variable to define selected icon
const selectedItem = ref("Home");

// store array of playlists
const myPlaylists = ref(null);

const router = useRouter();

// a custom emitter by using mitt library, allow emit and catch event between component that does not have child-parent relation
const emitter = useEmitter();

const createPlaylistInput = ref("");

// variable to define selected playlist
let selectedPlaylist = ref(null);
// new Spotify Api instance
const spotify = new SpotifyWebApi();

async function getMyPlaylists() {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  spotify.getUserPlaylists().then((data) => {
    // myPlaylists.value is assigned with array of SimplifiedPlaylistObject
    myPlaylists.value = data.items;
    console.log("🤔 Playlist user's followed or owned", data);
  });
}

function updateSelectedItem(item) {
  selectedItem.value = item;
  switch (item) {
    case "Your Playlists":
      selectedPlaylist.value = myPlaylists.value[0]?.id;
      break;
    default:
      selectedPlaylist.value = null;
  }
}

// function to toggle the sidebar menu on small screen device
function toggleSidebar() {
  const sidebarToggle = document.querySelector(".sidebar-open-menu-btn");
  const sidebarFull = document.querySelector(".sidebar-full");
  const overlay = document.querySelector(".overlay");
  sidebarToggle.addEventListener("click", () => {
    sidebarFull.style.left = "0px";
    sidebarFull.style.transition = "left 0.2s";
    sidebarFull.style.zIndex = "1";
    sidebarFull.style.flex = "0";
    overlay.style.display = "block";
    overlay.style.zIndex = "1";
  });

  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    sidebarFull.style.left = "-250px";
    sidebarFull.style.zIndex = "0";
    sidebarFull.style.flex = 0.8;
    sidebarFull.style.flex = "0.2";
  });
}

// function to create new playlist
async function createPlaylist() {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  const userId = sessionStorage.getItem("userId");
  await spotify.createPlaylist(userId, { name: createPlaylistInput.value });
  await getMyPlaylists();
}

// function to handle when an playlist is selected
async function getPlaylistDetails(playlistId) {
  updateSelectedItem("Your Playlists");
  selectedPlaylist.value = playlistId;
  router.push({ name: "PlaylistsDetailView", params: { playlistId } });
}

// get logged in user profile
async function getMyProfile() {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  spotify.getMe().then((data) => {
    sessionStorage.setItem("userId", data.id);
  });
}

// Setup the player for the web app
async function setUpPlayer() {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  const availableDeviceResponse = await spotify.getMyDevices();
  console.log("available devices", availableDeviceResponse);

  const availableDevices = availableDeviceResponse.devices;
  if (availableDevices.length == 0) {
    return;
  }

  const deviceId = availableDevices[0].id.toString();
  console.log("id: ", deviceId);
  sessionStorage.setItem("deviceId", deviceId);
  spotify.transferMyPlayback([deviceId]);
}

function updateOnDeletePlaylist() {
  emitter.on("delete-playlist", (playlistId) => {
    const indexToDelete = myPlaylists.value.findIndex(
      (obj) => obj.id == playlistId
    );
    myPlaylists.value.splice(indexToDelete, 1);
    console.log("delete-playlist handler", `Delete playlist: ${playlistId}`);
  });
}

//  Get user's playlists, user's profile, available devices on mounted
onMounted(getMyPlaylists);
onMounted(getMyProfile);
onMounted(setUpPlayer);

// add function to handle sidebar toggle
onMounted(toggleSidebar);
// add a function to handle when a playlist is deleted
onMounted(updateOnDeletePlaylist);
</script>

<template>
  <div class="sidebar-toggle">
    <RouterLink
      to="/"
      class="sidebar-toggle-brand"
      @click="updateSelectedItem('Home')"
    >
      <SoundCloud fillColor="#F36921" title="app-logo" :size="48"></SoundCloud>
    </RouterLink>
    <Menu class="sidebar-open-menu-btn"></Menu>
  </div>

  <div class="sidebar-full">
    <div class="sidebar-header">
      <RouterLink
        to="/"
        class="sidebar-brand"
        @click="updateSelectedItem('Home')"
      >
        <SoundCloud
          fillColor="#F36921"
          title="app-logo"
          :size="48"
        ></SoundCloud>
        <span>Music Streaming</span>
      </RouterLink>
    </div>

    <div
      class="sidebar-options"
      :class="{ selected: selectedItem === 'Home' }"
      @click="updateSelectedItem('Home')"
    >
      <RouterLink to="/">
        <Home title="Home" class="sidebar-options-icon" :size="25"></Home>
        <span>Home</span>
      </RouterLink>
    </div>
    <div
      class="sidebar-options"
      :class="{ selected: selectedItem === 'Search' }"
    >
      <Magnify title="Search" class="sidebar-options-icon" :size="25"></Magnify>
      <span>Search</span>
    </div>
    <br />

    <div
      class="sidebar-options"
      :class="{ selected: selectedItem === 'Your Playlists' }"
    >
      <PlaylistMusic
        title="Playlists"
        class="sidebar-options-icon"
        :size="25"
      ></PlaylistMusic>
      <span>Your Playlists</span>
      <div
        class="add-to-playlist-icon"
        data-bs-toggle="modal"
        data-bs-target="#createNewPlaylistForm"
      >
        <PlusCircleOutline></PlusCircleOutline>
      </div>
    </div>

    <div class="playlists-list-container">
      <PlaylistCard
        v-for="(playlist, index) in myPlaylists"
        :key="index"
        :playlist="playlist"
        :class="{ selected: selectedPlaylist === playlist.id }"
        @getPlaylistDetails="getPlaylistDetails"
      ></PlaylistCard>
    </div>
  </div>

  <div class="overlay"></div>

  <!-- create New Playlist form modal -->
  <div
    class="modal fade"
    id="createNewPlaylistForm"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal header -->
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">
            Create new playlist
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="row">
            <div class="col">
              <input
                type="text"
                class="form-control"
                placeholder="Playlist name"
                aria-label="Search for the tracks to add"
                v-model="createPlaylistInput"
              />
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="createPlaylist"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-full {
  display: flex;
  flex-direction: column;
  flex: 0.2;
  gap: 0.5rem;
  background-color: white;
  align-items: flex-start;
  justify-content: flex-start;
  color: #2e3271;
  padding: 0.5rem 0.5rem;
  height: 100vh;
  min-width: 230px;
  position: sticky;
  left: 0;
  top: 0;
}

.sidebar-toggle {
  display: none;
}
.sidebar-header {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-brand > span {
  font-size: 1.2rem;
  font-weight: 700;
}
.sidebar-options {
  display: flex;
  flex-basis: 0;
  flex-grow: 1;
  justify-content: flex-start;
  box-sizing: border-box;
  cursor: pointer;
  color: #2e3271;
  padding: 0rem 0.5rem;
  transition: 200ms color ease-in;
  width: 100%;
}

.sidebar-options:hover {
  color: #f36921;
}

.sidebar-options-icon {
  margin-right: 1rem;
}
.sidebar-options > span {
  font-size: 14px;
}

.add-to-playlist-icon {
  margin-left: auto;
}

hr {
  color: #2e3271;
}

.selected {
  color: #f36921;
}

li:hover {
  cursor: pointer;
}

a {
  text-decoration: none;
  color: inherit;
}

.playlists-list-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  flex-grow: 1;
  margin-bottom: auto;
  overflow: auto;
  padding: 0.5rem;
}

.playlists-list-container:last-child {
  margin-bottom: 150px;
}

.playlists-list-container::-webkit-scrollbar {
  width: 0.25rem;
}

.playlists-list-container::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 6px;
}

/* Handle on hover */
.playlists-list-container::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 250px;
  width: calc(100% - 250px);
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: -1; /* Initially, set it behind the menu */
}

@media screen and (max-width: 992px) {
  .sidebar-toggle {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0rem 0.5rem;
    align-items: center;
    background-color: white;
  }

  .sidebar-full {
    max-width: 250px;
    position: fixed;
    top: 0;
    left: -250px;
  }
}
</style>
