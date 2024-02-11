import {defineStore} from 'pinia';
import {ref} from "vue";
import piniaPluginPersistedstate, {createPersistedState} from "pinia-plugin-persistedstate";

export const useFeedStore = defineStore('feeds', () => {
        const feeds = ref([{
            "id": "liberation",
            "name": "Libération",
            "url": "https://www.liberation.fr/arc/outboundfeeds/rss-all/collection/accueil-une/?outputType=xml",
            "enabled": true
        }, {
            "name": "Le Monde - International",
            "url": "https://www.lemonde.fr/international/rss_full.xml",
            "enabled": true,
            "id": "lemondeinternational"
        }, {
            "name": "Le Monde - France",
            "url": "https://www.lemonde.fr/politique/rss_full.xml",
            "enabled": true,
            "id": "lemondefrance"
        }, {
            "name": "Le Monde - Économie",
            "url": "https://www.lemonde.fr/economie/rss_full.xml",
            "enabled": true,
            "id": "lemondeconomie"
        }, {
            "name": "Le Monde - Culture",
            "url": "https://www.lemonde.fr/culture/rss_full.xml",
            "enabled": true,
            "id": "lemondeculture"
        }, {
            "name": "Le Monde - Sport",
            "url": "https://www.lemonde.fr/sport/rss_full.xml",
            "enabled": true,
            "id": "lemondesport"
        }, {
            "name": "Le Monde - Planète",
            "url": "https://www.lemonde.fr/planete/rss_full.xml",
            "enabled": true,
            "id": "lemondeplante"
        }, {
            "name": "Le Monde - Sciences",
            "url": "https://www.lemonde.fr/sciences/rss_full.xml",
            "enabled": true,
            "id": "lemondesciences"
        }, {
            "name": "Le Monde Diplomatique",
            "url": "https://www.monde-diplomatique.fr/recents.xml",
            "enabled": true,
            "id": "lemondediplomatique"
        }, {
            "name": "Courrier international",
            "url": "https://www.courrierinternational.com/feed/all/rss.xml",
            "enabled": true,
            "id": "courrierinternational"
        }]);

        function enableFeed(id: string) {
            const feed = feeds.value.find(feed => feed.id === id);
            if (feed) {
                feed.enabled = true;
            }
        }

        function addFeed(feed: { id: string, name: string, url: string, enabled: boolean }) {
            feeds.value.push(feed);
        }

        function disableFeed(id: string) {
            const feed = feeds.value.find(feed => feed.id === id);
            if (feed) {
                feed.enabled = false;
            }
        }

        function updateFeedOrder(from, to) {
            const feedToMove = this.feeds.splice(from, 1)[0];
            this.feeds.splice(to, 0, feedToMove);
        }

        function deleteFeed(id: string) {
            const index = feeds.value.findIndex(feed => feed.id === id);
            if (index !== -1) {
                feeds.value.splice(index, 1);
            }
        }

        return {feeds, enableFeed, addFeed, disableFeed, deleteFeed, updateFeedOrder}
    },
    {
        persist: true
    });