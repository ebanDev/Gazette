<template>
  <f7-login-screen v-model:opened="loginScreenOpened" id="login">
    <f7-page login-screen>
      <f7-login-screen-title>Welcome to Gazette, please login</f7-login-screen-title>
      <f7-list form>
        <f7-list-input
            label="Username"
            type="text"
            placeholder="Your username"
            :value="username"
            @input="username = $event.target.value"
        ></f7-list-input>
        <f7-list-input
            label="Password"
            type="password"
            placeholder="Your password"
            :value="password"
            @input="password = $event.target.value"
        ></f7-list-input>
        <f7-list-input
            label="Provider"
            type="select"
            placeholder="Please choose..."
            :value="provider"
            @input="provider = $event.target.value"
        >
          <option value="ent">ENT Cookies</option>
        </f7-list-input>
        <f7-list-input
            label="Ent"
            type="select"
            placeholder="Please choose..."
            :value="ent"
            @input="ent = $event.target.value"
        >
          <option value="toutatice">Toutatice</option>
        </f7-list-input>
      </f7-list>
      <f7-list inset>
        <f7-list-button fill @click="signIn">Sign In</f7-list-button>
      </f7-list>
    </f7-page>
  </f7-login-screen>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useAuthStore} from '../store/auth';
import {login} from '../utils/europresse-api';
import {f7} from "framework7-vue";

const loginScreenOpened = ref(false);
const username = ref('');
const password = ref('');
const provider = ref('ent');
const ent = ref('toutatice');
const authStore = useAuthStore();

if (!authStore.loggedIn) {
  loginScreenOpened.value = true;
} else {
  authStore.validateCookies();
}

const signIn = async () => {
  const dialog = f7.dialog.progress('Logging in...');

  const cookies = await login(authStore.apiUrl, username.value, password.value, provider.value, ent.value);
  authStore.setAuthDetails(username.value, password.value, provider.value, ent.value, cookies)
  loginScreenOpened.value = false;

  dialog.close();
}
</script>