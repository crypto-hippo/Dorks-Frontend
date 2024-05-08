import Vue from 'vue'
import App from './App.vue'

import router from './router';
import store from './store';
import { BootstrapVue } from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import './assets/scss/main.scss';

library.add(faTwitter, faInstagram, faSpinner);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false
Vue.use(BootstrapVue);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
