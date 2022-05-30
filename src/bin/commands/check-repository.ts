import { existsSync } from 'fs';
import ora from 'ora-classic';
import { resolve } from 'path';
import type { Options } from '../lib/types/Options';

export async function checkRepository(options: Options) {
  const spinner = ora('Checking if "package.json" exists in the current working directory').start();
  const packageJsonExists = existsSync(resolve(process.cwd(), 'package.json'));

  if (!packageJsonExists) {
    spinner.fail('Could not find "package.json" in the current working directory. Are you sure this is a Node.js repository?');

    if (options.verbose) console.log('I detected this current working directory: ', process.cwd());

    process.exit(1);
  }

  spinner.succeed('Found "package.json" in the current working directory');

  return Promise.resolve();
}
