import { readFile, writeFile } from 'fs/promises';
import ora from 'ora-classic';
import { resolve } from 'path';
import type { JSONOutput } from 'typedoc';
import { ProjectParser } from '../../lib/structures/ProjectParser';
import type { Options } from '../lib/types/Options';

export async function parseDocs(options: Options) {
  const spinner = ora('Parsing TypeDoc JSON output').start();

  const project = JSON.parse(await readFile(resolve(process.cwd(), options.json), 'utf-8')) as JSONOutput.ProjectReflection;
  const parsed = new ProjectParser(project).toJSON();

  try {
    await writeFile(resolve(process.cwd(), options.json), JSON.stringify(parsed, null, 2));
  } catch (error) {
    const cause = error as Error;

    spinner.fail(`Failed to parse TypeDoc JSON output`);

    if (options.verbose) console.log(cause.stack ?? cause.message);

    process.exit(1);
  }

  spinner.succeed('Parsed TypeDoc JSON output');
}
