
<script setup>
import NavigationTab from "@/components/NavigationTab.vue";
import MusicControlPanel from "@/components/MusicControlPanel.vue";
import { ref, onMounted, watch } from "vue";
import { RouterView } from "vue-router";
import LoginView from "./views/LoginView.vue";
import SpotifyWebApi from "spotify-web-api-js";

const isAuthorized = ref(false);

const spotify = new SpotifyWebApi();

// Store the data about current playback (what track is being played, device id of the playing device , etc.)
const playbackState = ref();

// Represent the current progress (unit: second) of the track
let currentProgress = ref(0);

// Interval to control the time of playing track
const intervalId = ref("");

function authorizeAccess() {
  isAuthorized.value = true;
}

async function play(playOptions) {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  await spotify.play(playOptions);
  updatePlaybackState();
}

async function updatePlaybackState() {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  setTimeout(() => {
    spotify.getMyCurrentPlaybackState().then((data) => {
      console.log("Playback State: ", data);
      playbackState.value = data;
      currentProgress.value = 0;
    });
  }, 1000);
}

function setVolume(volume) {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  spotify.setVolume(volume);
}

function nextTrack() {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  spotify.skipToNext();
  updatePlaybackState();
}

function prevTrack() {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  spotify.skipToPrevious();
  updatePlaybackState();
}

function togglePlay() {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  if (playbackState.value.is_playing) {
    playbackState.value.is_playing = false;
    spotify.pause();
  } else {
    playbackState.value.is_playing = true;
    spotify.play();
  }
}

// auto increment time when the player is being played
function updateCurrentProgress() {
  if (playbackState.value?.is_playing) {
    currentProgress.value++;
  }
}

// watch to update for default auto play
watch(
  () => currentProgress.value,
  () => {
    if (
      currentProgress.value >=
      (playbackState.value.item.duration_ms - 1) / 1000
    ) {
      console.log("New song is being played");
      updatePlaybackState();
    }
  }
);

function seekNewTrackTime(time) {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  spotify.seek(time);
  clearInterval(intervalId.value);
  currentProgress.value = time / 1000;
  intervalId.value = setInterval(updateCurrentProgress, 1000);
}

onMounted(() => {
  intervalId.value = setInterval(updateCurrentProgress, 1000);
});
</script>

<template>
  <div v-if="isAuthorized" class="player">
    <div class="player-body">
      <NavigationTab></NavigationTab>
      <RouterView @play-song="play"></RouterView>
    </div>
    <MusicControlPanel
      :playback-state="playbackState"
      :current-progress="currentProgress"
      @next-track="nextTrack"
      @prev-track="prevTrack"
      @toggle-play="togglePlay"
      @seek-new-track-time="seekNewTrackTime"
      @set-volume="setVolume"
    ></MusicControlPanel>
  </div>
  <div v-else>
    <LoginView @authorize-access="authorizeAccess"></LoginView>
  </div>
</template>

<style scoped>

.player {
  display: flex;
  flex-direction: column;
}

.player-body {
  display: flex;
  flex-grow: 1;
}
</style>




