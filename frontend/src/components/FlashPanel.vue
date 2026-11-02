<template>
  <section class="panel flash-panel">
    <header class="panel-head">
      <div>
        <h2>{{ t('flash.title') }}</h2>
        <p class="subtitle">{{ t('flash.subtitle') }}</p>
      </div>
    </header>

    <div class="source">
      <h3>{{ t('flash.source.title') }}</h3>
      <div class="source-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          :aria-selected="source === 'compiled'"
          :class="['source-tab', { active: source === 'compiled' }]"
          @click="selectSource('compiled')"
        >
          {{ t('flash.source.compiled') }}
          <span v-if="compiledFiles.length" class="count">{{ compiledFiles.length }}</span>
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="source === 'file'"
          :class="['source-tab', { active: source === 'file' }]"
          @click="selectSource('file')"
        >
          {{ t('flash.source.file') }}
        </button>
      </div>

      <div v-if="source === 'compiled'" class="source-body">
        <p v-if="!compiledFiles.length" class="hint">
          {{ t('flash.source.empty') }}
        </p>
        <template v-else>
          <p class="hint">{{ t('flash.source.factoryHint') }}</p>
          <ul class="firmware-list">
            <li v-for="file in compiledFiles" :key="file.name">
              <label class="firmware-option">
                <input v-model="selectedName" type="radio" name="firmware" :value="file.name" />
                <span class="firmware-name">{{ file.name }}</span>
                <span class="firmware-size">{{ formatSize(file.size) }}</span>
              </label>
            </li>
          </ul>
        </template>
      </div>

      <div v-else class="source-body">
        <label class="file-input">
          <input type="file" accept=".bin,application/octet-stream" @change="onFileChange" />
          <span>{{ uploadedName || t('flash.source.selectFile') }}</span>
        </label>
        <p v-if="fileError" class="status error">{{ fileError }}</p>
      </div>

      <label class="field">
        <span>{{ t('flash.chip.label') }}</span>
        <select v-model="chipFamily">
          <option value="ESP8266">ESP8266</option>
          <option value="ESP32">ESP32</option>
        </select>
      </label>
      <p class="hint">{{ t('flash.chip.hint') }}</p>
    </div>

    <div class="flasher">
      <p v-if="!currentFile" class="status warning">{{ t('flash.status.noFirmware') }}</p>
      <p v-else-if="!canFlash" class="status warning">{{ t('flash.status.unsupportedBrowser') }}</p>
      <p v-else-if="loaderError" class="status error">{{ loaderError }}</p>
      <p v-else-if="!elementReady" class="status">{{ t('flash.status.loading') }}</p>
      <template v-else>
        <p class="status">{{ t('flash.status.ready', { name: firmwareLabel }) }}</p>
        <esp-web-install-button :manifest="manifestUrl">
          <button slot="activate">{{ t('flash.button.ready') }}</button>
          <span slot="unsupported">{{ t('flash.button.unsupported') }}</span>
          <span slot="not-allowed">{{ t('flash.button.notAllowed') }}</span>
        </esp-web-install-button>
      </template>
    </div>

    <div class="tips">
      <h3>{{ t('flash.tips.title') }}</h3>
      <div class="tips-block">
        <strong>{{ t('flash.tips.computerTitle') }}</strong>
        <ol>
          <li v-for="index in STEP_COUNT" :key="`c${index}`">
            {{ t(`flash.tips.computer${index}`) }}
          </li>
        </ol>
      </div>
      <div class="tips-block">
        <strong>{{ t('flash.tips.androidTitle') }}</strong>
        <ol>
          <li v-for="index in STEP_COUNT" :key="`a${index}`">
            {{ t(`flash.tips.android${index}`) }}
          </li>
        </ol>
      </div>
      <p class="tips-note">{{ t('flash.tips.iosNote') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { compiledChipFamily, compiledFirmwareFiles, type ChipFamily } from '../firmware-store';

const { t } = useI18n();

const STEP_COUNT = 5;

// jason2866 那个 CDN 现在返回 404，所以按可用性顺序回退
const ESP_WEB_TOOLS_SOURCES = [
  'https://unpkg.com/tasmota-esp-web-tools/dist/web/install-button.js?module',
  'https://cdn.jsdelivr.net/npm/esp-web-tools@10/dist/web/install-button.js?module'
];

const compiledFiles = compiledFirmwareFiles;
const source = ref<'compiled' | 'file'>('compiled');
const selectedName = ref('');
const uploadedFile = ref<File | null>(null);
const uploadedName = ref('');
const fileError = ref<string | null>(null);
const chipFamily = ref<ChipFamily>('ESP8266');
const manifestUrl = ref('');
const loaderError = ref<string | null>(null);
const elementReady = ref(false);

// Chrome/Edge 支持 Web Serial；安卓 Chrome 走 WebUSB
const canFlash =
  typeof navigator !== 'undefined' &&
  ('serial' in navigator || 'usb' in navigator);

let binObjectUrl = '';

const currentFile = computed(() => {
  if (source.value === 'compiled') {
    return compiledFiles.value.find((file) => file.name === selectedName.value) ?? null;
  }
  return uploadedFile.value;
});

const firmwareLabel = computed(() => {
  const file = currentFile.value;
  return file ? `${file.name} (${formatSize(file.size)})` : '';
});

function formatSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function selectSource(next: 'compiled' | 'file') {
  source.value = next;
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;
  fileError.value = null;
  if (!file) {
    uploadedFile.value = null;
    uploadedName.value = '';
    return;
  }
  if (!file.name.toLowerCase().endsWith('.bin')) {
    fileError.value = t('flash.source.invalidFile');
    uploadedFile.value = null;
    uploadedName.value = '';
    input.value = '';
    return;
  }
  uploadedFile.value = file;
  uploadedName.value = `${file.name} (${formatSize(file.size)})`;
}

function revokeUrls() {
  if (binObjectUrl) {
    URL.revokeObjectURL(binObjectUrl);
    binObjectUrl = '';
  }
  if (manifestUrl.value) {
    URL.revokeObjectURL(manifestUrl.value);
    manifestUrl.value = '';
  }
}

/** 把固件包成 esp-web-tools 需要的 manifest；parts 直接指向内存里的 blob，无需上传服务器。 */
function buildManifest() {
  revokeUrls();
  const file = currentFile.value;
  if (!file) {
    return;
  }

  const blob =
    'data' in file
      ? new Blob([file.data as unknown as BlobPart], { type: 'application/octet-stream' })
      : file;
  binObjectUrl = URL.createObjectURL(blob);

  const manifest = {
    name: 'ESPHome Firmware',
    version: '1.0.0',
    new_install_prompt_erase: true,
    builds: [
      {
        chipFamily: chipFamily.value,
        parts: [{ path: binObjectUrl, offset: 0 }]
      }
    ]
  };

  manifestUrl.value = URL.createObjectURL(
    new Blob([JSON.stringify(manifest)], { type: 'application/json' })
  );
}

function injectModule(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(script);
  });
}

