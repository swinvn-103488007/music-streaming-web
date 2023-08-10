<template>
  <div class="artist-card">
    <div class="artist-card-img-container">
      <img :src="imgUrl" class="artist-card-img" alt="artist-img" />
    </div>
    <div>
      <h6 class="artist-card-title">{{ props.name }}</h6>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  imgUrl: String,
  name: String,
});
</script>

<style scoped>
.artist-card {
  max-width: 13rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 8px 0px 8px ;
  margin-bottom: 1rem;
}

.artist-card-img-container {
  width: 100%; /* Set the width and height of the container */
  aspect-ratio: 1 / 1;
  border-radius: 50%; /* Create a perfect circle by setting border-radius to 50% */
  overflow: hidden; /* Hide any part of the image that exceeds the circular shape */
  margin-bottom: 0.5rem;
  transition: transform 200ms ease;
}

.artist-card:hover {
  background-color: rgba(255, 255, 255, 0.6);
}

.artist-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media screen and (max-width: 576px) {
  .artist-card h6 {
    font-size: 0.83rem;
  }
}
</style>