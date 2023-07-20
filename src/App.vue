<template>
  <div v-if="isAuthorized" class="d-flex vh-100">
    <NavigationTab></NavigationTab>
    <RouterView></RouterView>
    <MusicControlPanel></MusicControlPanel>
  </div>
  <div v-else>
    <LoginView @authorize-access="authorizeAccess"></LoginView>
  </div>
</template>

<script setup>
import NavigationTab from "@/components/NavigationTab.vue";
import MusicControlPanel from "@/components/MusicControlPanel.vue";
import { ref,} from "vue";
import { RouterView } from "vue-router";
import LoginView from "./views/LoginView.vue";
// import { onMounted } from 'vue'

const isAuthorized = ref(false);

const authorizeAccess = () => {
  isAuthorized.value = true
};
// const router = useRouter()

// onMounted(() => {
//   if (!authorized.value) {
//     console.log("Authorized is false")
//     router.push({name: "LoginView"})
//   }
// })
</script>

<style scoped>
@media screen and (max-width: 992px) {
  div {
    flex-direction: column;
  }
}
</style>

<!-- <template>
  <div>
    <p>{{ message }}</p>
    <button @click="updateMessage">Update Message</button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const message = ref('Hello, Vue!');

    function updateMessage() {
      message.value = 'Updated Message!';
    }

    return {
      message,
      updateMessage,
    };
  },
};
</script> -->




