import { Spinner } from '@favware/colorette-spinner';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { JSONOutput } from 'typedoc';
import { ProjectParser } from '../../lib/structures/ProjectParser';
import type { Options, RequiredExcept } from '../lib/types';

export async function parseDocs(options: RequiredExcept<Options, 'migrate'>) {
  const spinner = new Spinner().start({ text: 'Parsing TypeDoc JSON output file' });

  try {
    const { version } = JSON.parse(await readFile(resolve(process.cwd(), 'package.json'), 'utf8'));
    const readme = existsSync(resolve(process.cwd(), 'README.md')) ? await readFile(resolve(process.cwd(), 'README.md'), 'utf8') : undefined;
    const changelog = existsSync(resolve(process.cwd(), 'CHANGELOG.md')) ? await readFile(resolve(process.cwd(), 'CHANGELOG.md'), 'utf8') : undefined;
    const data = JSON.parse(await readFile(resolve(process.cwd(), options.json), 'utf-8')) as JSONOutput.ProjectReflection;
    const parsed = new ProjectParser({ data, version, readme, changelog }).toJSON();

    await writeFile(resolve(process.cwd(), options.json), JSON.stringify(parsed, null, 2));

    spinner.success({ text: 'Parsed TypeDoc JSON output file' });
  } catch (error) {
    const cause = error as Error;

    if (options.verbose) {
      spinner.error({ text: 'Failed to parse TypeDoc JSON output file.' });
      console.log(cause.stack ?? cause.message);
    } else {
      spinner.error({ text: 'Failed to parse TypeDoc JSON output file. Add the --verbose flag to view these errors.' });
    }

    process.exit(1);
  }
}
