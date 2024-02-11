<template>
  <article-viewer/>
  <f7-popup
      class="demo-popup-swipe-handler"
      swipe-to-close="to-bottom"
      swipe-handler=".swipe-handler"
      id="search"
  >
    <f7-page>
      <template #fixed>
        <div class="swipe-handler"></div>
      </template>
      <f7-block>
        <f7-searchbar :disable-button=false placeholder="Type here..."
                      v-model:value="currentArticleStore.currentSearch"></f7-searchbar>
        <f7-list id="paramsList">
          <f7-list-item title="Search In" smart-select :smart-select-params="{openIn: 'sheet'}" id="searchInSelect">
            <select v-model="currentArticleStore.currentSearchIn">
              <option value="fullText">Full Text</option>
              <option value="title">Title</option>
            </select>
          </f7-list-item>
          <f7-list-item title="Date Range" smart-select :smart-select-params="{openIn: 'sheet'}" id="dateRangeSelect">
            <select v-model="currentArticleStore.currentSearchDateRange">
              <option value="allTime">All Time</option>
              <option value="lastWeek">Last Week</option>
              <option value="lastMonth">Last Month</option>
              <option value="lastYear">Last Year</option>
            </select>
          </f7-list-item>
        </f7-list>
        <f7-button fill @click="currentArticleStore.searchEvent()"  >Search</f7-button>
        <f7-list v-if="currentArticleStore.isLoading" class="skeleton-text skeleton-effect-fade">
          <f7-list-item v-for="(item, index) in loadingList" :key="index" media-item link="#" title="Lorem ipsum dolor" subtitle="Libération · 02/02/2002" text="Lorem ipsum dolor sit amet imut dolores impu woril nauc loading eh a eiueq enwjew "/>
        </f7-list>
        <f7-list v-else>
          <f7-list-item v-for="article in currentArticleStore.searchResults"
                        @click="downloadArticle(article.id, article.title, article.source, article.date, article.description)"
                        media-item link="#" popup-open="#article" :key="article.id" :title="article.title"
                        :subtitle="article.source + ' · ' + article.date" :text="article.description"/>
          <div v-if="currentArticleStore.searchResults.length === 0">No article found.</div>
        </f7-list>
      </f7-block>
    </f7-page>

  </f7-popup>
</template>


<style>
.list .item-title {
  white-space: normal;
  overflow: hidden;
  word-break: break-word;
}

#paramsList {
  margin: 0;
  margin-bottom: 10px;
}
</style>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {search, getArticle} from "@/utils/europresse-api";
import {useAuthStore} from "@/store/auth";
import {useCurrentArticleStore} from "@/store/currentArticle";
import ArticleViewer from "../components/articleViewer.vue";
import {f7} from "framework7-vue";

const authStore = useAuthStore();
const currentArticleStore = useCurrentArticleStore();

async function downloadArticle(id: string, title: string, source: string, date: string, description: string) {
  currentArticleStore.setCurrentArticle({
    id: id,
    title: title,
    source: source,
    date: date,
    description: description,
    html: await getArticle(authStore.apiUrl, authStore.cookies, id)
  });
}

const loadingList = ref(Array.from({length: 1}, (_, i) => i));
const intervalId = ref(null);

watch(() => currentArticleStore.isLoading, (isLoading) => {
  if (isLoading) {
    intervalId.value = setInterval(() => {
      loadingList.value.push(loadingList.value.length);
    }, 2000);
  } else if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
  loadingList.value = Array.from({length: 1}, (_, i) => i);
}, { immediate: true });

watch(() => currentArticleStore.currentSearchIn, (newVal) => {
  f7.smartSelect.get("#searchInSelect > a").setValue(newVal)
});

watch(() => currentArticleStore.currentSearchDateRange, (newVal) => {
  f7.smartSelect.get("#dateRangeSelect > a").setValue(newVal)
});
</script>