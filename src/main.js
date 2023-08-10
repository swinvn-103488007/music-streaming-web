import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/bootstrap/css/custom.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import mitt from 'mitt'

const emitter = mitt();
const app = createApp(App);
app.config.globalProperties.emitter = emitter;
app.use(router)
app.mount("#app");
// createApp(App).use(router).mount('#app')
