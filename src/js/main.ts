
// Import Vue
import { createApp } from 'vue';

// Import Framework7 Bundle
// @ts-ignore
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-Vue with helper to register all components
// @ts-ignore
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';

import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


// Import your main app component
import App from '../components/app.vue';

// Init plugin and register all components
Framework7.use(Framework7Vue);

// create Vue app
const app = createApp(App);

// register all Framework7 Vue components by passing Vue app instance there
registerComponents(app);

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia);

// mount the app
app.mount('#app');
