<template>
  <main :class="['app', { embed: isEmbed, widget: isWidget }]">
    <section v-if="!isEmbed && !isWidget" class="hero">
      <div class="hero-header">
        <h1 class="hero-title">{{ t('app.title') }}</h1>
        <div class="locale-switcher">
          <label class="sr-only" for="locale-select">{{ t('app.localeLabel') }}</label>
          <select id="locale-select" v-model="currentLocale" class="locale-select">
            <option v-for="option in localeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      <nav class="module-tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab.id"
          :class="['module-tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>
    </section>
    <FlashPanel v-if="isWidget" />
    <template v-else>
      <CompileForm v-show="activeTab === 'compile'" />
      <FlashPanel v-show="activeTab === 'flash'" />
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import CompileForm from './components/CompileForm.vue';
import FlashPanel from './components/FlashPanel.vue';
import { persistLocale, SUPPORTED_LOCALES, type SupportedLocale } from './i18n';

const { t, locale } = useI18n();

type ModuleTab = 'compile' | 'flash';

const isEmbed =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('embed') === '1';

// 仅供外部站点内嵌：只渲染烧录面板，不含标题、页签和编译模块
const isWidget =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('widget') === '1';

function readTabFromUrl(): ModuleTab {
  if (typeof window === 'undefined') {
    return 'compile';
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get('artifact')) {
    return 'flash';
  }
  return params.get('tab') === 'flash' ? 'flash' : 'compile';
}

const activeTab = ref<ModuleTab>(readTabFromUrl());

// 让当前模块出现在地址栏，便于直接分享到烧录页
watch(activeTab, (tab) => {
  if (typeof window === 'undefined') {
    return;
  }
  const url = new URL(window.location.href);
  if (tab === 'flash') {
    url.searchParams.set('tab', 'flash');
  } else {
    url.searchParams.delete('tab');
  }
  window.history.replaceState(null, '', url.toString());
});

const tabs = computed(() => [
  { id: 'compile' as const, label: t('app.tabs.compile') },
  { id: 'flash' as const, label: t('app.tabs.flash') }
]);

const currentLocale = computed<SupportedLocale>({
  get: () => locale.value as SupportedLocale,
  set: (value) => {
    locale.value = value;
  }
});

const localeOptions = computed(() =>
  SUPPORTED_LOCALES.map((value) => ({
    value,
    label: t(`app.locales.${value}`)
  }))
);

watch(locale, (nextLocale) => {
  if (SUPPORTED_LOCALES.includes(nextLocale as SupportedLocale)) {
    persistLocale(nextLocale as SupportedLocale);
  }
});
</script>

<style scoped>
.app {
  padding: 2.5rem 1.5rem 3rem;
  max-width: 960px;
  margin: 0 auto;
}

.app.embed {
  padding: 0.75rem;
  max-width: none;
}

.app.widget {
  padding: 0;
  max-width: none;
}

.app.widget .flash-panel {
  border-radius: 0;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
  padding: 1rem;
  gap: 1rem;
}

/* 卡片头部已经写了标题，面板内重复的标题和副标题去掉 */
.app.widget :deep(.panel-head) {
  display: none;
}

.hero {
  margin-bottom: 2rem;
  display: grid;
  gap: 1rem;
}

.hero-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-title {
  font-size: 2.5rem;
  margin: 0;
}

.module-tabs {
  display: inline-flex;
  gap: 0.4rem;
  padding: 0.3rem;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.25);
  width: fit-content;
}

.module-tab {
  border: none;
  background: transparent;
  color: #cbd5f5;
  padding: 0.55rem 1.4rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.module-tab:hover {
  color: #f8fafc;
  background: rgba(37, 99, 235, 0.25);
}

.module-tab.active {
  background: rgba(37, 99, 235, 0.9);
  color: #f8fafc;
}

.locale-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.locale-select {
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.9);
  color: #f8fafc;
  padding: 0 0.75rem;
  font-size: 0.95rem;
}

.locale-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.35);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
