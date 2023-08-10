<template>
  <div class="playlist" @click="emit('getPlaylistDetails', props.playlist.id)">
    <p class="playlist-name">
      {{ props.playlist.name }}
    </p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  playlist: Object,
});
const emit = defineEmits(["getPlaylistDetails"]);

</script>

<style scoped>
.playlist {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 40px;
  color: rgba(124, 141, 181, 0.72);
  transition: 200ms color ease-in;
  font-size: 12px;
  font-weight: 500;
}

.playlist:hover {
  color: #f36921;
}

</style>