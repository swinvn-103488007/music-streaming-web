<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  track: Object,
});

const emits = defineEmits(["playSong", "addTrackToDelete"]);
</script>

<template>
  <!-- Song row for track detail -->
  <div class="songRow">
    <img
      class="songRow__album"
      :src="props.track?.album?.images[0]?.url"
      @click="emits('playSong', props?.track?.uri)"
      alt=""
    />
    <div class="songRow__info" @click="emits('playSong', props?.track?.uri)">
      <h1>{{ props.track?.name }}</h1>
      <p>
        {{
          `${props.track?.artists.map((artist) => artist.name).join(", ")} - ${
            props.track?.album.name
          }`
        }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.songRow {
  margin: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  z-index: 100;
  color: #2e3271;
}

.songRow:hover {
  cursor: pointer;
  background-color: #e5e5e5;
}

.songRow__info {
  margin-left: 20px;
}

.songRow__info > h1 {
  font-size: 16px;
}

.songRow__info > p {
  font-size: 14px;
  margin-top: 3px;
  font-weight: 600;
  color: rgb(124, 141, 181, 0.72);
}

.songRow__album {
  height: 40px;
  width: 40px;
}

@media screen and (max-width: 576px) {
  .songRow {
    margin: 10px;
    padding: 10px;
  }

  .songRow__info > h1 {
    font-size: 12px;
  }

  .songRow__info > p {
    font-size: 10px;
    margin-top: 3px;
  }
}
</style>