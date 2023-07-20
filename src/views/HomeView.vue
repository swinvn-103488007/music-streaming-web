<template>
  <div class="flex-grow-1 bg-app-bg">
    <h4>Your top artist</h4>
    <div class="wrapper">
      <ArtistCard
        v-for="(artist, index) in topArtists"
        :key="index"
        :img-url="artist.images[0].url"
        :name="artist.name"
      ></ArtistCard>
    </div>

    <h4>Your top tracks</h4>
    <div class="wrapper">
      <TrackCard
        v-for="(track, index) in topTracks"
        :key="index"
        :img-url="track.album.images[0].url"
        :artists="track.artists"
        :name="track.name"
      ></TrackCard>
    </div>
  </div>
</template>

<script setup>
import ArtistCard from "@/components/ArtistCard.vue";
import TrackCard from "@/components/TrackCard.vue";
import { ref } from "vue";

const topArtists = ref("");
const topTracks = ref("");

const accessToken = ref("");
if (sessionStorage.getItem("access_token")) {
  accessToken.value = sessionStorage.getItem("access_token");
  console.log("Access Token: " + accessToken.value);
  getTopArtist();
  getTopTracks();
}

// function to get top artist
async function getTopArtist() {
  const url = "https://api.spotify.com/v1/me/top/artists";
  fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken.value}` },
  })
    .then((response) => response.json())
    .then((data) => {
      topArtists.value = data.items;
    });
}

// function to get top track
async function getTopTracks() {
  const url = "https://api.spotify.com/v1/me/top/tracks";
  fetch(url, {
    headers: { Authorization: `Bearer ${accessToken.value}` },
  })
    .then((response) => response.json())
    .then((data) => {
      topTracks.value = data.items;
    });
}
</script>

<style scoped>
.wrapper {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
}
</style>

