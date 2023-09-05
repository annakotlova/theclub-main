import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueTheMask from 'vue-the-mask';
import VueLazyLoad from 'vue3-lazyload';

import App from './App.vue';
import router from './router';

import './utils/global/math';
import './utils/global/object';

const pinia = createPinia();
const app = createApp(App);

const createVueApp = async () => {
  app.use(VueLazyLoad, {}).use(VueTheMask.default).use(pinia).use(router).mount('#app');
};

createVueApp();
