import * as jetpack from 'fs-jetpack';
import * as md5File from 'md5-file';
import * as path from 'path';

const md5Cache: Set<string> = new Set();

export function write(path: string, contents: string) {
  jetpack.write(path, contents);
}

export function copyLicenseFile(licenseFile: string, licenseFolder: string, out: string): string {
  const md5 = md5File.sync(licenseFile);
  const licenseFilePath = path.join(licenseFolder, md5, 'LICENSE');

  if (!md5Cache.has(md5)) {
    jetpack.copy(licenseFile, path.join(out, licenseFilePath));
    md5Cache.add(md5);
  }

  return licenseFilePath;
}
