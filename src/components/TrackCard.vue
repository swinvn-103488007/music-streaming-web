<template>
  <div class="card">
    <img :src="imgUrl" class="card-img-top" alt="track-img" />
    <div class="card-body">
      <h5 class="card-title">{{ props.name }}</h5>
      <p class="card-text" v-for="(artist, index) in artists" :key="index">
        {{ index == 0 ? `${artist.name}` : `, ${artist.name}`}}
      </p>
      <a href="#" class="btn btn-primary">View Details</a>
    </div>
  </div>
</template>
  
  <script setup>
import { defineProps } from "vue";

const props = defineProps({
  imgUrl: String,
  name: String,
  artists: Array,
});
</script>
  
  <style scoped>
.card {
  min-width: 13rem;
  border: 1px solid rgba(243, 105, 33, 0.15);
  display: flex;
  align-items: center;
}
.card-img-top {
  width: 80%;
  height: auto;
  vertical-align: middle;
  object-fit: cover;
}
</style>