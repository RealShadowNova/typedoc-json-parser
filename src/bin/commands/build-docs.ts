import { Spinner } from '@favware/colorette-spinner';
import { exec as execSync } from 'node:child_process';
import { promisify } from 'node:util';
import type { Options } from '../lib/types';

const exec = promisify(execSync);

export async function buildDocs(options: Options) {
  const spinner = new Spinner().start({ text: 'Building TypeDoc documentation' });

  try {
    await exec(`typedoc --json ${options.json}`);
  } catch (error) {
    const cause = error as Error;

    if (options.verbose) {
      spinner.error({ text: 'Failed to build TypeDoc documentation' });
      console.log(cause.stack ?? cause.message);
    } else {
      spinner.error({ text: 'Failed to build TypeDoc documentation. Add the --verbose flag to view these errors.' });
    }

    process.exit(1);
  }

  spinner.success({ text: 'Successfully built TypeDoc documentation' });
}
