<template>
  <f7-popup
      class="demo-popup-swipe-handler"
      swipe-to-close="to-bottom"
      swipe-handler=".swipe-handler"
      id="feedActions"
      @popup:closed="$emit('refreshFeeds')"
  >
    <f7-page>
      <template #fixed>
        <div class="swipe-handler"></div>
      </template>
      <f7-block-title>Add New Feed</f7-block-title>
      <f7-block>
        <f7-list form>
          <f7-list-input
              outline
              v-model:value="newFeed.name"
              type="text"
              placeholder="Feed Name"
          ></f7-list-input>
          <f7-list-input
              outline
              v-model:value="newFeed.url"
              type="url"
              placeholder="Feed URL"
          ></f7-list-input>
          <f7-button fill @click="addFeed(newFeed)">Add Feed</f7-button>
        </f7-list>
      </f7-block>
      <f7-list sortable sortable-opposite :sortable-enabled="true" @sortable:sort="updateFeedOrder" >
        <f7-list-item v-for="feed in feeds" :key="feed.id" :title="feed.name">
          <template #after>
            <f7-button @click="deleteFeed(feed.id)" icon-md="material:delete"
                       style="color:#000 !important;"></f7-button>
            <f7-toggle :checked="feed.enabled" @change="toggleFeed(feed.id)"></f7-toggle>
          </template>
        </f7-list-item>
      </f7-list>
    </f7-page>
  </f7-popup>
</template>

<script setup lang="ts">
import {useFeedStore} from "@/store/feeds";
import {ref} from "vue";

const feedsStore = useFeedStore()

const feeds = feedsStore.feeds
const newFeed = ref({name: '', url: '', enabled: true})

const toggleFeed = (id) => {
  const feed = feeds.find(feed => feed.id === id)
  if (feed) {
    feed.enabled ? feedsStore.disableFeed(id) : feedsStore.enableFeed(id)
  }
}

const addFeed = (feed) => {
  feed.id = feed.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  feedsStore.addFeed(feed)
  newFeed.value = {name: '', url: '', enabled: true}
}

const updateFeedOrder = (event) => {
  feedsStore.updateFeedOrder(event.from, event.to);

}

const deleteFeed = (id) => {
  feedsStore.deleteFeed(id)
}
</script>