<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue';
import { getArticle } from '../utils/europresse-api';
import {
  kSheet,
  kToolbar,
  kLink,
  kBlock,
  kBlockTitle,
  kList,
  kListItem,
  kListInput,
  kPopover,
  kButton,
  kIcon,
} from 'konsta/vue';

const currentArticleStore = useCurrentArticleStore();
const authStore = useAuthStore();

defineProps<{
  opened: boolean
}>();

const emit = defineEmits(['close']);

const searchQuery = ref('');
const searchResults = ref([]);

const isLoading = computed(() => currentArticleStore.isLoading);

const searchRanges = [
  { value: 'today', label: "Aujourd'hui", icon: 'i-tabler-clock' },
  { value: 'lastWeek', label: 'Cette semaine', icon: 'i-tabler-calendar-week' },
  { value: 'lastMonth', label: 'Ce mois', icon: 'i-tabler-calendar-month' },
  { value: 'allTime', label: 'Tout', icon: 'i-tabler-infinity' },
];

const searchIn = [
  { value: 'title', label: 'Titre', icon: 'i-tabler-text-size' },
  { value: 'fullText', label: 'Texte intégral', icon: 'i-tabler-article' },
];

// Add computed properties for safe icon access
const currentSearchInIcon = computed(() =>
  searchIn.find(i => i.value === currentArticleStore.currentSearchIn)?.icon ?? 'i-tabler-text-size'
);

const currentDateRangeIcon = computed(() =>
  searchRanges.find(i => i.value === currentArticleStore.currentSearchDateRange)?.icon ?? 'i-tabler-clock'
);

const loadingList = ref(Array.from({ length: 3 }, (_, i) => ({
  id: `loading-${i}`,
  title: 'Loading...',
  description: 'Loading content...',
  source: 'Loading source'
})));

const skeletonItems = ref(Array(1).fill(null).map((_, i) => ({
  id: `skeleton-${i}`,
  title: '',
  description: '',
  source: '',
  date: ''
})));

let skeletonInterval: NodeJS.Timeout | null = null;

watch(() => isLoading.value, (newVal) => {
  if (newVal) {
    // Reset to 1 skeleton when loading starts
    skeletonItems.value = Array(1).fill(null).map((_, i) => ({
      id: `skeleton-${i}`,
      title: '',
      description: '',
      source: '',
      date: ''
    }));
    
    // Start incrementing skeletons
    skeletonInterval = setInterval(() => {
      if (skeletonItems.value.length < 3) {
        skeletonItems.value = Array(skeletonItems.value.length + 1).fill(null).map((_, i) => ({
          id: `skeleton-${i}`,
          title: '',
          description: '',
          source: '',
          date: ''
        }));
      }
    }, 3000);
  } else {
    // Clear interval when loading stops
    if (skeletonInterval) {
      clearInterval(skeletonInterval);
      skeletonInterval = null;
    }
  }
});

// Cleanup on component unmount
onUnmounted(() => {
  if (skeletonInterval) {
    clearInterval(skeletonInterval);
  }
});

const searchInPopoverOpened = ref(false);
const dateRangePopoverOpened = ref(false);
const searchInTargetRef = ref(null);
const dateRangeTargetRef = ref(null);

const openSearchInPopover = (targetRef) => {
  searchInTargetRef.value = targetRef;
  searchInPopoverOpened.value = true;
};

const openDateRangePopover = (targetRef) => {
  dateRangeTargetRef.value = targetRef;
  dateRangePopoverOpened.value = true;
};

watch(() => currentArticleStore.currentSearch, (newVal) => {
  searchQuery.value = newVal;
  if (newVal) {
    currentArticleStore.setLoading(true);
  }
}, { immediate: true });

async function performSearch() {
  if (!searchQuery.value) return;

  currentArticleStore.setLoading(true);
  try {
    currentArticleStore.setCurrentSearch(searchQuery.value);
    await currentArticleStore.searchEvent();
  } finally {
    currentArticleStore.setLoading(false);
  }
}

const articleViewerOpened = ref(false);

async function downloadArticle(id: string, title: string, source: string, date: string, description: string) {
  const html = await getArticle(authStore.apiUrl, authStore.cookies, id);
  currentArticleStore.setCurrentArticle({
    id,
    title,
    source,
    date,
    description,
    html
  });
}

