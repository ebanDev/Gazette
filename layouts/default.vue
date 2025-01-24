<template>
  <k-page>
    <main :class="{ 'pb-32': showTabBar }">
      <slot />
      <pwa-notifications />
    </main>
    <tab-bar v-if="showTabBar" />
  </k-page>
</template>

<script setup>
import { kPage } from 'konsta/vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showTabBar = computed(() => route.name !== 'login');
</script>
