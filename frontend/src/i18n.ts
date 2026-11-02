import { createI18n } from 'vue-i18n';

export const LOCALE_STORAGE_KEY = 'esphome-online-compiler:locale';
export const SUPPORTED_LOCALES = ['en', 'zh'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const FALLBACK_LOCALE: SupportedLocale = 'en';

const messages = {
  en: {
    app: {
      title: 'ESPHome Online Compiler',
      localeLabel: 'Language',
      locales: {
        en: 'English',
        zh: '中文'
      },
      tabs: {
        compile: 'Compile',
        flash: 'Flash'
      }
    },
    compileForm: {
      loading: 'Loading...',
      missingScopes:
        'The current authorization is missing the following scopes: {scopes}. Please sign out and authorize again.',
      fields: {
        yaml: {
          label: 'ESPHome YAML'
        },
        esphomeVersion: {
          label: 'ESPHome Version',
          customPlaceholder: 'Example: 2025.10.1',
          hint: 'Leave empty to use the latest stable release, or enter a specific version to compile an earlier release.',
          options: {
            latest: 'Latest stable (auto)',
            custom: 'Custom...'
          },
          defaultLabel: 'Latest stable'
        }
      },
      secrets: {
        title: 'Secret Replacement',
        description:
          'Detected <code>!secret</code> placeholders in your YAML. Provide the actual values below.',
        inputPlaceholder: 'Enter value',
        missing: 'Still missing {count} secret value(s): {names}'
      },
      actions: {
        hideSecret: 'Hide',
        showSecret: 'Show',
        submitting: 'Submitting...',
        submit: 'Start compilation',
        reset: 'Reset'
      },
      auth: {
        avatarAlt: 'User avatar',
        logout: 'Sign out',
        login: 'Authorize with personal GitHub',
        encouragePersonal:
          'The platform GitHub authorization is unavailable right now. Please continue with your personal GitHub.'
      },
      submitHints: {
        loginRequired: 'Please authorize with GitHub before submitting a build.',
        missingScopes:
          'Your GitHub authorization is missing the workflow/public_repo permissions. Please re-authorize.'
      },
      status: {
        sectionTitle: 'Compilation Status',
        requestId: 'Request ID:',
        runId: 'Workflow Run ID:',
        currentStatus: 'Current status:',
        runLinkLabel: 'GitHub Workflow:',
        openRun: 'Open',
        esphomeVersion: 'ESPHome version:',
        firmware: 'Firmware:',
        prepareFirmware: 'Prepare .bin files',
        preparing: 'Preparing firmware...',
        downloadFirmware: 'Download {name}',
        firmwareListHint: 'Compiled firmware (download the .bin you need):',
        saveFile: 'Save',
        workflowQueued: 'Workflow triggered. Waiting to run...',
        errorLogs: 'Error Logs',
        loadingLogs: 'Loading error logs...'
      },
      statusDisplay: {
        notStarted: 'Not started',
        completed: 'Completed',
        status: {
          queued: 'Queued',
          in_progress: 'In progress',
          waiting: 'Waiting',
          pending: 'Pending',
          requested: 'Requested'
        },
        conclusion: {
          success: 'Succeeded',
          failure: 'Failed',
          cancelled: 'Cancelled',
          timed_out: 'Timed out',
          neutral: 'Neutral',
          skipped: 'Skipped',
          action_required: 'Action required',
          stale: 'Stale',
          startup_failure: 'Startup failure'
        }
      },
      errors: {
        invalidYaml: 'Please provide valid YAML content.',
        loginRequired: 'Please sign in with GitHub before submitting a build.',
        missingScopes: 'Your GitHub authorization is missing required permissions. Please re-authorize.',
        secretsMissing: 'Provide values for the following secrets: {names}',
        yamlTooLarge: 'The YAML file is too large. Keep it under 200KB.',
        triggerFailed: 'Failed to trigger the workflow. Please try again later.',
        statusFailed: 'Failed to refresh the workflow status.',
        downloadFailed: 'Failed to download the firmware. Check your permissions or try again later.',
        firmwareExtractFailed: 'Failed to unpack the firmware binaries. Please download from the Workflow page instead.'
      }
    },
    flash: {
      title: 'Flash Firmware',
      subtitle: 'Flash from the browser over Web Serial / WebUSB — no desktop flashing tool needed.',
      source: {
        title: 'Firmware Source',
        compiled: 'Latest compilation',
        file: 'Local .bin file',
        empty: 'Nothing compiled yet. Run a build in the Compile tab, or choose a local .bin file.',
        factoryHint: 'For a first USB flash choose firmware.factory.bin; for OTA use firmware.bin.',
        selectFile: 'Choose a .bin file',
        invalidFile: 'Only .bin files are supported.'
      },
      chip: {
        label: 'Chip family',
        hint: 'Match the chip on your board — a wrong choice will not boot.'
      },
      button: {
        ready: 'Connect device and flash',
        unsupported: 'This browser does not support Web Serial / WebUSB. Use Chrome or Edge.',
        notAllowed: 'Flashing requires HTTPS or localhost.'
      },
      status: {
        noFirmware: 'Select a firmware file first.',
        loadingFirmware: 'Loading firmware…',
        artifactFailed: 'Could not load the firmware passed in by the previous page. Pick a local .bin instead.',
        unsupportedBrowser:
          'This browser cannot flash from the web. Use Chrome or Edge on a computer, or Chrome for Android with OTG enabled.',
        loading: 'Loading the flashing component…',
        ready: 'Ready: {name}',
        failed: 'Failed to load the flashing component. Check your network and try again.'
      },
      tips: {
        title: 'Flashing Notes',
        computerTitle: 'On a computer',
        computer1: 'ESP8266: hold FLASH while powering on; ESP32 usually enters download mode automatically.',
        computer2: 'Click the button and pick the serial port (COMx / USB-Serial) in the dialog.',
        computer3: 'Wait for flashing to finish (30 s – 2 min) and do not unplug the cable.',
        computer4: 'A Wi-Fi setup dialog opens afterwards — enter your SSID and password.',
        computer5: 'In the iPhone Home app tap "+" and scan the pairing code 111-22-333.',
        androidTitle: 'On Android',
        android1: 'Use a USB OTG adapter to connect the board to your phone.',
        android2: 'Enable OTG in the phone settings (search for "OTG").',
        android3: 'Open this page over HTTPS in Chrome for Android.',
        android4: 'Tap the button and authorize the USB device in the dialog.',
        android5: 'iOS cannot flash from the browser — use Wi-Fi OTA instead.',
        iosNote: 'iPhone and iPad do not support web flashing; use Wi-Fi OTA.'
      }
    }
  },
  zh: {
    app: {
      title: 'ESPHome 在线编译',
      localeLabel: '语言',
      locales: {
        en: '英语',
        zh: '中文'
      },
      tabs: {
        compile: '在线编译',
        flash: '在线烧录'
      }
    },
    compileForm: {
      loading: '正在加载...',
      missingScopes: '当前授权缺少以下 scope：{scopes}，请退出后重新授权。',
      fields: {
        yaml: {
          label: 'ESPHome YAML'
        },
        esphomeVersion: {
          label: 'ESPHome 版本',
          customPlaceholder: '例如 2025.10.1',
          hint: '留空将使用最新稳定版，也可输入具体版本号编译历史版本。',
          options: {
            latest: '最新稳定版（自动）',
            custom: '自定义...'
          },
          defaultLabel: '最新稳定版'
        }
      },
      secrets: {
        title: 'Secret 替换',
        description:
          '检测到 YAML 中包含 <code>!secret</code> 占位符，请在下方填写对应的真实值。',
        inputPlaceholder: '请输入值',
        missing: '仍有 {count} 个 secret 未填写：{names}'
      },
      actions: {
        hideSecret: '隐藏',
        showSecret: '显示',
        submitting: '正在提交...',
        submit: '提交编译',
        reset: '重置'
      },
      auth: {
        avatarAlt: '用户头像',
        logout: '退出',
        login: '个人 GitHub 授权',
        encouragePersonal: '平台 GitHub 授权当前不可用，请使用个人 GitHub 授权继续编译。'
      },
      submitHints: {
        loginRequired: '请先完成 GitHub 授权后再提交编译。',
        missingScopes: '当前 GitHub 授权缺少 workflow/public_repo 权限，请重新授权后再试。'
      },
      status: {
        sectionTitle: '编译状态',
        requestId: '请求 ID:',
        runId: 'Workflow Run ID:',
        currentStatus: '当前状态:',
        runLinkLabel: 'GitHub Workflow:',
        openRun: '打开',
        esphomeVersion: 'ESPHome 版本:',
        firmware: '固件下载:',
        prepareFirmware: '获取 .bin 固件',
        preparing: '正在准备固件...',
        downloadFirmware: '下载 {name}',
        firmwareListHint: '编译产出的固件（按需下载，无需解压）：',
        saveFile: '保存',
        workflowQueued: 'Workflow 已触发，等待运行...',
        errorLogs: '错误日志',
        loadingLogs: '正在加载错误日志...'
      },
      statusDisplay: {
        notStarted: '尚未开始',
        completed: '完成',
        status: {
          queued: '排队中',
          in_progress: '运行中',
          waiting: '等待中',
          pending: '准备中',
          requested: '已请求'
        },
        conclusion: {
          success: '完成',
          failure: '失败',
          cancelled: '已取消',
          timed_out: '超时',
          neutral: '中性',
          skipped: '已跳过',
          action_required: '需要操作',
          stale: '已过期',
          startup_failure: '启动失败'
        }
      },
      errors: {
        invalidYaml: '请输入有效的 YAML 内容。',
        loginRequired: '请先登录 GitHub 后再提交编译。',
        missingScopes: '当前授权缺少必要的 GitHub 权限，请重新授权。',
        secretsMissing: '请为以下 secret 提供具体值：{names}',
        yamlTooLarge: 'YAML 太大，请控制在 200KB 内。',
        triggerFailed: '触发编译失败，请稍后再试。',
        statusFailed: '获取状态失败。',
        downloadFailed: '下载固件失败，请检查权限或稍后重试。',
        firmwareExtractFailed: '固件解包失败，请到 Workflow 页面手动下载产物。'
      }
    },
    flash: {
      title: '在线烧录',
      subtitle: '通过 Web Serial / WebUSB 直接从浏览器烧录，无需安装任何桌面工具。',
      source: {
        title: '固件来源',
        compiled: '本次编译结果',
        file: '本地 .bin 文件',
        empty: '还没有编译结果。先到「在线编译」模块编译一次，或选择一个本地 .bin 文件。',
        factoryHint: '首次 USB 烧录请选 firmware.factory.bin；OTA 升级请用 firmware.bin。',
        selectFile: '选择 .bin 文件',
        invalidFile: '只支持 .bin 文件。'
      },
      chip: {
        label: '芯片类型',
        hint: '必须与板子实际芯片一致，选错会无法启动。'
      },
      button: {
        ready: '连接设备并烧录',
        unsupported: '当前浏览器不支持 Web Serial / WebUSB，请使用 Chrome 或 Edge。',
        notAllowed: '需要 HTTPS 或 localhost 才能烧录。'
      },
      status: {
        noFirmware: '请先选择固件。',
        loadingFirmware: '正在加载固件…',
        artifactFailed: '加载上一页传入的固件失败，请改用本地 .bin 文件。',
        unsupportedBrowser: '当前浏览器无法网页烧录，请用电脑 Chrome / Edge，或安卓 Chrome 并开启 OTG。',
        loading: '正在加载烧录组件…',
        ready: '已就绪：{name}',
        failed: '烧录组件加载失败，请检查网络后重试。'
      },
      tips: {
        title: '烧录提示',
        computerTitle: '电脑烧录',
        computer1: 'ESP8266 按住 Flash 键再上电；ESP32 通常自动进入下载模式。',
        computer2: '点上面按钮，在弹窗里选择对应的串口（一般是 COMx / USB-Serial）。',
        computer3: '等待烧录完成（约 30 秒～2 分钟），过程中不要拔线。',
        computer4: '烧录完成后会弹出 WiFi 配网窗口，输入 WiFi 名称和密码。',
        computer5: 'iPhone 家庭 App 右上角「+」扫码，配对码 111-22-333。',
        androidTitle: '安卓手机烧录',
        android1: '准备 USB OTG 转接线，连接开发板与手机。',
        android2: '在手机设置中搜索并开启 OTG。',
        android3: '用 Chrome for Android 通过 HTTPS 打开本页。',
        android4: '点按钮，在弹窗中授权 USB 设备后开始烧录。',
        android5: 'iPhone / iPad 不支持网页烧录，请改用 WiFi OTA。',
        iosNote: 'iPhone 和 iPad 不支持网页烧录，请使用 WiFi OTA。'
      }
    }
  }
} as const;

function isSupportedLocale(locale: string | null | undefined): locale is SupportedLocale {
  if (!locale) {
    return false;
  }
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

function readStoredLocale(): SupportedLocale | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isSupportedLocale(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to load stored locale', error);
  }
  return null;
}

function detectBrowserLocale(): SupportedLocale {
  if (typeof window === 'undefined') {
    return FALLBACK_LOCALE;
  }

  const stored = readStoredLocale();
  if (stored) {
    return stored;
  }

  const browserLocales = window.navigator.languages ?? [window.navigator.language];

  for (const locale of browserLocales) {
    if (!locale) continue;
    const normalized = locale.toLowerCase();
    if (isSupportedLocale(normalized)) {
      return normalized;
    }
    const base = normalized.split('-')[0];
    if (isSupportedLocale(base)) {
      return base;
    }
  }

  return FALLBACK_LOCALE;
}

export function persistLocale(locale: SupportedLocale) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.warn('Failed to persist locale', error);
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: detectBrowserLocale(),
  fallbackLocale: FALLBACK_LOCALE,
  messages
});
