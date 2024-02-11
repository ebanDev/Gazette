<script setup>
import { jsPDF } from "jspdf";
import {Share} from '@capacitor/share';
import {Directory, Filesystem} from "@capacitor/filesystem";
import {useCurrentArticleStore} from "@/store/currentArticle";


const currentArticleStore = useCurrentArticleStore();

const exportAs = async (type) => {
  const content = document.querySelector('.articleContent');
  if (type === 'pdf') {
    const pdf = new jsPDF('p', 'pt', [595, 842]);
    const margins = {
      top: 10,
      bottom: 10,
      left: 50,
      right: 50
    };

    console.log(pdf.getFontList())

    pdf.html(content, {
      callback: function (pdf) {
        pdf.save(currentArticleStore.currentArticle.id + ".pdf");
      },
      margins: [margins.top, margins.left, margins.bottom, margins.left],
      x: margins.left,
      y: margins.top,
      windowWidth: 700,
      width: 700,
      html2canvas: {
        scale: 0.7,
      },
    });
    const fileUri = await Filesystem.writeFile({
      path: currentArticleStore.currentArticle.id + ".pdf",
      data: datauristring,
      directory: Directory.Cache,
    });
    await Share.share({
      title: 'Share',
      text: 'Share this article',
      files: [fileUri.uri]
    });
  } else if (type === 'html') {
    const htmlContent = content.innerHTML;
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Article</title>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
    const datauristring = "data:text/html;base64," + btoa(html);
    const fileUri = await Filesystem.writeFile({
      path: currentArticleStore.currentArticle.id + ".html",
      data: datauristring,
      directory: Directory.Cache,
    });
    await Share.share({
      title: 'Share',
      text: 'Share this article',
      files: [fileUri.uri]
    });
  }
}
</script>

<template>
  <f7-actions id="exportAs">
    <f7-actions-group>
      <f7-actions-button @click="exportAs('pdf')">Export as PDF</f7-actions-button>
      <f7-actions-button @click="exportAs('html')">Export as HTML</f7-actions-button>
    </f7-actions-group>
  </f7-actions>
</template>
