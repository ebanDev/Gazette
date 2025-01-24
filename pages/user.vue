<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  kPage,
  kNavbar,
  kList,
  kListItem,
  kButton,
  kSheet,
  kBlock,
  kBlockTitle,
  kListInput,
} from 'konsta/vue';

const authStore = useAuthStore();
const router = useRouter();

const apiServerSheetOpened = ref(false);
const apiUrl = ref(authStore.apiUrl);

const username = computed(() => authStore.username);
const authProvider = computed(() => authStore.provider);
const ent = computed(() => authStore.ent);

function saveApiUrl() {
  authStore.setApiUrl(apiUrl.value);
  apiServerSheetOpened.value = false;
}

async function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <k-page>
    <k-navbar title="Profil" />

    <k-block>
      <k-block-title>Account</k-block-title>
      <k-list inset strong>
        <k-list-item title="Username" :after="username" />
        <k-list-item title="Password" after="・・・・・・・" />
        <k-list-item title="Auth Provider" :after="authProvider" />
        <k-list-item title="Ent" :after="ent" />
        <k-button 
          class="w-full mt-4"
          @click="handleLogout"
        >
          <Icon name="tabler:logout" class="mr-2" />
          Déconnexion
        </k-button>
      </k-list>
    </k-block>

    <k-block>
      <k-block-title>App configuration</k-block-title>
      <k-list inset strong>
        <k-list-item 
          title="API Server" 
          :after="apiUrl"
          @click="apiServerSheetOpened = true"
        />
      </k-list>
    </k-block>

    <k-sheet
      :opened="apiServerSheetOpened"
      @backdropclick="apiServerSheetOpened = false"
      class="w-full"
    >
      <k-block-title>API Server</k-block-title>
      <k-block>
        <k-list inset strong>
          <k-list-input
            type="text"
            label="API Server"
            :value="apiUrl"
            @input="(e) => apiUrl = e.target.value"
            placeholder="Enter API Server"
            clear-button
            outline
          />
          <k-button 
            @click="saveApiUrl"
            class="w-full mt-4"
          >
            Save
          </k-button>
        </k-list>
      </k-block>
    </k-sheet>
  </k-page>
</template>

<style scoped>
.k-list {
  --k-list-margin-vertical: 1rem;
}
</style>
