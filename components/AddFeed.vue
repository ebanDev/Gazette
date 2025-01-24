<script setup lang="ts">
import { ref } from 'vue';
import { kSheet, kToolbar, kLink, kBlock, kBlockTitle, kList, kListInput, kButton } from 'konsta/vue';

defineProps<{
  opened: boolean
}>();

const emit = defineEmits(['close']);
const feedStore = useFeedStore();

const newFeed = ref({
  name: '', 
  url: '',
  enabled: true
});

function addFeed() {
  if (!newFeed.value.name || !newFeed.value.url) return;
  
  const feed = {
    ...newFeed.value,
    id: newFeed.value.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  };
  
  feedStore.addFeed(feed);
  newFeed.value = { name: '', url: '', enabled: true };
  emit('close');
}
</script>

<template>
  <k-sheet
    class="pb-safe w-full"
    :opened="opened"
    @backdropclick="emit('close')"
  >
    <k-toolbar top>
      <div class="left" />
      <div class="right">
        <k-link toolbar @click="emit('close')">Fermer</k-link>
      </div>
    </k-toolbar>

    <k-block>
      <k-block-title>Ajouter un flux</k-block-title>
      <k-list strong inset>
        <k-list-input
          label="Nom"
          type="text"
          :value="newFeed.name"
          @input="newFeed.name = $event.target.value"
          placeholder="Nom du flux"
          clear-button
        />
        <k-list-input
          label="URL"
          type="url"
          :value="newFeed.url"
          @input="newFeed.url = $event.target.value"
          placeholder="URL du flux RSS"
          clear-button
        />
      </k-list>
      <div class="p-4">
        <k-button @click="addFeed">Ajouter</k-button>
      </div>
    </k-block>
  </k-sheet>
</template>
