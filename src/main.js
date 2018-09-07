// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import FlatSurfaceShader from 'vue-flat-surface-shader'
import Vuetify from 'vuetify/es5/components/Vuetify';
import VApp from 'vuetify/es5/components/VApp';
import VBtn from 'vuetify/es5/components/VBtn';
import VGrid from 'vuetify/es5/components/VGrid';
import VLabel from 'vuetify/es5/components/VLabel';
import VTextField from 'vuetify/es5/components/VTextField';
import VRating from 'vuetify/es5/components/VRating';
import VRadioGroup from 'vuetify/es5/components/VRadioGroup'

Vue.use(Vuetify, {
  components: {
    VApp,
    VBtn,
    VGrid,
    VLabel,
    VTextField,
    VRating,
    VRadioGroup
  }
});

Vue.use(FlatSurfaceShader);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
});
