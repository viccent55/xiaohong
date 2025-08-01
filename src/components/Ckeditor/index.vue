<template>
  <div
    class="editor-wrapper"
    ref="editorWrapper"
    :style="editorStyle"
  >
    <ckeditor
      :editor="editor"
      v-model="editorData"
      :config="editorConfig"
      @ready="onEditorReady"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import { Ckeditor } from "@ckeditor/ckeditor5-vue";
  import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

  const props = defineProps({
    minHeight: {
      type: String,
      default: "150px",
    },
  });

  const editorWrapper = ref<HTMLElement | null>(null);

  const editor = ClassicEditor;

  const ckeditor = Ckeditor;

  // Use defineModel for a two-way binding (v-model) with the parent component.
  const editorData = defineModel<string>();

  const editorStyle = computed(() => ({
    "--editor-min-height": props.minHeight,
  }));

  const editorConfig = {
    extraPlugins: [MyCustomUploadAdapterPlugin],
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "uploadImage",
      "blockQuote",
      "undo",
      "redo",
    ],
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
      ]
    }
  } as any;

  // Custom upload adapter to allow image upload
  function MyCustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      return new MyUploadAdapter(loader);
    };
  }

  // Replace this with your real upload endpoint
  class MyUploadAdapter {
    loader: any;
    xhr: XMLHttpRequest;

    constructor(loader: any) {
      this.loader = loader;
      this.xhr = new XMLHttpRequest();
    }

    upload() {
      return this.loader.file.then(
        (file: File) =>
          new Promise((resolve, reject) => {
            this.xhr.open("POST", "https://httpbin.org/post", true);
            this.xhr.responseType = "json";

            this.xhr.onload = () => {
              if (this.xhr.status === 200) {
                // Simulate an image URL from the response
                resolve({
                  default: URL.createObjectURL(file), // For testing use local blob URL
                });
              } else {
                reject("Upload failed");
              }
            };
            console.log(file);
            this.xhr.onerror = () => reject("Upload failed");
            this.xhr.onabort = () => reject("Upload aborted");

            const data = new FormData();
            data.append("upload", file);

            this.xhr.send(data);
          })
      );
    }

    abort() {
      this.xhr.abort();
    }
  }

  const onEditorReady = (editor: any) => {
    // Find the toolbar DOM element
    const toolbarElement = editor.ui.view.toolbar.element;

    // Create a separator for visual distinction
    const separator = document.createElement("span");
    separator.classList.add("ck", "ck-toolbar__separator");
    toolbarElement.appendChild(separator);

    // Create the fullscreen button element
    const fullscreenButton = document.createElement("button");
    fullscreenButton.type = "button";
    fullscreenButton.classList.add("ck", "ck-button", "ck-off");
    fullscreenButton.ariaLabel = "Fullscreen";
    // A simple SVG icon for fullscreen
    fullscreenButton.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 2h-2v3h-3v2h5v-5zm-3-2V5h-2v2h-3v2h5z"/></svg>`;

    // Add a click listener to toggle the fullscreen class on our wrapper
    fullscreenButton.addEventListener("click", () => {
      if (editorWrapper.value) {
        const isFullscreen = editorWrapper.value.classList.toggle("fullscreen");
        // Toggle the button's active state for visual feedback
        fullscreenButton.classList.toggle("ck-on", isFullscreen);
        fullscreenButton.classList.toggle("ck-off", !isFullscreen);
      }
    });

    // Append the button to the toolbar
    toolbarElement.appendChild(fullscreenButton);
  };
</script>