async function loadEspWebTools() {
  for (const src of ESP_WEB_TOOLS_SOURCES) {
    try {
      await injectModule(src);
      if (window.customElements?.get('esp-web-install-button')) {
        elementReady.value = true;
        return;
      }
    } catch (err) {
      console.warn('esp-web-tools source failed', src, err);
    }
  }
  loaderError.value = t('flash.status.failed');
}

watch(
  [source, compiledFiles],
  () => {
    if (source.value !== 'compiled') {
      return;
    }
    const files = compiledFiles.value;
    if (files.length === 0) {
      selectedName.value = '';
      return;
    }
    if (!files.some((file) => file.name === selectedName.value)) {
      selectedName.value = files[0].name;
    }
  },
  { immediate: true }
);

watch(
  () => compiledChipFamily.value,
  (chip) => {
    chipFamily.value = chip;
  }
);

watch([currentFile, chipFamily], () => {
  buildManifest();
});

onMounted(() => {
  if (compiledFiles.value.length > 0) {
    selectedName.value = compiledFiles.value[0].name;
    chipFamily.value = compiledChipFamily.value;
  }
  buildManifest();
  if (canFlash) {
    void loadEspWebTools();
  }
});

onBeforeUnmount(() => {
  revokeUrls();
});
</script>

<style scoped>
.panel {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(15, 15, 80, 0.2);
  display: grid;
  gap: 1.5rem;
}

.panel-head h2 {
  margin: 0 0 0.35rem;
  font-size: 1.35rem;
}

.subtitle {
  margin: 0;
  color: #94a3b8;
  font-size: 0.9rem;
}

.source {
  display: grid;
  gap: 0.75rem;
}

.source h3,
.tips h3 {
  margin: 0;
  font-size: 1rem;
  color: #e2e8f0;
}

.source-tabs {
  display: inline-flex;
  gap: 0.5rem;
  padding: 0.25rem;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.2);
  width: fit-content;
}

.source-tab {
  border: none;
  background: transparent;
  color: #cbd5f5;
  padding: 0.45rem 0.9rem;
  border-radius: 9px;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.source-tab.active {
  background: rgba(37, 99, 235, 0.85);
  color: #f8fafc;
}

.count {
  font-size: 0.75rem;
  padding: 0.05rem 0.4rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.6);
}

.source-body {
  display: grid;
  gap: 0.5rem;
}

.hint {
  margin: 0;
  font-size: 0.82rem;
  color: #94a3b8;
}

.firmware-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.4rem;
}

.firmware-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.65rem;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  cursor: pointer;
}

.firmware-option:has(input:checked) {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.5) inset;
}

.firmware-name {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo,
    Monaco, Consolas, monospace;
  font-size: 0.85rem;
  color: #e0f2fe;
  word-break: break-all;
}

.firmware-size {
  margin-left: auto;
  font-size: 0.8rem;
  color: #94a3b8;
  white-space: nowrap;
}

.file-input {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.8rem;
  border-radius: 10px;
  border: 1px dashed rgba(148, 163, 184, 0.45);
  cursor: pointer;
  font-size: 0.88rem;
  color: #cbd5f5;
}

.file-input input {
  max-width: 220px;
}

.field {
  display: grid;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: #e2e8f0;
}

.field select {
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.9);
  color: #f8fafc;
  padding: 0 0.6rem;
}

.flasher {
  display: grid;
  gap: 0.6rem;
  justify-items: start;
}

.status {
  margin: 0;
  font-size: 0.88rem;
  color: #cbd5f5;
}

.status.warning {
  color: #fbbf24;
}

.status.error {
  color: #f87171;
}

esp-web-install-button {
  --esp-tools-button-color: #f0a437;
  --esp-tools-button-text-color: #1a1a1a;
  --esp-tools-button-border-radius: 10px;
}

esp-web-install-button::part(button) {
  font-weight: 600;
  padding: 0.85rem 2rem;
  font-size: 1rem;
}

.tips {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(42, 37, 24, 0.55);
  border-left: 3px solid #f0a437;
  font-size: 0.82rem;
  color: #d8c89a;
}

.tips-block {
  display: grid;
  gap: 0.3rem;
}

.tips-block strong {
  color: #f0a437;
}

.tips-block ol {
  margin: 0;
  padding-left: 1.2rem;
  line-height: 1.7;
}

.tips-note {
  margin: 0;
  color: #b8a87a;
}
</style>
