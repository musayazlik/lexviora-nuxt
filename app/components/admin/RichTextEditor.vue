<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { richTextExtensions } from '~/utils/editor/extensions';
import { looksLikeMarkdown, markdownToHtml } from '~/utils/editor/markdown';
import type { MediaAsset } from '#shared/types/media';
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    id: string;
    label?: string;
    language?: string;
    direction?: string;
    editable?: boolean;
  }>(),
  { modelValue: '', label: 'Content', language: 'en', direction: 'ltr', editable: true },
);
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
const source = ref<string | null>(null),
  fullscreen = ref(false),
  revision = ref(0);
const prompt = ref<'link' | 'embed' | null>(null),
  promptValue = ref(''),
  promptError = ref('');
const picker = ref(false),
  pickerKind = ref<'image' | 'video'>('image');
const busy = ref(false),
  error = ref(''),
  dragging = ref(false);
const { errorText } = useAdmin();
const editor = useEditor({
  extensions: richTextExtensions('Start writing…'),
  content: props.modelValue,
  editable: props.editable,
  editorProps: {
    attributes: {
      id: props.id,
      class: 'motive-editor-document',
      role: 'textbox',
      'aria-label': props.label,
      'aria-multiline': 'true',
      lang: props.language,
      dir: props.direction,
    },
    handlePaste: (_view, event) => {
      const clipboard = event.clipboardData;
      if (!clipboard) return false;
      if (clipboard.files.length) {
        void upload(Array.from(clipboard.files));
        return true;
      }
      const text = clipboard.getData('text/plain');
      if (clipboard.types.includes('text/html') || !looksLikeMarkdown(text)) return false;
      editor.value?.chain().focus().insertContent(markdownToHtml(text)).run();
      return true;
    },
    handleDrop: (view, event, _slice, moved) => {
      const files = Array.from(event.dataTransfer?.files || []);
      if (moved || !files.length) return false;
      event.preventDefault();
      void upload(files, view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos);
      return true;
    },
    handleKeyDown: (_view, event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openPrompt('link');
        return true;
      }
      return false;
    },
  },
  onUpdate: ({ editor: instance }) => emit('update:modelValue', instance.getHTML()),
  onTransaction: () => {
    revision.value++;
  },
});
watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && source.value === null && editor.value.getHTML() !== value)
      editor.value.commands.setContent(value || '', { emitUpdate: false });
  },
);
watch(
  () => props.editable,
  (value) => editor.value?.setEditable(value),
);
const block = computed({
  get: () => {
    void revision.value;
    return (
      [2, 3, 4].find((level) => editor.value?.isActive('heading', { level }))?.toString() ||
      'paragraph'
    );
  },
  set: (value: string) => {
    if (value === 'paragraph') editor.value?.chain().focus().setParagraph().run();
    else
      editor.value
        ?.chain()
        .focus()
        .setHeading({ level: Number(value) as 2 | 3 | 4 })
        .run();
  },
});
const counts = computed(() => {
  void revision.value;
  const text = editor.value?.state.doc.textContent || '';
  return { words: text.trim().split(/\s+/).filter(Boolean).length, characters: text.length };
});
const tools = computed(() => {
  void revision.value;
  const e = editor.value;
  return [
    [
      {
        label: 'Undo',
        icon: 'undo-2',
        run: () => e?.chain().focus().undo().run(),
        disabled: !e?.can().undo(),
      },
      {
        label: 'Redo',
        icon: 'redo-2',
        run: () => e?.chain().focus().redo().run(),
        disabled: !e?.can().redo(),
      },
    ],
    [
      {
        label: 'Bold',
        icon: 'bold',
        active: e?.isActive('bold'),
        run: () => e?.chain().focus().toggleBold().run(),
      },
      {
        label: 'Italic',
        icon: 'italic',
        active: e?.isActive('italic'),
        run: () => e?.chain().focus().toggleItalic().run(),
      },
      {
        label: 'Underline',
        icon: 'underline',
        active: e?.isActive('underline'),
        run: () => e?.chain().focus().toggleUnderline().run(),
      },
      {
        label: 'Strikethrough',
        icon: 'strikethrough',
        active: e?.isActive('strike'),
        run: () => e?.chain().focus().toggleStrike().run(),
      },
      {
        label: 'Inline code',
        icon: 'code',
        active: e?.isActive('code'),
        run: () => e?.chain().focus().toggleCode().run(),
      },
    ],
    [
      {
        label: 'Subscript',
        icon: 'subscript',
        active: e?.isActive('subscript'),
        run: () => e?.chain().focus().toggleSubscript().run(),
      },
      {
        label: 'Superscript',
        icon: 'superscript',
        active: e?.isActive('superscript'),
        run: () => e?.chain().focus().toggleSuperscript().run(),
      },
    ],
    ['left', 'center', 'right', 'justify'].map((alignment) => ({
      label: 'Align ' + alignment,
      icon: 'align-' + alignment,
      active: e?.isActive({ textAlign: alignment }),
      run: () => e?.chain().focus().setTextAlign(alignment).run(),
    })),
    [
      {
        label: 'Bullet list',
        icon: 'list',
        active: e?.isActive('bulletList'),
        run: () => e?.chain().focus().toggleBulletList().run(),
      },
      {
        label: 'Numbered list',
        icon: 'list-ordered',
        active: e?.isActive('orderedList'),
        run: () => e?.chain().focus().toggleOrderedList().run(),
      },
      {
        label: 'Checklist',
        icon: 'list-checks',
        active: e?.isActive('taskList'),
        run: () => e?.chain().focus().toggleTaskList().run(),
      },
      {
        label: 'Indent',
        icon: 'indent-increase',
        run: () =>
          e
            ?.chain()
            .focus()
            .sinkListItem(e.isActive('taskItem') ? 'taskItem' : 'listItem')
            .run(),
      },
      {
        label: 'Outdent',
        icon: 'indent-decrease',
        run: () =>
          e
            ?.chain()
            .focus()
            .liftListItem(e.isActive('taskItem') ? 'taskItem' : 'listItem')
            .run(),
      },
    ],
    [
      {
        label: 'Blockquote',
        icon: 'quote',
        active: e?.isActive('blockquote'),
        run: () => e?.chain().focus().toggleBlockquote().run(),
      },
      {
        label: 'Code block',
        icon: 'square-code',
        active: e?.isActive('codeBlock'),
        run: () => e?.chain().focus().toggleCodeBlock().run(),
      },
      {
        label: 'Horizontal rule',
        icon: 'minus',
        run: () => e?.chain().focus().setHorizontalRule().run(),
      },
      {
        label: 'Clear formatting',
        icon: 'remove-formatting',
        run: () => e?.chain().focus().unsetAllMarks().clearNodes().run(),
      },
    ],
  ];
});
function openPrompt(kind: 'link' | 'embed') {
  prompt.value = kind;
  promptValue.value = kind === 'link' ? editor.value?.getAttributes('link').href || '' : '';
  promptError.value = '';
}
function applyPrompt() {
  const e = editor.value;
  if (!e) return;
  let url = promptValue.value.trim();
  if (prompt.value === 'link' && !url) {
    e.chain().focus().extendMarkRange('link').unsetLink().run();
    prompt.value = null;
    return;
  }
  if (url && !/^[a-z]+:/i.test(url)) url = 'https://' + url;
  if (!/^https?:\/\//i.test(url) && !(prompt.value === 'link' && /^mailto:/i.test(url))) {
    promptError.value = 'Enter a valid HTTPS URL.';
    return;
  }
  if (prompt.value === 'link') {
    if (e.state.selection.empty && !e.isActive('link'))
      e.chain()
        .focus()
        .insertContent({ type: 'text', text: url, marks: [{ type: 'link', attrs: { href: url } }] })
        .run();
    else e.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  } else {
    const youtube =
      /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com|youtu\.be|youtube-nocookie\.com)\//i.test(url);
    if (youtube) {
      if (!e.commands.setYoutubeVideo({ src: url })) {
        promptError.value = 'Enter a valid YouTube watch or share URL.';
        return;
      }
    } else
      e.chain()
        .focus()
        .insertContent({ type: 'video', attrs: { src: url } })
        .run();
  }
  prompt.value = null;
}
function insert(items: MediaAsset[], at?: number) {
  const nodes = items.map((item) => ({
    type: item.mime?.startsWith('video/') ? 'video' : 'image',
    attrs: { src: item.url, alt: item.alt || item.name },
  }));
  const chain = editor.value?.chain().focus();
  if (at !== undefined) chain?.insertContentAt(at, nodes).run();
  else chain?.insertContent(nodes).run();
}
async function upload(files: File[], at?: number) {
  if (!props.editable) return;
  busy.value = true;
  error.value = '';
  try {
    const items: MediaAsset[] = [];
    for (const file of files) {
      const body = new FormData();
      body.append('file', file);
      items.push(await $fetch<MediaAsset>('/api/admin/media', { method: 'POST', body }));
    }
    insert(items, at);
  } catch (e) {
    error.value = errorText(e);
  } finally {
    busy.value = false;
    dragging.value = false;
  }
}
function toggleSource() {
  if (!editor.value) return;
  if (source.value === null) source.value = editor.value.getHTML();
  else {
    editor.value.commands.setContent(source.value, { emitUpdate: false });
    emit('update:modelValue', editor.value.getHTML());
    source.value = null;
  }
}
let previousOverflow = '';
watch(fullscreen, (value) => {
  if (value) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  } else document.body.style.overflow = previousOverflow;
});
function escape(event: KeyboardEvent) {
  if (event.key === 'Escape' && !document.querySelector('[role=dialog]')) {
    fullscreen.value = false;
    prompt.value = null;
  }
}
onMounted(() => document.addEventListener('keydown', escape));
onBeforeUnmount(() => {
  document.removeEventListener('keydown', escape);
  if (fullscreen.value) document.body.style.overflow = previousOverflow;
  editor.value?.destroy();
});
</script>
<template>
  <div
    class="motive-editor"
    :class="{ 'is-fullscreen': fullscreen, 'is-dragging': dragging }"
    :data-revision="revision"
    @dragover.prevent="dragging = true"
    @dragleave="dragging = false"
    @drop="dragging = false"
  >
    <div
      class="motive-editor-toolbar"
      role="toolbar"
      aria-label="Text formatting"
      :aria-controls="id"
    >
      <select v-model="block" aria-label="Text block" :disabled="!editable || source !== null">
        <option value="paragraph">Paragraph</option>
        <option v-for="level in [2, 3, 4]" :key="level" :value="String(level)">
          Heading {{ level }}
        </option>
      </select>
      <span v-for="(group, index) in tools" :key="index" class="motive-tool-group"
        ><button
          v-for="tool in group"
          :key="tool.label"
          type="button"
          :title="tool.label"
          :aria-label="tool.label"
          :aria-pressed="'active' in tool ? tool.active : undefined"
          :class="{ active: 'active' in tool && tool.active }"
          :disabled="!editable || source !== null || ('disabled' in tool && tool.disabled)"
          @mousedown.prevent
          @click="tool.run"
        >
          <UIcon :name="'i-lucide-' + tool.icon" /></button
      ></span>
      <span class="motive-tool-group"
        ><label title="Text color" class="editor-color-tool"
          ><UIcon name="i-lucide-baseline" /><input
            type="color"
            aria-label="Text color"
            value="#24384d"
            :disabled="!editable || source !== null"
            @input="
              editor
                ?.chain()
                .focus()
                .setColor(($event.target as HTMLInputElement).value)
                .run()
            " /></label
        ><label title="Highlight color" class="editor-color-tool"
          ><UIcon name="i-lucide-highlighter" /><input
            type="color"
            aria-label="Highlight color"
            value="#f1e9dc"
            :disabled="!editable || source !== null"
            @input="
              editor
                ?.chain()
                .focus()
                .setHighlight({ color: ($event.target as HTMLInputElement).value })
                .run()
            " /></label
      ></span>
      <span class="motive-tool-group"
        ><button
          type="button"
          title="Link (Ctrl+K)"
          aria-label="Insert link"
          :disabled="!editable || source !== null"
          @mousedown.prevent
          @click="openPrompt('link')"
        >
          <UIcon name="i-lucide-link" /></button
        ><button
          type="button"
          title="Image"
          aria-label="Insert image"
          :disabled="!editable || source !== null || busy"
          @click="
            pickerKind = 'image';
            picker = true;
          "
        >
          <UIcon name="i-lucide-image" /></button
        ><button
          type="button"
          title="Video"
          aria-label="Insert video"
          :disabled="!editable || source !== null || busy"
          @click="
            pickerKind = 'video';
            picker = true;
          "
        >
          <UIcon name="i-lucide-video" /></button
        ><button
          type="button"
          title="Embed YouTube or video"
          aria-label="Embed video"
          :disabled="!editable || source !== null"
          @click="openPrompt('embed')"
        >
          <UIcon name="i-lucide-youtube" /></button
        ><button
          type="button"
          title="Insert table"
          aria-label="Insert table"
          :disabled="!editable || source !== null"
          @mousedown.prevent
          @click="
            editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          "
        >
          <UIcon name="i-lucide-table" /></button
      ></span>
      <span class="motive-tool-group motive-view-tools"
        ><button
          type="button"
          title="HTML source"
          aria-label="HTML source"
          :aria-pressed="source !== null"
          :disabled="!editable"
          @click="toggleSource"
        >
          <UIcon name="i-lucide-code-xml" /></button
        ><button
          type="button"
          :title="fullscreen ? 'Exit full screen' : 'Full screen'"
          :aria-label="fullscreen ? 'Exit full screen' : 'Full screen'"
          :aria-pressed="fullscreen"
          @click="fullscreen = !fullscreen"
        >
          <UIcon :name="fullscreen ? 'i-lucide-minimize' : 'i-lucide-maximize'" /></button
      ></span>
    </div>
    <div v-if="prompt" class="editor-inline-prompt" role="group" aria-label="Insert URL">
      <label :for="id + '-url'">{{ prompt === 'link' ? 'Link URL' : 'YouTube or video URL' }}</label
      ><UInput
        :id="id + '-url'"
        v-model="promptValue"
        placeholder="https://"
        class="flex-1"
        @keydown.enter.prevent="applyPrompt"
      /><UButton type="button" size="sm" @click="applyPrompt">Apply</UButton
      ><UButton
        type="button"
        variant="ghost"
        color="neutral"
        size="sm"
        aria-label="Close URL field"
        icon="i-lucide-x"
        @click="prompt = null"
      />
      <p v-if="promptError" role="alert">{{ promptError }}</p>
    </div>
    <div
      v-if="editor?.isActive('table') && source === null"
      class="editor-context-bar"
      aria-label="Table tools"
    >
      <button
        v-for="action in [
          { label: 'Row before', run: () => editor?.chain().focus().addRowBefore().run() },
          { label: 'Row after', run: () => editor?.chain().focus().addRowAfter().run() },
          { label: 'Column before', run: () => editor?.chain().focus().addColumnBefore().run() },
          { label: 'Column after', run: () => editor?.chain().focus().addColumnAfter().run() },
          { label: 'Delete row', run: () => editor?.chain().focus().deleteRow().run() },
          { label: 'Delete column', run: () => editor?.chain().focus().deleteColumn().run() },
          { label: 'Merge / split', run: () => editor?.chain().focus().mergeOrSplit().run() },
          { label: 'Header row', run: () => editor?.chain().focus().toggleHeaderRow().run() },
          { label: 'Delete table', run: () => editor?.chain().focus().deleteTable().run() },
        ]"
        :key="action.label"
        type="button"
        :disabled="!editable"
        @mousedown.prevent
        @click="action.run"
      >
        {{ action.label }}
      </button>
    </div>
    <div v-if="editor?.isActive('image') && source === null" class="editor-context-bar">
      <span>Image</span
      ><button
        v-for="align in ['left', 'center', 'right', 'wide']"
        :key="align"
        type="button"
        :disabled="!editable"
        @mousedown.prevent
        @click="editor?.chain().focus().updateAttributes('image', { align }).run()"
      >
        {{ align }}</button
      ><label
        >Width
        <input
          type="number"
          min="80"
          max="2400"
          :value="editor.getAttributes('image').width || 640"
          :disabled="!editable"
          @change="
            editor
              ?.chain()
              .focus()
              .updateAttributes('image', {
                width: Number(($event.target as HTMLInputElement).value),
              })
              .run()
          " /></label
      ><label
        >Alt text
        <input
          :value="editor.getAttributes('image').alt || ''"
          :disabled="!editable"
          @change="
            editor
              ?.chain()
              .focus()
              .updateAttributes('image', { alt: ($event.target as HTMLInputElement).value })
              .run()
          " /></label
      ><button
        type="button"
        :disabled="!editable"
        @click="editor?.chain().focus().deleteSelection().run()"
      >
        Remove image
      </button>
    </div>
    <UAlert v-if="error" :title="error" color="error" class="m-3" />
    <textarea
      v-if="source !== null"
      v-model="source"
      class="motive-editor-source"
      :aria-label="label + ' HTML source'"
      spellcheck="false"
      @input="emit('update:modelValue', source || '')"
    />
    <EditorContent v-else :editor="editor" />
    <div v-if="dragging" class="editor-drop-hint">Drop images or videos to upload</div>
    <footer class="motive-editor-status">
      <span aria-live="polite">{{
        busy
          ? 'Uploading to UploadThing…'
          : source !== null
            ? 'Editing HTML source'
            : 'Paste or drop images and videos to upload'
      }}</span
      ><span
        >{{ counts.words }} words <span aria-hidden="true">/</span>
        {{ counts.characters }} characters</span
      >
    </footer>
    <AdminMediaPicker v-model:open="picker" :kind="pickerKind" multiple @select="insert($event)" />
  </div>
</template>
