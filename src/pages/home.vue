<template>
  <f7-page ptr :ptr-mousewheel="true" @ptr:refresh="fetchFeeds">
    <f7-navbar title="Feeds">
      <f7-nav-right>
        <f7-button popup-open="#feedActions" open-in="popup" icon-md="material:settings" style="color:#000;" ></f7-button>
        <f7-button popup-open="#search" open-in="popup" icon-md="material:search" style="color:#000;" ></f7-button>
      </f7-nav-right>
    </f7-navbar>
    <feed-actions @refreshFeeds="fetchFeeds" />
    <search />
    <f7-list media-list>
      <div v-for = "(feed, index) in feedItems" :key="index">
        <f7-block-title>{{index}}</f7-block-title>
        <f7-list-item v-for="item in feed" :key="item.title" link :title="item.title" :header="item.pubDate" :text="item.description  " @click="navigateToSearch(item.title)" >
        </f7-list-item>
      </div>
    </f7-list>
  </f7-page>
</template>

<style>
.item-media img {
  border-radius: 8px;
  width: 80px;
  height: 80px;
  object-fit: cover;
  object-position: center;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Login from "../components/login.vue";
import feedActions from "../components/feedActions.vue";
import { useFeedStore } from "../store/feeds";
import { useCurrentArticleStore } from "../store/currentArticle";
import {f7} from "framework7-vue";
import Search from "../components/search.vue";
import {SendIntent} from "send-intent";


const feedStore = useFeedStore();
const enabledFeeds = feedStore.feeds.filter(feed => feed.enabled);
const feedItems = ref({});
const currentArticleStore = useCurrentArticleStore();

const navigateToSearch = (title: string) => {
  currentArticleStore.currentSearchIn = "title";
  currentArticleStore.currentSearchDateRange = "lastWeek";
  currentArticleStore.setCurrentSearch(title);
  f7.popup.open("#search");
  currentArticleStore.searchEvent();
}

SendIntent.checkSendIntentReceived().then(async (result: any) => {
  if (result) {
    const metadata = await fetch("https://api.dub.co/metatags?url=" + result.url);
    const data = await metadata.json();
    const title = data.title;
    currentArticleStore.currentSearchIn = "title";
    currentArticleStore.currentSearchDateRange = "allTime";
    currentArticleStore.setCurrentSearch(title);
    f7.popup.open("#search");
    await currentArticleStore.searchEvent();
  }
}).catch(err => console.log(err));

function shuffleArray(array: Array<any>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function fetchFeeds(done: any = null) {
  const enabledFeeds = feedStore.feeds.filter(feed => feed.enabled);
  feedItems.value = {};
  for (const feed of enabledFeeds) {
    const response = await fetch("https://corsproxy.io/?" + encodeURIComponent(feed.url));
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    let items = Array.from(xmlDoc.querySelectorAll('item')).map(item => {
      const pubDate = ref(new Date());
      if (item.querySelector('pubDate') !== null) {
        pubDate.value = new Date(item.querySelector('pubDate').textContent);
      }
      const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(pubDate.value);
      return {
        title: item.querySelector('title').textContent,
        link: item.querySelector('link').textContent,
        description: item.querySelector('description').textContent,
        source: feed.name,
        pubDate: formattedDate,
      };
    });

    items = items.slice(0, 5);

    if (!feedItems.value[feed.name]) {
      feedItems.value[feed.name] = [];
    }
    feedItems.value[feed.name].push(...items);
  }
  if (done) {
    done();
  }
}
onMounted(() => {
  fetchFeeds();
});
</script>