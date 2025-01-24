<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { storeToRefs } from 'pinia';
import { 
  kPage,
  kList,
  kListItem,
  kBlock,
  kBlockTitle,
} from 'konsta/vue';

const feedStore = useFeedStore();
const { feeds } = storeToRefs(feedStore);
const currentArticleStore = useCurrentArticleStore();
const feedItems = ref({});
const searchOpened = ref(false);
const feedActionsOpened = ref(false);

const navigateToSearch = async (title: string) => {
  searchOpened.value = true;
  currentArticleStore.currentSearchIn = "title";
  currentArticleStore.currentSearchDateRange = "lastWeek";
  currentArticleStore.setCurrentSearch(title);
  // Adding artificial delay to ensure modal is open before search starts
  await nextTick();
  await currentArticleStore.searchEvent();
};

async function loadFeeds() {
  const enabledFeeds = feeds.value.filter(feed => feed.enabled);
  feedItems.value = {};

  for (const feed of enabledFeeds) {
    const response = await fetch(`/api/fetch-rss?url=${encodeURIComponent(feed.url)}`);
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    let items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
      title: item.querySelector('title')?.textContent,
      link: item.querySelector('link')?.textContent,
      description: item.querySelector('description')?.textContent,
      source: feed.name,
      pubDate: new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date(item.querySelector('pubDate')?.textContent || Date.now())),
    }));

    items = items.slice(0, 5);
    feedItems.value[feed.name] = items;
  }
}

onMounted(loadFeeds);

watch(() => feeds.value, async () => {
  await loadFeeds();
}, { deep: true });
</script>

<template>
  <k-page>
    <TopBar 
      title="Accueil"
      @open-search="searchOpened = true"
      @open-settings="feedActionsOpened = true"
    />
    <div class="overflow-auto h-full">
      <k-list>
        <template v-for="(feed, index) in feedItems" :key="index">
          <k-block-title class="mb-0">{{ index }}</k-block-title>
          <k-list-item
            v-for="item in feed"
            :key="item.title"
            :title="item.title"
            :header="item.pubDate"
            :text="item.description"
            @click="navigateToSearch(item.title)"
            class="cursor-pointer"
          />
        </template>
      </k-list>

      <FeedActions 
        :opened="feedActionsOpened" 
        @close="feedActionsOpened = false" 
      />
      <Search 
        :opened="searchOpened" 
        @close="searchOpened = false" 
      />
    </div>
  </k-page>
</template>

<style scoped>
.k-list-item img {
  border-radius: 8px;
  width: 80px;
  height: 80px;
  object-fit: cover;
  object-position: center;
}
</style>
