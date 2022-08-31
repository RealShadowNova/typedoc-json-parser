import { Spinner } from '@favware/colorette-spinner';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { JSONOutput } from 'typedoc';
import { ProjectParser } from '../../lib/structures/ProjectParser';
import type { Options } from '../lib/types/Options';

export async function parseDocs(options: Options) {
  const spinner = new Spinner().start({ text: 'Parsing TypeDoc JSON output' });
  const { version } = JSON.parse(await readFile(resolve(process.cwd(), 'package.json'), 'utf8'));
  const readme = existsSync(resolve(process.cwd(), 'README.md')) ? await readFile(resolve(process.cwd(), 'README.md'), 'utf8') : undefined;
  const data = JSON.parse(await readFile(resolve(process.cwd(), options.json), 'utf-8')) as JSONOutput.ProjectReflection;
  const parsed = new ProjectParser({ data, version, readme }).toJSON();

  try {
    await writeFile(resolve(process.cwd(), options.json), JSON.stringify(parsed, null, 2));
  } catch (error) {
    const cause = error as Error;

    spinner.error({ text: 'Failed to parse TypeDoc JSON output' });

    if (options.verbose) console.log(cause.stack ?? cause.message);

    process.exit(1);
  }

  spinner.success({ text: 'Parsed TypeDoc JSON output' });
}
