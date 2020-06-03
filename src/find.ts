import {init, InitOpts, ModuleInfos} from 'license-checker';

export async function findModules(opts: InitOpts): Promise<ModuleInfos> {
  return new Promise((resolve, reject) => {
    init(opts, (err: Error, packages: ModuleInfos) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(packages);
      }
    });
  });
}
