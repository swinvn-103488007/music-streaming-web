<script setup>
import ArtistCard from "@/components/ArtistCard.vue";
import SongRow from "@/components/SongRow.vue";
import SpotifyWebApi from "spotify-web-api-js";
import { ref, watch, defineEmits } from "vue";

const spotify = new SpotifyWebApi();
const topArtists = ref("");
const topTracks = ref("");
const trackTimeRange = ref("Last 4 weeks");
const artistTimeRange = ref("Last 4 weeks");
const emits = defineEmits(["playSong"]);
if (sessionStorage.getItem("access_token")) {
  getTopArtist(artistTimeRange.value);
  getTopTracks(trackTimeRange.value);
}

// function to get top artist
async function getTopArtist(timeRange) {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  timeRange = timeRange.toString().toLowerCase();
  let options;
  switch (timeRange) {
    case "last 4 weeks":
      options = { time_range: "short_term", limit: 50 };
      break;
    case "last 6 months":
      options = { time_range: "medium_term", limit: 50 };
      break;
    case "all time":
      options = { time_range: "long_term", limit: 50 };
      break;
  }
  spotify.getMyTopArtists(options).then((data) => {
    topArtists.value = data.items;
  });
}

// function to get top track
async function getTopTracks(timeRange) {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  timeRange = timeRange.toString().toLowerCase();
  let options;
  switch (timeRange) {
    case "last 4 weeks":
      options = { time_range: "short_term", limit: 50 };
      break;
    case "last 6 months":
      options = { time_range: "medium_term", limit: 50 };
      break;
    case "all time":
      options = { time_range: "long_term", limit: 50 };
      break;
  }
  spotify.getMyTopTracks(options).then((data) => {
    topTracks.value = data.items;
    console.log("top track data", topTracks.value);
  });
}

// play song when user click on the a track in their top list
async function playSong(trackUri) {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  if (sessionStorage.getItem("deviceId")) {
    console.log("track is playing", trackUri);
    const playOptions = {
      device_id: sessionStorage.getItem("deviceId"),
      uris: [trackUri],
    };
    emits("playSong", playOptions);
  }
}

watch(
  () => trackTimeRange.value,
  () => {
    getTopTracks(trackTimeRange.value);
  }
);

watch(
  () => artistTimeRange.value,
  () => {
    getTopArtist(artistTimeRange.value);
  }
);
</script>

<template>
  <div class="home-container">
    <div class="top-item-container">
      <div class="top-item-header">
        <h4 class="top-item-title">Your top artist</h4>
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ artistTimeRange.toString() }}
          </button>
          <ul class="dropdown-menu time-range">
            <li class="time-range-options">
              <input
                type="radio"
                id="artist-short-term"
                class="dropdown-item"
                v-model="artistTimeRange"
                value="Last 4 weeks"
              />
              <label for="artist-short-term">Last 4 weeks</label>
            </li>
            <li class="time-range-options">
              <input
                type="radio"
                id="artist-medium-term"
                class="dropdown-item"
                v-model="artistTimeRange"
                value="Last 6 months"
              />
              <label for="artist-medium-term">Last 6 months</label>
            </li>
            <li class="time-range-options">
              <input
                type="radio"
                id="artist-long-term"
                class="dropdown-item"
                v-model="artistTimeRange"
                value="All time"
              />
              <label for="artist-long-term">All time</label>
            </li>
          </ul>
        </div>
      </div>
      <div class="horizontal-scroll snaps-inline">
        <ArtistCard
          v-for="(artist, index) in topArtists"
          :key="index"
          :img-url="artist.images[0].url"
          :name="artist.name"
        ></ArtistCard>
      </div>
    </div>

    <div class="top-item-container top-track-container">
      <div class="top-item-header">
        <h4 class="top-item-title">Your top tracks</h4>
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ trackTimeRange.toString() }}
          </button>
          <ul class="dropdown-menu time-range">
            <li class="time-range-options">
              <input
                type="radio"
                id="track-short-term"
                class="dropdown-item"
                v-model="trackTimeRange"
                value="Last 4 weeks"
              />
              <label for="track-short-term">Last 4 weeks</label>
            </li>
            <li class="time-range-options">
              <input
                type="radio"
                id="track-medium-term"
                class="dropdown-item"
                v-model="trackTimeRange"
                value="Last 6 months"
              />
              <label for="track-medium-term">Last 6 months</label>
            </li>
            <li class="time-range-options">
              <input
                type="radio"
                id="track-long-term"
                class="dropdown-item"
                v-model="trackTimeRange"
                value="All time"
              />
              <label for="track-long-term">All time</label>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <SongRow
          v-for="(track, index) in topTracks"
          :key="index"
          :track="track"
          @play-song="playSong"
        ></SongRow>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  margin-bottom: 110px;
  flex: 0.8;
  padding: 0.5rem;
  overflow: hidden;
}

.horizontal-scroll {
  display: grid;
  gap: 1rem;
  grid-auto-flow: column;
  grid-auto-columns: 21%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}

.horizontal-scroll::-webkit-scrollbar {
  height: 8px;
}

.horizontal-scroll::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 6px;
}

.horizontal-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.snaps-inline {
  scroll-snap-type: inline mandatory;
  scroll-padding-inline: 1rem;
}

.snaps-inline > * {
  scroll-snap-align: start;
}

input[type="radio"] {
  visibility: hidden;
}

.time-range {
  min-width: 7rem;
}

.time-range-options:hover {
  cursor: pointer;
  background-color: rgb(124, 141, 181, 0.72);
}

.top-item-container {
  padding: 1rem;
  background-color: white;
  border-radius: 40px;
  margin: 1rem;
}

.top-track-container:last-child {
  margin-bottom: 150px;
}

.top-item-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 16px 0px;
}

@media screen and (max-width: 992px) {
  .home-container {
    flex-grow: 1;
  }
}

@media screen and (max-width: 576px) {
  .top-item-title {
    font-size: 0.83rem;
  }

  .dropdown-toggle {
    font-size: 0.83rem;
  }

  .dropdown-menu {
    font-size: 0.67rem;
  }
  .top-item-header {
    padding: 8px 8px 8px 0px;
  }
  .time-range {
    min-width: 4rem;
  }
}
</style>

