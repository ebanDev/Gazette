<script setup lang="ts">
import { ref } from 'vue';
import { kSheet, kToolbar, kLink, kBlock, kBlockTitle, kList, kListItem, kToggle, kButton } from 'konsta/vue';
import draggable from 'vuedraggable';
import { useFeedStore } from '../stores/feed';
import { storeToRefs } from 'pinia';

defineProps<{
  opened: boolean
}>();

const emit = defineEmits(['close']);
const feedStore = useFeedStore();
const { feeds } = storeToRefs(feedStore);
const { disableFeed, enableFeed, updateFeedOrder, deleteFeed } = feedStore;
const addFeedOpened = ref(false);

function toggleFeed(id: string) {
  const feed = feeds.value.find(f => f.id === id);
  if (feed?.enabled) {
    disableFeed(id);
  } else {
    enableFeed(id);
  }
}

function setNewFeedOrder(e: any) {
  if (typeof e.oldIndex !== 'undefined' && typeof e.newIndex !== 'undefined') {
    updateFeedOrder(e.oldIndex, e.newIndex);
  }
}

function confirmDeleteFeed(id: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce flux ?')) {
    deleteFeed(id);
  }
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
        <k-link toolbar @click="addFeedOpened = true">Ajouter</k-link>
        <k-link toolbar @click="emit('close')">Fermer</k-link>
      </div>
    </k-toolbar>

    <k-block>
      <k-block-title>Gérer les flux</k-block-title>
      <k-list strong inset>
        <draggable 
          :list="feeds"
          :item-key="'id'"
          handle=".handle"
          @change="setNewFeedOrder"
        >
          <template #item="{ element: feed }">
            <k-list-item
              :title="feed.name"
              :key="feed.id"
            >
              <template #media>
                <div class="handle">
                  <Icon name="i-tabler-grip-vertical" />
                </div>
              </template>
              <template #after>
                <div class="flex items-center gap-3">
                    <Icon name="i-tabler-trash" @click="confirmDeleteFeed(feed.id)" class="text-xl" />
                  <k-toggle 
                    :checked="feed.enabled"
                    @change="toggleFeed(feed.id)"
                  />
                </div>
              </template>
            </k-list-item>
          </template>
        </draggable>
        <k-button @click="addFeedOpened = true" class="mt-4">
          <Icon name="i-tabler-plus" class="mr-2" />
          Ajouter un flux
        </k-button>
      </k-list>
    </k-block>

    <AddFeed
      :opened="addFeedOpened"
      @close="addFeedOpened = false"
    />
  </k-sheet>
</template>
