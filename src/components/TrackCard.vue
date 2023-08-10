

<template>
  <div class="track-card" @click="emits('playSong', props.track?.uri)">
    <div class="track-card-img-container">
      <img v-if="props.track?.album?.images[0]?.url" :src="props.track?.album?.images[0]?.url" class="track-card-img" alt="artist-img" />
      <img v-else :src="defaultImgUrl" class="track-card-img" alt="artist-img" />
    </div>
    <div>
      <h6 class="track-card-title">{{ props.track?.name }}</h6>
      <p
        class="track-card-text"
        v-for="(artist, index) in props.track?.artist"
        :key="index"
      >
        {{ index == 0 ? `${artist.name}` : `, ${artist.name}` }}
      </p>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  track: Object
});

const emits = defineEmits(["playSong"]);

// default img url for track that may not have album img
const defaultImgUrl = "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=612x612&w=0&h=lGpj2vWAI3WUT1JeJWm1PRoHT3V15_1pdcTn2szdwQ0=";
</script>
  
<style scoped>
.track-card {
  max-width: 13rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 8px 0px 8px;
  margin-bottom: 0.5rem;
}

.track-card-img-container {
  width: 100%; /* Set the width and height of the container */
  aspect-ratio: 1/1;
  border-radius: 50%; /* Create a perfect circle by setting border-radius to 50% */
  overflow: hidden; /* Hide any part of the image that exceeds the circular shape */
  margin-bottom: 0.5rem;
  transition: transform 200ms ease;
}

.track-card:hover {
  background-color: rgba(255, 255, 255, 0.6);
}

.track-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>