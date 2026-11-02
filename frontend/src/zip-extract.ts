import { unzipSync } from 'fflate';

export type FirmwareFile = {
  name: string;
  size: number;
  data: Uint8Array;
};

const FIRMWARE_EXTENSIONS = ['.bin', '.uf2'];

const RECOMMENDED_ORDER = ['firmware.factory.bin', 'firmware.bin'];

function basename(path: string): string {
  const segments = path.split('/');
  return segments[segments.length - 1] ?? path;
}

function isFirmwareFile(name: string): boolean {
  const lower = name.toLowerCase();
  return FIRMWARE_EXTENSIONS.some((extension) => lower.endsWith(extension));
}

/**
 * GitHub Actions 的 artifact 下载接口固定返回 zip 包装，这里在浏览器内解开，
 * 只保留原始固件文件，让用户拿到的始终是可直接刷写的 .bin。
 */
export function extractFirmwareFiles(archive: ArrayBuffer): FirmwareFile[] {
  const entries = unzipSync(new Uint8Array(archive));
  const files: FirmwareFile[] = [];

  for (const [path, data] of Object.entries(entries)) {
    const name = basename(path);
    if (!name || path.endsWith('/') || !isFirmwareFile(name)) {
      continue;
    }
    files.push({ name, size: data.length, data });
  }

  return files.sort((left, right) => left.name.localeCompare(right.name));
}

/** 优先推荐 factory 合并镜像（首次 USB 刷写），其次常规 OTA 镜像。 */
export function pickRecommendedFirmware(files: FirmwareFile[]): FirmwareFile | null {
  for (const preferred of RECOMMENDED_ORDER) {
    const match = files.find((file) => file.name.toLowerCase() === preferred);
    if (match) {
      return match;
    }
  }
  return files[0] ?? null;
}
