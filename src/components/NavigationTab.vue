<template>
    <div class="col-3">
        <div>
            <Home fillColor="#FF7E3A"/>
            <span class="text-info">  Home</span>
        </div>
    </div>
</template>

<script>
import Home from 'vue-material-design-icons/Home.vue'

export default {
  name: 'NavigationTab',
  components: {
    Home
  }
}
</script>
