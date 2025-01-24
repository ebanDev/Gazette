import { search } from "../utils/europresse-api"
import { useAuthStore } from "./auth"
import levenshtein from 'js-levenshtein'

export const useCurrentArticleStore = defineStore('currentArticle', () => {
  const currentArticle = ref({
    id: "1",
    title: "Test article",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, consequat nunc. Nulla facilisi. Sed ut lectus et turpis tincidunt aliquam. Curabitur auctor, libero nec.",
    source: "Test source",
    date: new Date().toISOString(),
    html: "<p>Test bookmark content</p>"
  })

  const currentSearch = ref('')
  const currentSearchIn = ref('fullText')
  const currentSearchDateRange = ref('lastYear')
  const searchResults = ref([])
  const isLoading = ref(false)

  function setLoading(state: boolean) {
    isLoading.value = state
  }

  function setCurrentArticle(article: {
    date: string
    description: string
    html: string
    id: string
    source: string
    title: string
  }) {
    currentArticle.value = article
  }

  function setCurrentSearch(query: string) {
    currentSearch.value = query
  }

  async function searchEvent() {
    setLoading(true)
    searchResults.value = []
    const authStore = useAuthStore()
    await authStore.validateCookies()

    if (currentSearch.value === null) {
      searchResults.value = []
    } else {
      const results = await search(
        authStore.apiUrl,
        authStore.cookies,
        currentSearch.value,
        currentSearchIn.value,
        currentSearchDateRange.value
      )
      searchResults.value = results.filter(article => article.title)

      if (currentSearchIn.value === "title") {
        searchResults.value.sort((a, b) => {
          return levenshtein(currentSearch.value, a.title) - levenshtein(currentSearch.value, b.title)
        })
      }
    }
    setLoading(false)
  }

  return {
    currentArticle,
    currentSearch,
    currentSearchIn,
    currentSearchDateRange,
    searchResults,
    isLoading,
    setLoading,
    setCurrentArticle,
    setCurrentSearch,
    searchEvent
  }
})
