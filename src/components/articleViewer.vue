<template>
  <f7-popup
      swipe-to-close="to-bottom"
      id="article"
  >
    <f7-page>
      <export-as/>
      <f7-navbar :title="currentArticle.currentArticle.source">
        <f7-nav-right>
          <f7-button :class="{ 'filled-icon': isBookmarked(currentArticle.currentArticle) }" @click="updateBookmark()" icon-md="material:favorite "
                     style="color: #000"></f7-button>
          <f7-button icon-md="material:download" style="color: #000" open-in="actions" actions-open="#exportAs"></f7-button>
          <f7-button icon-md="material:close" style="color: #000"
                     popup-close></f7-button>
        </f7-nav-right>
      </f7-navbar>
      <f7-block v-html="currentArticle.currentArticle.html" class="articleContent">
      </f7-block>
    </f7-page>
  </f7-popup>
</template>

<script setup lang="ts">
import {useBookmarksStore} from "../store/bookmarks";
import {useCurrentArticleStore} from "../store/currentArticle";
import ExportAs from "@/components/exportAs.vue";

const bookmarkStore = useBookmarksStore()
const currentArticle = useCurrentArticleStore()


const isBookmarked = (article: Array<any>) => {
  return bookmarkStore.bookmarks.includes(currentArticle.currentArticle);
}

async function updateBookmark() {
  if (isBookmarked(currentArticle.currentArticle)) {
    bookmarkStore.removeBookmark(currentArticle.currentArticle);
  } else {
    bookmarkStore.addBookmark(currentArticle.currentArticle);
  }
}
</script>

<style lang="scss">
.articleContent {
  p {
    font-family: "Bitter", serif;
    font-optical-sizing: auto;
    font-size: 17px;
    line-height: 1.5;
  }

  h1 {
    font-family: "Playfair Display", serif;
    font-weight: 700;
    font-style: normal;
  }

  a {
    word-break: break-all;
  }
}

.navbar {
  .button {
    padding: 10px;
  }
}
</style>