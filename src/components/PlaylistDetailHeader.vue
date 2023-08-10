<template>
  <div class="header">
    <div class="header__left">
      <Magnify />
      <input placeholder="Search in your playlist" type="text" />
    </div>
  </div>
</template>

<script setup>
import Magnify from "vue-material-design-icons/Magnify.vue";
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.header__left {
  flex: 1;
  display: flex;
  padding: 10px;
  border-radius: 30px;
  background-color: #e5e5e5;
  color: gray;
  align-items: center;
}

.header__left > input {
  border: none;
  width: 100%;
  background-color: #e5e5e5;
}

</style>