<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useBookmarksStore} from "../store/bookmarks";
import {useCurrentArticleStore} from "../store/currentArticle";
import ArticleViewer from "../components/articleViewer.vue";
import {f7} from "framework7-vue";

const bookmarksStore = useBookmarksStore();
const currentArticle = useCurrentArticleStore();

const bookmarks = ref([]);

function openArticle(article: any) {
  currentArticle.setCurrentArticle(article);
  f7.popup.open('#article', true)
}

onMounted(() => {
  bookmarks.value = bookmarksStore.bookmarks.reverse();
});
</script>

<template>
  <f7-page id="bookmarks">
    <article-viewer />
    <f7-navbar title="Bookmarks">
    </f7-navbar>
    <f7-list>
      <f7-list-item v-for="article in bookmarks" no-chevron @click="openArticle(article)" media-item :key="article.id" :title="article.title" :subtitle="article.source + ' · ' + article.date" :text="article.description">
        <template #after>
          <f7-button style="color:#000" icon-md="material:favorite" class="filled-icon" prevent-active-state-propagation @click.stop="bookmarksStore.removeBookmark(article)" />
        </template>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<style>
</style>