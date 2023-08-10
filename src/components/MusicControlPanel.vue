<script setup>
import { ref, defineProps, defineEmits, computed, watch, } from "vue";
import MusicPlayerVolume from "../components/MusicPlayerVolume.vue";
import Heart from "vue-material-design-icons/Heart.vue";
import PictureInPictureBottomRight from "vue-material-design-icons/PictureInPictureBottomRight.vue";
import Play from "vue-material-design-icons/Play.vue";
import Pause from "vue-material-design-icons/Pause.vue";
import SkipBackward from "vue-material-design-icons/SkipBackward.vue";
import SkipForward from "vue-material-design-icons/SkipForward.vue";
import { convertDuration } from "@/utils/durationConverter";

let isPlaying = ref(false);

watch(
  () => props.playbackState,
  () => {
    isPlaying.value = true;
  }
);
let isHover = ref(true);

// Represent track progress in format mm:ss
let trackTimeCurrent = computed(() => {
  return convertDuration(props.currentProgress * 1000);
});
let trackTimeTotal = computed(() => {
  return convertDuration(props.playbackState?.item?.duration_ms);
});
let seeker = ref(null);

// range property for the range input to control the playback
let range = computed(() => {
  return Math.round(props.playbackState?.item?.duration_ms / 1000);
});

function emitSetvolume(volume) {
  emits("setVolume", volume);
}

const props = defineProps({
  playbackState: Object,
  currentProgress: Number,
});

const emits = defineEmits([
  "nextTrack",
  "prevTrack",
  "togglePlay",
  "seekNewTrackTime",
  "setVolume",
]);

// check seeker value at onMounted
// onMounted(() => {
//   console.log("seeker value", seeker.value);
// })
</script>

<template>
  <div
    id="MusicPlayer"
    v-if="props.playbackState"
    class="panel-container container-fluid position-fixed left-0 bottom-0"
  >
    <div class="row">
      <!-- Song img, artist and song name area-->
      <div
        class="d-flex align-items-center justify-content-center justify-content-lg-start col-lg-3 my-3"
      >
        <div class="d-flex align-items-center ms-3">
          <img
            class="rounded shadow-sm"
            width="55"
            :src="props.playbackState?.item?.album?.images[0]?.url"
          />
          <div class="ms-3">
            <div
              class="text-[14px] text-app-text hover:underline cursor-pointer"
            >
              <!-- currentTrack.name -->
              {{ props.playbackState?.item?.name }}
            </div>
            <div
              class="text-[11px] text-gray-500 hover:underline hover:text-white cursor-pointer"
            >
              <!-- Artist name -->
              {{
                `${props.playbackState?.item?.artists
                  ?.map((artist) => artist?.name)
                  .join(", ")}`
              }}
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center ms-3">
          <Heart fillColor="#F36921" :size="20" />
          <PictureInPictureBottomRight
            class="ms-3"
            fillColor="#F36921"
            :size="18"
          />
        </div>
      </div>

      <!-- Media control components area-->
      <div
        class="d-flex flex-column align-items-center justify-content-center col-lg-6 mb-3"
      >
        <div class="btn d-flex align-items-center justify-content-evenly w-100">
          <button class="mx-2">
            <SkipBackward
              fillColor="#F36921"
              :size="25"
              @click="emits('prevTrack')"
            />
          </button>
          <button class="p-1 rounded-circle mx-3 bg-app-tertiary">
            <Play
              v-if="!props.playbackState.is_playing"
              fillColor="#F36921"
              :size="25"
              @click="emits('togglePlay')"
            />
            <Pause
              v-else
              fillColor="#F36921"
              :size="25"
              @click="emits('togglePlay')"
            />
          </button>
          <button class="mx-2">
            <SkipForward
              fillColor="#F36921"
              :size="25"
              @click="emits('nextTrack')"
            />
          </button>
        </div>

        <div class="d-flex align-items-center justify-content-center w-100">
          <div
            v-if="trackTimeCurrent"
            class="text-app-text fs-6 pe-2 pt-[11px]"
          >
            {{ trackTimeCurrent }}
          </div>

          <input
            v-bind:value="props.currentProgress"
            ref="seeker"
            type="range"
            min="0"
            :max="range"
            @change="emits('seekNewTrackTime', seeker.value * 1000)"
            class="rounded-pill my-2 w-75 h-0 z-1"
            :class="{ rangeDotHidden: isHover }"
          />

          <div v-if="trackTimeTotal" class="text-app-text fs-6 ps-2">
            {{ trackTimeTotal }}
          </div>
        </div>
      </div>

      <!-- Volume control area-->
      <div
        class="d-flex align-items-center justify-content-lg-end justify-content-center pe-3 col-lg-3"
      >
        <MusicPlayerVolume @set-volume="emitSetvolume" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.rangeDotHidden[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
}

.panel-container {
  /* height: 10vh; */
  background-color: #ECF2FD;
}
</style>