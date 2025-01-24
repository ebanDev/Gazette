<script setup lang="ts">
import { ref } from 'vue';
import { kActions, kActionsGroup, kActionsButton } from 'konsta/vue';
import { jsPDF } from "jspdf";

const props = defineProps<{
  opened: boolean
}>();

const emit = defineEmits(['close']);
const currentArticleStore = useCurrentArticleStore();

const exportAs = async (type: 'pdf' | 'html') => {
  const content = document.querySelector('.articleContent');
  if (!content) return;

  try {
    if (type === 'pdf') {
      const pdf = new jsPDF('p', 'pt', [595, 842]);
      const margins = { top: 10, bottom: 10, left: 50, right: 50 };

      await pdf.html(content, {
        margin: [margins.top, margins.left, margins.bottom, margins.left],
        x: margins.left,
        y: margins.top,
        html2canvas: { scale: 0.7 },
      });

      const pdfBlob = pdf.output('blob');
      if (navigator.share) {
        await navigator.share({
          files: [new File([pdfBlob], `${currentArticleStore.currentArticle.id}.pdf`, {
            type: 'application/pdf'
          })]
        });
      } else {
        pdf.save(currentArticleStore.currentArticle.id + ".pdf");
      }
    } else {
      const htmlContent = content.innerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      if (navigator.share) {
        await navigator.share({
          files: [new File([blob], `${currentArticleStore.currentArticle.id}.html`, {
            type: 'text/html'
          })]
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentArticleStore.currentArticle.id}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  } catch (error) {
    console.error('Error exporting:', error);
  }
  
  emit('close');
};
</script>

<template>
  <k-actions :opened="opened" @actions:close="emit('close')">
    <k-actions-group>
      <k-actions-button @click="exportAs('pdf')">
        Export as PDF
      </k-actions-button>
      <k-actions-button @click="exportAs('html')">
        Export as HTML
      </k-actions-button>
    </k-actions-group>
  </k-actions>
</template>
