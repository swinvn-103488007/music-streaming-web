<script setup>
import { defineProps, defineEmits } from "vue";
import MinusCircleOutline from "vue-material-design-icons/MinusCircleOutline.vue";

const props = defineProps({
  playlistTrack: Object,
});

const emits = defineEmits(["playSong", "addTrackToDelete"]);

// function to add track to delelte intention (not delete immediately, just send essential data to the PlaylistDetailView to continue processing delete operation)
function addTrackToDelete() {
  const trackUris = [{ uri: `${props.playlistTrack?.track.uri}` }];
  emits("addTrackToDelete", props.playlistTrack?.track?.name, trackUris);
}
</script>

<template>
  <!-- Song row for playlist detail -->
  <div class="songRow">
    <img
      class="songRow__album"
      :src="props.playlistTrack?.track?.album?.images[0]?.url"
      @click="emits('playSong', props.playlistTrack?.track?.uri)"
      alt=""
    />
    <div
      class="songRow__info"
      @click="emits('playSong', props.playlistTrack?.track?.uri)"
    >
      <h1>{{ props.playlistTrack?.track?.name }}</h1>
      <p>
        {{
          `${props.playlistTrack?.track?.artists
            .map((artist) => artist.name)
            .join(", ")} - ${props.playlistTrack?.track?.album.name}`
        }}
      </p>
    </div>
    <div
      class="songRow-delete-song-btn"
      data-bs-toggle="modal"
      data-bs-target="#deleteTrackFromPlaylistModal"
      @click="addTrackToDelete"
    >
      <MinusCircleOutline></MinusCircleOutline>
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

.songRow-delete-song-btn {
  margin-left: auto;
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
  color: rgb(124, 141, 181, 0.72);
  font-weight: 600;
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