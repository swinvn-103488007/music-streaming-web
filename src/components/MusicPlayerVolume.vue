<script setup>
import {
  ref,
  defineEmits
} from "vue";

import VolumeMute from "vue-material-design-icons/VolumeMute.vue";
import VolumeHigh from "vue-material-design-icons/VolumeHigh.vue";


let isHover = ref(true);

const volume = ref(100);

const emits = defineEmits(["setVolume"]);
</script>

<template>
  <div
    class="d-flex align-items-center me-2"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <VolumeMute v-if="volume == 0" fillColor="#F36921" :size="20" />
    <VolumeHigh v-else fillColor="#F36921" :size="20" />
    
    <input
      v-model="volume"
      type="range"
      class="mt-2 rounded-pill my-2 w-100 z-1"
      :class="{ rangeDotHidden: true }"
      @click="emits('setVolume', volume)"
    />
  </div>
</template>

<style>
.rangeDotHidden[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
  background: red;
}
</style>