import {defineStore} from 'pinia';
import {ref} from "vue";
import piniaPluginPersistedstate, {createPersistedState} from "pinia-plugin-persistedstate";
import {login} from "../utils/europresse-api";

export const useAuthStore = defineStore('auth', () => {
        const username = ref('');
        const password = ref('');
        const provider = ref('');
        const ent = ref('');
        const cookies = ref({});
        const cookiesDate = ref('');
        const loggedIn = ref(false)
        const apiUrl = ref('https://europresse-api.eban.eu.org');

        function setAuthDetails(inputUsername: string, inputPassword: string, inputProvider: string, inputEnt: string, inputCookies: any) {
            username.value = inputUsername;
            password.value = inputPassword;
            provider.value = inputProvider;
            ent.value = inputEnt;
            cookies.value = inputCookies;
            cookiesDate.value = new Date().toISOString();
            loggedIn.value = true;
        }

        function logout() {
            username.value = '';
            password.value = '';
            provider.value = '';
            ent.value = '';
            cookies.value = {};
            cookiesDate.value = '';
            loggedIn.value = false;
        }

        async function validateCookies() {
            if (cookiesDate.value === '') {
                return true;
            }
            const cookiesDateObj = new Date(cookiesDate.value);
            const now = new Date();
            const diff = now.getTime() - cookiesDateObj.getTime();
            const diffHours = diff / (1000 * 60 * 60);

            if (diffHours < 0.5) {
                return true;
            } else {
                cookies.value = await login(apiUrl.value, username.value, password.value, provider.value, ent.value);
                cookiesDate.value = new Date().toISOString();
                return true;
            }
        }

        function setApiUrl(url: string) {
            apiUrl.value = url;
        }

        return {username, password, provider, ent, cookies, cookiesDate, apiUrl, setAuthDetails, validateCookies, loggedIn, setApiUrl}
    }, {
        persist: true,
    },
);