<template>
  <div class="container bg-app-bg">
    <div class="row">
      <NavigationTab></NavigationTab>
    </div>
  </div>
</template>

<script>
import  NavigationTab  from '@/components/NavigationTab.vue'

export default {
  name: 'App',
  components: {
    NavigationTab
  }
}
</script>


