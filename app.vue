<template>
  <NuxtPwaManifest />
  <k-app theme="material">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </k-app>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.075s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

<script setup>
import { kApp } from 'konsta/vue';
const authStore = useAuthStore();

// Redirect to login if not authenticated
onMounted(() => {
  if (!authStore.loggedIn) {
    navigateTo('/login');
  } else {
    authStore.validateCookies();
  }
});
</script>
