<script setup lang="ts">
import { computed } from 'vue';
import {
  kPopup,
  kNavbar,
  kPage,
  kBlock,
  kButton,
  kLink,
} from 'konsta/vue';

const props = defineProps<{
  opened: boolean
}>();

const emit = defineEmits(['close']);

const bookmarkStore = useBookmarksStore();
const currentArticle = useCurrentArticleStore();

const isBookmarked = computed(() => {
  return bookmarkStore.bookmarks.includes(currentArticle.currentArticle);
});

const exportActionsOpened = ref(false);

async function updateBookmark() {
  if (isBookmarked.value) {
    bookmarkStore.removeBookmark(currentArticle.currentArticle);
  } else {
    bookmarkStore.addBookmark(currentArticle.currentArticle);
  }
}
</script>

<template>
  <k-popup :opened="opened" @backdropclick="emit('close')">
    <k-page>
      <k-navbar :title="currentArticle.currentArticle.source">
        <template #right>
          <div class="flex items-center gap-2 mr-2">
            <k-button class="!w-10 h-10 !p-0" @click="updateBookmark">
              <Icon :name="isBookmarked ? 'tabler:bookmark-filled' : 'tabler:bookmark'" class="text-xl" />
            </k-button>
            <k-button class="!w-10 h-10 !p-0" @click="exportActionsOpened = true">
              <Icon name="tabler:download" class="text-xl" />
            </k-button>
            <k-button class="!w-10 h-10 !p-0" @click="emit('close')" clear>
              <Icon name="tabler:x" class="text-xl" />
            </k-button>
          </div>
        </template>
      </k-navbar>

      <k-block>
        <div v-html="currentArticle.currentArticle.html" class="articleContent" />
      </k-block>
    </k-page>

    <ExportAs :opened="exportActionsOpened" @close="exportActionsOpened = false" />
  </k-popup>
</template>

<style lang="scss">
.articleContent {
  p {
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 1em;
  }

  h1 {
    font-family: "Playfair Display", serif;
    font-weight: 700;
    font-style: normal;
    font-size: 2.5em;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }

  h2 {
    font-family: "Playfair Display", serif;
    font-weight: 700;
    font-style: normal;
    font-size: 2em;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }

  h3 {
    font-family: "Playfair Display", serif;
    font-weight: 700;
    font-style: normal;
    font-size: 1.5em;
    line-height: 1.2;
    margin-bottom: 0.5em;
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
