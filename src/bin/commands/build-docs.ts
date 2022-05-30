import { exec as execSync } from 'child_process';
import ora from 'ora-classic';
import { promisify } from 'util';
import type { Options } from '../lib/types/Options';

const exec = promisify(execSync);

export async function buildDocs(options: Options) {
  const spinner = ora('Building TypeDoc documentation').start();

  try {
    await exec(`typedoc --json ${options.json}`, { cwd: process.cwd() });
  } catch (error) {
    const cause = error as Error;

    spinner.fail(`Failed to build TypeDoc documentation`);

    if (options.verbose) console.log(cause.stack ?? cause.message);

    process.exit(1);
  }

  spinner.succeed('Successfully built TypeDoc documentation');
}
