import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase/compat/app'
import VueTextareaAutosize from 'vue-textarea-autosize'
import 'firebase/compat/firestore'
import { VueMaskDirective } from 'v-mask'
Vue.directive('mask', VueMaskDirective);

Vue.use(VueTextareaAutosize);
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  VueTextareaAutosize,
  render: h => h(App)
}).$mount('#app')
