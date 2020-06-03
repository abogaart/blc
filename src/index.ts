import {Command, flags} from '@oclif/command';
import {InitOpts} from 'license-checker';

import * as os from 'os';
import * as path from 'path';

import {findModules} from './find';
import {copyLicenseFile, write} from './write';

function toFileEntry(label: string, value: string | string[] | undefined) {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    value = value.join(', ');
  }

  return `${label}: ${value}`;
}

class Blc extends Command {
  static description = 'aggregate license information of your module and its dependencies'

  static flags = {
    file: flags.string({char: 'f', default: 'ADDITIONAL-LICENSES'}),
    licenseFolder: flags.string({char: 'l', default: 'licenses'}),
    production: flags.boolean({char: 'p'}),
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  }

  static args = [
    {name: 'start', default: process.cwd()},
    {name: 'out', default: process.cwd()},
  ];

  async run() {
    const {args, flags} = this.parse(Blc);

    const opts: InitOpts = {
      customPath: path.join(__dirname, 'format.json'),
      start: args.start,
      production: flags.production,
    };

    this.debug('Running with options', opts);

    try {
      const modules = Object.entries(await findModules(opts));
      if (modules.length === 0) {
        this.log('No modules found');
        return;
      }

      let licenseFileContents = `The following NPM packages may be included in this product:${os.EOL}${os.EOL}`;
      modules.forEach(([name, module]) => {
        if (!module.licenseFile) {
          this.warn(`Skipping ${name} with unknown/undefined license`);
          return;
        }

        module.licenseFile = copyLicenseFile(module.licenseFile, flags.licenseFolder, args.out);

        licenseFileContents += [
          toFileEntry('name', module.name),
          toFileEntry('version', `${module.version}`),
          toFileEntry('repository', module.repository),
          toFileEntry('copyright', (module as any).copyright),
          toFileEntry('license', module.licenses),
          toFileEntry('license file', module.licenseFile),
          `${os.EOL}${'*'.repeat(60)}${os.EOL}${os.EOL}`,
        ].filter(Boolean).join(os.EOL);
      });

      write(path.join(args.out, flags.file), licenseFileContents);
    } catch (error) {
      this.error(error);
    }
  }
}

export = Blc
