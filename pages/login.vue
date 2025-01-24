<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  kPage,
  kBlock,
  kList,
  kListInput,
  kListItem,
  kButton,
  kBlockTitle,
  kDialog,
  kDialogButton,
} from 'konsta/vue';
import { login } from '../utils/europresse-api';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const provider = ref('ent');
const ent = ref('toutatice');
const loading = ref(false);

const showAdvancedSettings = ref(false);
const apiUrl = ref(authStore.apiUrl);

const errorDialog = ref(false);
const errorMessage = ref('');

const signIn = async () => {
  try {
    loading.value = true;
    // Update API URL if changed
    if (apiUrl.value !== authStore.apiUrl) {
      authStore.setApiUrl(apiUrl.value);
    }
    const cookies = await login(
      authStore.apiUrl, 
      username.value, 
      password.value, 
      provider.value, 
      ent.value
    );
    
    authStore.setAuthDetails(
      username.value, 
      password.value, 
      provider.value, 
      ent.value, 
      cookies
    );
    
    router.push('/');
  } catch (error: any) {
    console.error('Login failed:', error);
    errorMessage.value = error.error || 'Erreur de connexion';
    errorDialog.value = true;
  } finally {
    loading.value = false;
  }
};

// Update icons mapping to use tabler
const icons = {
  username: 'tabler:user',
  password: 'tabler:lock',
  provider: 'tabler:school',
  ent: 'tabler:building'
};

// Update form fields with French labels
const basicFields = {
  username: { label: 'Identifiant', type: 'text', value: username },
  password: { label: 'Mot de passe', type: 'password', value: password },
  ent: { 
    label: 'Établissement', 
    type: 'select', 
    value: ent,
    dropdown: true,
    options: [
      { value: 'toutatice', label: 'Toutatice' },
      { value: 'scpobx', label: 'Sciences Po Bordeaux' }
    ]
  }
};

const advancedFields = {
  provider: { 
    label: 'Fournisseur', 
    type: 'select', 
    value: provider,
    dropdown: true,
    options: [
      { value: 'ent', label: 'ENT Cookies' }
    ]
  },
  apiServer: { label: 'Serveur API', type: 'text', value: apiUrl }
};
</script>

<template>
  <k-page>
    <div class="flex flex-col items-center justify-center min-h-screen p-4">
      <div class="w-full max-w-md space-y-8">
        <!-- Logo and Title -->
        <div class="text-center">
          <img 
            src="/icon.png" 
            alt="Logo Gazette" 
            class="w-24 h-24 mx-auto mb-4 rounded-2xl shadow-lg"
          />
          <h1 class="text-3xl font-bold tracking-tight">
            Bienvenue sur Gazette
          </h1>
          <p class="mt-2 text-gray-600">
            Accédez à votre compte Europresse via les identifiants de votre établissement
          </p>
        </div>

        <!-- Login Form -->
        <k-block>
          <k-list class="!bg-none px-0 mx-0">
            <!-- Basic Fields -->
            <k-list-input
              v-for="(field, key) in basicFields"
              :key="key"
              :label="field.label"
              :type="field.type"
              :placeholder="`Entrez votre ${field.label.toLowerCase()}`"
              :value="field.value.value"
              :dropdown="field.dropdown"
              outline
              floating-label
              @input="(e) => field.value.value = e.target.value"
            >
              <template #media>
                <Icon :name="icons[key]" class="text-gray-500" />
              </template>
              <template v-if="field.options">
                <option 
                  v-for="option in field.options" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </template>
            </k-list-input>

            <!-- Advanced Settings -->
            <k-list-item
              class="my-4 mx-2 cursor-pointer hover:bg-gray-50 rounded-xl"
              @click="showAdvancedSettings = !showAdvancedSettings"
            >
              <template #media>
                <Icon name="tabler:settings" class="text-gray-500" />
              </template>
              <template #title>
                <span class="text-gray-700">Paramètres avancés</span>
              </template>
              <template #after>
                <Icon 
                  :name="showAdvancedSettings ? 'tabler:chevron-up' : 'tabler:chevron-down'" 
                  class="text-gray-500"
                />
              </template>
            </k-list-item>

            <!-- Advanced Fields -->
            <template v-if="showAdvancedSettings">
              <k-list-input
                v-for="(field, key) in advancedFields"
                :key="key"
                :label="field.label"
                :type="field.type"
                :placeholder="`Entrez ${field.label.toLowerCase()}`"
                :value="field.value.value"
                :dropdown="field.dropdown"
                @input="(e) => field.value.value = e.target.value"
                outline
              >
                <template #media>
                  <Icon :name="icons[key] || 'tabler:server'" class="text-gray-500" />
                </template>
                <template v-if="field.options">
                  <option 
                    v-for="option in field.options" 
                    :key="option.value" 
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </template>
              </k-list-input>
            </template>
          </k-list>

          <k-button
            class="mt-6 !bg-primary font-medium text-lg h-12 rounded-xl"
            :class="{ 'opacity-75': loading }"
            :disabled="loading"
            @click="signIn"
          >
            <template v-if="loading">
              <Icon name="tabler:loader-2" class="mr-2 animate-spin" />
              Connexion en cours...
            </template>
            <template v-else>
              <Icon name="tabler:login" class="mr-2" />
              Se connecter
            </template>
          </k-button>
        </k-block>

        <!-- Footer -->
        <p class="text-center text-sm text-gray-500 mt-4">
          En vous connectant, vous acceptez d'accéder à Europresse via l'abonnement de votre établissement
        </p>
      </div>
    </div>

    <!-- Error Dialog -->
    <k-dialog
      :opened="errorDialog"
      @backdropclick="errorDialog = false"
    >
      <template #title>Erreur de connexion</template>
      {{ errorMessage }}
      <template #buttons>
        <k-dialog-button @click="errorDialog = false">OK</k-dialog-button>
      </template>
    </k-dialog>
  </k-page>
</template>

<style scoped>
.k-list {
  --k-list-margin-vertical: 1rem;
}

.k-list-input {
  --k-list-input-padding-vertical: 0.75rem;
}

:deep(.k-input-outline) {
  border-radius: 0.75rem;
}

/* Add smooth transitions */
.k-button,
.k-list-input {
  transition: all 0.2s ease;
}

/* Improve focus states */
:deep(input:focus),
:deep(select:focus) {
  @apply ring-2 ring-primary ring-opacity-50;
}

/* Add styles for the advanced settings button */
:deep(.k-list-item) {
  --k-list-item-padding-vertical: 0.75rem;
  --k-list-item-min-height: 3rem;
}
</style>
