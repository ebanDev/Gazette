import {defineStore} from 'pinia';
import {ref} from "vue";
import piniaPluginPersistedstate, {createPersistedState} from "pinia-plugin-persistedstate";

export const useBookmarksStore = defineStore('bookmarks', () => {
        const bookmarks = ref([]);

        function addBookmark(bookmark: any) {
            bookmarks.value.push(bookmark);
        }

        function removeBookmark(bookmark: any) {
            const index = bookmarks.value.indexOf(bookmark);
            if (index > -1) {
                bookmarks.value.splice(index, 1);
            }
        }

        return {bookmarks, addBookmark, removeBookmark}
    }, {
        persist: true,
    },
);