<script setup>
import { ref } from 'vue';
import Editor from '@tinymce/tinymce-vue';

// The API key is required to use TinyMCE Cloud.
// We are now using your API key.
const apiKey = '13m00jdl1lnkwo14on5rvlpnxhhtdb7lna6tbo5ee6h23eu6';

// The initial content from the TinyMCE demo, as requested.
const initialContent = ref(`
<p><img style="display: block; margin-left: auto; margin-right: auto;" title="Tiny Logo" src="https://www.tiny.cloud/docs/images/logos/android-chrome-256x256.png" alt="TinyMCE Logo" width="128" height="128"></p>
<h2>Welcome to the TinyMCE Cloud demo!</h2>
<p>Please try out the features provided in this full featured example.</p>
<h2>Got questions or need help?</h2>
<ul>
<li>Our <a class="mceNonEditable" href="https://www.tiny.cloud/docs/tinymce/6/">documentation</a> is a great resource for learning how to configure TinyMCE.</li>
<li>Have a specific question? Visit the <a class="mceNonEditable" href="https://community.tiny.cloud/forum/">Community Forum</a>.</li>
</ul>
<h2>A simple table to play with</h2>
<table style="text-align: center;border-collapse: collapse; width: 100%;">
<thead>
<tr>
<th>Product</th>
<th>Cost</th>
<th>Really?</th>
</tr>
</thead>
<tbody>
<tr>
<td>TinyMCE Cloud</td>
<td>Get started for free</td>
<td>YES!</td>
</tr>
</tbody>
</table>
<h2>Found a bug?</h2>
<p>If you think you have found a bug please create an issue on the <a href="https://github.com/tinymce/tinymce/issues">GitHub repo</a> to report it to the developers.</p>
<h2>Finally ...</h2>
<p>Don't forget to check out our other product <a href="http://www.plupload.com" target="_blank">Plupload</a>, your ultimate upload solution featuring HTML5 upload support.</p>
<p>Thanks for supporting TinyMCE! We hope it helps you and your users create great content.<br>All the best from the TinyMCE team.</p>
`);
</script>

<template>
  <div class="tinymce-container">
    <div v-html="initialContent"></div>
    
    <h1 class="text-3xl font-bold mb-4">TinyMCE Editor Demo</h1>
    <Editor
      :api-key="apiKey"
      :init="{
        height: 520,
        menubar: 'file edit view insert format tools table help',
        // The list below only includes the free, core plugins.
        plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
        imagetools_cors_hosts: ['picsum.photos'],
        // The toolbar has also been adjusted to only include free features.
        toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview save print | insertfile image media template link anchor codesample | ltr rtl',
        autosave_ask_before_unload: true,
        autosave_interval: '30s',
        autosave_prefix: '{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
        image_advtab: true,
        content_css: '',
        link_list: [
          { title: 'My page 1', value: 'http://www.tinymce.com' },
          { title: 'My page 2', value: 'http://www.moxiecode.com' }
        ],
        image_list: [
          { title: 'My page 1', value: 'http://www.tinymce.com' },
          { title: 'My page 2', value: 'http://www.moxiecode.com' }
        ],
        image_class_list: [
          { title: 'None', value: '' },
          { title: 'Some class', value: 'class-name' }
        ],
        importcss_append: true,
        file_picker_callback: function (callback, value, meta) {
          if (meta.filetype === 'file') {
            callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
          }
          if (meta.filetype === 'image') {
            callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
          }
          if (meta.filetype === 'media') {
            callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
          }
        },
        templates: [
          { title: 'New Table', description: 'creates a new table', content: '' },
          { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
          { title: 'New list with dates', description: 'New List with dates', content: '' }
        ],
        template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
        template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
        image_caption: true,
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        noneditable_noneditable_class: 'mceNonEditable',
        toolbar_mode: 'sliding',
        contextmenu: 'link image imagetools table',
      }"
      v-model="initialContent"
    />
  </div>
</template>

<style scoped>
.tinymce-container {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}
h1 {
  text-align: center;
}
</style>
