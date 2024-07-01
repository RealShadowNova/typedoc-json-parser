import { exec } from '#bin/lib/exec';
import type { Options } from '#bin/lib/types';
import { Spinner } from '@favware/colorette-spinner';

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
