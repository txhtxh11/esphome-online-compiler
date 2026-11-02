import { shallowRef } from 'vue';
import type { FirmwareFile } from './zip-extract';

export type ChipFamily = 'ESP32' | 'ESP8266';

/** 编译模块产出的固件，供烧录模块直接复用，避免再下载一次。 */
export const compiledFirmwareFiles = shallowRef<FirmwareFile[]>([]);

/** 从编译用 YAML 推断出的芯片类型，烧录时作为默认值。 */
export const compiledChipFamily = shallowRef<ChipFamily>('ESP8266');

export function setCompiledFirmware(files: FirmwareFile[], chipFamily: ChipFamily) {
  compiledFirmwareFiles.value = files;
  compiledChipFamily.value = chipFamily;
}

export function clearCompiledFirmware() {
  compiledFirmwareFiles.value = [];
}

/** 从 ESPHome YAML 里识别平台，识别不出时按 ESP8266 处理。 */
export function detectChipFamily(yaml: string): ChipFamily {
  if (/^\s*esp32\s*[a-z0-9_]*\s*:/m.test(yaml)) {
    return 'ESP32';
  }
  if (/^\s*esp8266\s*:/m.test(yaml)) {
    return 'ESP8266';
  }
  return 'ESP8266';
}
