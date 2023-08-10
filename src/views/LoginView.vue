<!-- SCRIPT SECTION -->
<script setup>
import { defineEmits } from "vue";
import SoundCloud from "vue-material-design-icons/Soundcloud.vue";
const clientId = "b5dd9e992f02489c8ae1d217fb609101";
const emit = defineEmits(["authorizeAccess"]);
const hash = window.location.hash;
if (hash) {
  const token = hash.substring(1).split("&")[0].split("=")[1];
  window.location.hash = "#";
  sessionStorage.setItem("access_token", token);
  emit("authorizeAccess");
}

async function Login() {
  redirectToAuthCodeFlow();
}

// // Get the URL hash
// // Print the access token value to the console
async function redirectToAuthCodeFlow() {
  const scopes = [
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "user-top-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-follow-read",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
    "streaming",
  ].join(" ");
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "token");
  params.append("redirect_uri", "http://localhost:8080/");
  params.append("scope", scopes);
  params.append("show_dialog", true);

  // window location (redirect to authorize page)
  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}
</script>

<!-- TEMPLATE SECTION -->
<template>
  <div
    class="container d-flex flex-column align-items-center align-items-sm-start justify-content-center"
  >
    <div class="row d-flex g-3 align-items-center">
      <div class="d-flex gap-3 align-items-center">
        <SoundCloud
          fillColor="#F36921"
          title="app-logo"
          :size="48"
        ></SoundCloud>
        <span class="fs-5 fw-bold">Music Streaming</span>
      </div>

      <p>Let's login and enjoy the music</p>
    </div>
    <button type="button" class="btn btn-primary align-self-center" @click="Login">Login</button>
  </div>
</template>

<style scoped>
</style>