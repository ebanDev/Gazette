<template>
  <ClientOnly>
    <!-- Update available notification -->
    <k-dialog
      :opened="$pwa?.needRefresh"
      @backdropclick="$pwa?.cancelPrompt"
    >
      <template #title>Mise à jour disponible</template>
      Une nouvelle version est disponible. Souhaitez-vous mettre à jour ?
      <template #buttons>
        <k-dialog-button @click="$pwa?.cancelPrompt">Plus tard</k-dialog-button>
        <k-dialog-button strong @click="$pwa?.updateServiceWorker">Mettre à jour</k-dialog-button>
      </template>
    </k-dialog>

    <!-- Offline ready notification -->
    <k-toast :opened="$pwa?.offlineReady" @toastclose="$pwa?.cancelPrompt">
      <div class="shrink">Application prête à fonctionner hors ligne</div>
      <template #button>
        <k-button clear inline @click="$pwa?.cancelPrompt">
          Fermer
        </k-button>
      </template>
    </k-toast>

    <!-- Install PWA prompt -->
    <k-dialog
      :opened="$pwa?.showInstallPrompt && !$pwa?.needRefresh"
      @backdropclick="$pwa?.cancelInstall"
    >
      <template #title>Installer l'application</template>
      Souhaitez-vous installer l'application sur votre appareil ?
      <template #buttons>
        <k-dialog-button @click="$pwa?.cancelInstall">Annuler</k-dialog-button>
        <k-dialog-button strong @click="$pwa?.install">Installer</k-dialog-button>
      </template>
    </k-dialog>
  </ClientOnly>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { kToast, kButton, kDialog, kDialogButton } from 'konsta/vue'
</script>
