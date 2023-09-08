import type { Options } from '#bin/lib/types';
import { Spinner } from '@favware/colorette-spinner';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export async function checkRepository(options: Options) {
  const spinner = new Spinner().start({ text: 'Checking if "package.json" exists in the current working directory' });
  const packageJsonExists = existsSync(resolve(process.cwd(), 'package.json'));

  if (!packageJsonExists) {
    spinner.error({ text: 'Could not find "package.json" in the current working directory. Are you sure this is a Node.js repository?' });

    if (options.verbose) {
      console.log('I detected this current working directory: ', process.cwd());
    }

    process.exit(1);
  }

  spinner.success({ text: 'Found "package.json" in the current working directory' });

  return Promise.resolve();
}
