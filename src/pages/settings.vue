<template>
  <f7-page id="settings">
    <f7-navbar title="Settings" />

    <f7-block>
      <f7-block-title>Account</f7-block-title>
      <f7-list inset strong>
        <f7-list-item title="Username" :after="username"></f7-list-item>
        <f7-list-item title="Password" :after="password"></f7-list-item>
        <f7-list-item title="Auth Provider" :after="authProvider"></f7-list-item>
        <f7-list-item title="Ent" :after="ent"></f7-list-item>
        <f7-list-button fill popup-open="#login" open-in="popup">Logout</f7-list-button>
      </f7-list>
    </f7-block>
    <f7-block>
      <f7-block-title>App configuration</f7-block-title>
      <f7-list inset strong>
        <f7-list-item title="API Server" :after="apiUrl" @click="openApiServerSheet"></f7-list-item>
      </f7-list>
    </f7-block>
  </f7-page>

  <f7-sheet id="apiServerSheet">
    <f7-toolbar>
      <f7-link sheet-close>Close</f7-link>
    </f7-toolbar>
    <f7-block>
      <f7-list no-hairlines-md >
        <f7-list-input
            :value="apiUrl"
            @input="apiUrl = $event.target.value"
            label="API Server"
            type="text"
            placeholder="Enter API Server"
            clear-button
            outline
        ></f7-list-input>
        <f7-button fill @click="authStore.setApiUrl(apiUrl)" >Save</f7-button>
      </f7-list>
    </f7-block>
  </f7-sheet>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from "@/store/auth";
import { App } from '@capacitor/app';
import {f7} from "framework7-vue";
const authStore = useAuthStore();

const username = authStore.username;
const password = "・・・・・・・";
const authProvider = authStore.provider;
const ent = authStore.ent;
const apiUrl = ref("https://example.com");

apiUrl.value = authStore.apiUrl;

function openApiServerSheet() {
  f7.sheet.open("#apiServerSheet");
}
</script>