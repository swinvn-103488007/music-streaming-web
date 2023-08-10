<script setup>
import { defineProps, defineEmits } from "vue";
import PlusCircleOutline from "vue-material-design-icons/PlusCircleOutline.vue";

const props = defineProps({
  track: Object,
});

const emits = defineEmits(["addTrackToPlaylist"]);

function addTrackToPlaylist() {
  const trackUris = [props.track.uri];
  emits("addTrackToPlaylist", trackUris);
}
</script>

<template>
  <!-- Song row for search result -->
  <div class="songRow">
    <img
      class="songRow__album"
      :src="props.track?.album?.images[0]?.url"
      alt=""
    />
    <div class="songRow__info">
      <h1>{{ props.track?.name }}</h1>
      <p>
        {{
          `${props.track?.artists.map((artist) => artist.name).join(", ")} - ${
            props.track?.album.name
          }`
        }}
      </p>
    </div>
    <div class="add-icon">
      <PlusCircleOutline @click="addTrackToPlaylist"></PlusCircleOutline>
    </div>
  </div>
</template>

<style scoped>
.songRow {
  box-sizing: border-box;
  padding: 10px;
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
  padding: 10px;
}

.songRow__info > h1 {
  font-size: 16px;
}

.songRow__info > p {
  font-size: 14px;
  margin-top: 3px;
  color: rgb(124, 141, 181, 0.72);
  font-weight: 600;
}

.songRow__album {
  height: 40px;
  width: 40px;
}

.add-icon {
  margin-left: auto;
}
</style>