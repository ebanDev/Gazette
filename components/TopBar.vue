<script setup lang="ts">
import { kNavbar, kButton } from 'konsta/vue';

const route = useRoute();
const emit = defineEmits(['openSearch', 'openSettings']);
</script>

<template>
  <k-navbar class="sticky top-0 z-10">
    <template #title>
      <div class="flex items-center gap-2">
        <Icon name="i-tabler-left-fill" v-if="route.meta.showBackButton" @click="$router.back()"
          class="cursor-pointer" />
        {{ route.meta.title }}
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-2 mr-2">
        <k-button @click="emit('openSettings')" class="!w-10 h-10 !p-0">
          <Icon name="i-tabler-adjustments" class="text-xl" />
        </k-button>
        <k-button @click="emit('openSearch')" class="!w-10 h-10 !p-0">
          <Icon name="i-tabler-search" class="text-xl" />
        </k-button>
      </div>
    </template>
  </k-navbar>
</template>
