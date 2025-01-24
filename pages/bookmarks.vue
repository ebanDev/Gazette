<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { 
  kPage,
  kNavbar,
  kList,
  kListItem,
  kButton,
  kDialog,
} from 'konsta/vue';

const bookmarksStore = useBookmarksStore();
const currentArticle = useCurrentArticleStore();
const bookmarks = ref([]);
const articleViewerOpened = ref(false);
const dialogOpened = ref(false);
const articleToRemove = ref(null);

function openArticle(article: any) {
  currentArticle.setCurrentArticle(article);
  articleViewerOpened.value = true;
}

function confirmRemoveBookmark(article) {
  articleToRemove.value = article;
  dialogOpened.value = true;
}

function handleRemoveBookmark() {
  if (articleToRemove.value) {
    bookmarksStore.removeBookmark(articleToRemove.value);
    bookmarks.value = [...bookmarksStore.bookmarks].reverse();
  }
  dialogOpened.value = false;
  articleToRemove.value = null;
}

onMounted(() => {
  bookmarks.value = [...bookmarksStore.bookmarks].reverse();
});
</script>

<template>
  <k-page>
    <k-navbar title="Sauvegardés" />
    
    <div class="overflow-auto h-full">
      <k-list>
        <k-list-item
          v-for="article in bookmarks"
          :key="article.id"
          :title="article.title"
          :subtitle="`${article.source} · ${article.date}`"
          :text="article.description"
          @click="openArticle(article)"
          class="cursor-pointer"
        >
          <template #after>
            <k-button
              class="!w-10 h-10 !p-0 ml-2"
              @click.stop="confirmRemoveBookmark(article)"
            >
              <Icon name="tabler:bookmark-filled" class="text-xl" />
            </k-button>
          </template>
        </k-list-item>
      </k-list>
    </div>

    <ArticleViewer 
      v-if="articleViewerOpened"
      :opened="articleViewerOpened"
      @close="articleViewerOpened = false"
    />

    <k-dialog
      :opened="dialogOpened"
      title="Confirmation"
      @dialogClose="dialogOpened = false"
    >
      <p>Voulez-vous supprimer cet article de vos favoris ?</p>
      <template #buttons>
        <k-button clear @click="dialogOpened = false">Annuler</k-button>
        <k-button clear @click="handleRemoveBookmark">Confirmer</k-button>
      </template>
    </k-dialog>
  </k-page>
</template>
