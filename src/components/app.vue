<template>
  <f7-app v-bind="f7params" :page-content="false">
    <login/>
    <f7-views tabs class="safe-areas">
      <f7-toolbar icons labels bottom>
        <f7-link
            tab-link="#view-home"
            tab-link-active
            icon-md="material:home"
            text="Home"
        ></f7-link>
        <f7-link
            tab-link="#view-bookmarks"
            icon-md="material:favorite"
            text="Liked"
        ></f7-link>
        <f7-link
            tab-link="#view-settings"
            icon-md="material:settings"
            text="Settings"
        ></f7-link>
      </f7-toolbar>

      <f7-view id="view-home" main tab-active tab url="/home/"></f7-view>
      <f7-view id="view-bookmarks" name="bookmarks" tab url="/bookmarks/"></f7-view>
      <f7-view id="view-settings" name="settings" tab url="/settings/"></f7-view>
    </f7-views>
  </f7-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { f7, f7ready } from 'framework7-vue';
import { Framework7Parameters } from 'framework7/types';
import { getDevice } from 'framework7/lite-bundle';
import capacitorApp from '../utils/capacitor-app';
import Theme from '../utils/theme'
import routes from '../router/routes';
import Login from "@/components/login.vue";


const theme = Theme.extractThemeSearch();
console.log(theme)
const device = getDevice();
const f7params = {
  name: 'Gazette',
  theme,
  autoDarkTheme: false,
  id: 'org.eu.eban.gazette',
  routes: routes,

  // Input settings
  input: {
    scrollIntoViewOnFocus: device.capacitor,
    scrollIntoViewCentered: device.capacitor,
  },
  // Capacitor Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
};

onMounted(() => {
  f7ready(() => {
    Theme.init();
    // Init capacitor APIs (see capacitor-app.js)
    if (device.capacitor) {
      capacitorApp.init(f7);
    }

    f7.setColorTheme("#6750A4");
  });
});
</script>