async function handleArticleClick(article) {
  await downloadArticle(
    article.id,
    article.title,
    article.source,
    article.date,
    article.description
  );
  
  articleViewerOpened.value = true;
}

</script>

<template>
  <!-- Teleport popovers to body -->
  <div class="absolute z-[1000] left-0 top-0 w-full">
    <k-popover :opened="searchInPopoverOpened" :target="searchInTargetRef"
      @backdropclick="searchInPopoverOpened = false">
      <k-list nested>
        <k-list-item v-for="option in searchIn" :key="option.value" :title="option.label" link @click="() => {
          currentArticleStore.currentSearchIn = option.value;
          searchInPopoverOpened = false;
        }">
          <template #media>
            <Icon :name="option.icon" />
          </template>
        </k-list-item>
      </k-list>
    </k-popover>

    <k-popover :opened="dateRangePopoverOpened" :target="dateRangeTargetRef"
      @backdropclick="dateRangePopoverOpened = false">
      <k-list nested>
        <k-list-item v-for="range in searchRanges" :key="range.value" :title="range.label" link @click="() => {
          currentArticleStore.currentSearchDateRange = range.value;
          dateRangePopoverOpened = false;
        }">
          <template #media>
            <Icon :name="range.icon" />
          </template>
        </k-list-item>
      </k-list>
    </k-popover>
  </div>

  <k-sheet class="w-full max-h-[85vh] flex flex-col" :opened="opened" @backdropclick="emit('close')">
    <k-toolbar top>
      <div class="right">
        <k-link toolbar @click="emit('close')">Fermer</k-link>
      </div>
    </k-toolbar>

    <k-block class="flex flex-col items-center flex-1 overflow-hidden">
      <!-- Search input and filters -->
      <div class="w-full flex-shrink-0">
        <k-list strong class="mt-0 mb-4 rounded-xl w-full">
          <k-list-input class="mt-2" :value="searchQuery" @input="(e) => { searchQuery = e.target.value }"
            placeholder="Rechercher..." @clear="searchQuery = ''" outline>
            <template #media>
              <Icon name="i-tabler-search" />
            </template>
          </k-list-input>

          <k-list-item link class="search-in-trigger"
            :title="`Rechercher dans: ${searchIn.find(i => i.value === currentArticleStore.currentSearchIn)?.label || 'Titre'}`"
            @click="openSearchInPopover('.search-in-trigger')">
            <template #media>
              <Icon :name="currentSearchInIcon" />
            </template>
          </k-list-item>
          <k-list-item link class="date-range-trigger"
            :title="`Période: ${searchRanges.find(i => i.value === currentArticleStore.currentSearchDateRange)?.label || 'Cette semaine'}`"
            @click="openDateRangePopover('.date-range-trigger')">
            <template #media>
              <Icon :name="currentDateRangeIcon" />
            </template>
          </k-list-item>
        </k-list>

        <k-button class="w-full mb-4" @click="performSearch" :disabled="isLoading || !searchQuery">
          <div class="flex items-center justify-center gap-2">
            <Icon name="i-tabler-search" />
            <span>Rechercher</span>
          </div>
        </k-button>
      </div>

      <!-- Results section -->
      <div class="w-full overflow-y-auto flex-1">
        <k-block-title>Résultats</k-block-title>
        <k-list v-if="isLoading" strong inset>
          <k-list-item v-for="item in skeletonItems" :key="item.id" class="animate-pulse">
            <div class="mx-4 mb-4">
              <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div class="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          </k-list-item>
        </k-list>
        <k-list v-else-if="currentArticleStore.searchResults.length" strong inset>
          <k-list-item v-for="result in currentArticleStore.searchResults" :key="result.id" :title="result.title"
            :text="result.description" :header="`${result.source} · ${result.date}`" link
            @click="handleArticleClick(result)" />
        </k-list>
        <k-block v-else class="text-center">
          <p v-if="searchQuery">Aucun résultat</p>
          <p v-else>Commencez à taper pour rechercher</p>
        </k-block>
      </div>
    </k-block>
  </k-sheet>

  <ArticleViewer 
    :opened="articleViewerOpened"
    @close="articleViewerOpened = false"
  />
</template>

<style scoped>
.selected {
  background-color: var(--k-touch-ripple-color);
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.bg-gray-200 {
  background-color: var(--k-touch-ripple-color);
}

/* Add these new styles */
.k-sheet {
  display: flex;
  flex-direction: column;
}

.k-block {
  height: 100%;
}
</style>
