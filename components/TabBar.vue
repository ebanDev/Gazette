<script setup lang="ts">
import { kTabbar, kTabbarLink } from 'konsta/vue';
const currentRoute = useRoute();

const tabs = [
  {
    path: '/',
    icon: 'i-tabler-home',
    label: 'Accueil'
  },
  {
    path: '/bookmarks',
    icon: 'i-tabler-bookmarks',
    label: 'Sauvegardés'
  },
  {
    path: '/user',
    icon: 'i-tabler-user',
    label: 'Profil'
  }
];
</script>

<template>
  <k-tabbar :labels="true" :icons="true" class="left-0 bottom-0 fixed">
    <k-tabbar-link
      v-for="tab in tabs"
      :key="tab.path"
      :active="currentRoute.path === tab.path"
      @click="navigateTo(tab.path)"
    >
      <template #icon>
        <Icon :name="tab.icon" class="text-2xl" />
      </template>
      <template #label>{{ tab.label }}</template>
    </k-tabbar-link>
  </k-tabbar>
</template>
