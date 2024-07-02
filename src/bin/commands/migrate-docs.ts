import { MigrationStatus, migrateToLatest, type MigrationResult } from '#bin/lib/migrateToLatest';
import type { Options } from '#bin/lib/types/Options';
import type { RequiredExcept } from '#bin/lib/types/RequiredExcept';
import { ProjectParser } from '#lib/structures/ProjectParser';
import { Spinner } from '@favware/colorette-spinner';
import { findFilesRecursivelyStringEndsWith } from '@sapphire/node-utilities';
import { blue, green, red, yellow } from 'colorette';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const isCI =
  process.env.CI ||
  process.env.WT_SESSION ||
  process.env.ConEmuTask === '{cmd::Cmder}' ||
  process.env.TERM_PROGRAM === 'vscode' ||
  process.env.TERM === 'xterm-256color' ||
  process.env.TERM === 'alacritty';

const supportUnicode = process.platform === 'win32' ? isCI : process.env.TERM !== 'linux';
const tick = supportUnicode ? '✔' : '√';
const cross = supportUnicode ? '✖' : '×';

export async function migrateDocs(options: RequiredExcept<Options, 'json'>) {
  const spinner = new Spinner().start({ text: 'Migrating TypeDoc JSON Parser output files' });
  const results: MigrationResult[] = [];

  try {
    const directory = resolve(process.cwd(), options.migrate);

    for await (const path of findFilesRecursivelyStringEndsWith(directory, '.json')) {
      const data = JSON.parse(await readFile(path, 'utf-8'));

      if ('typeDocJsonParserVersion' in data && data.typeDocJsonParserVersion === ProjectParser.version) {
        results.push({ status: MigrationStatus.Latest, path, name: data.name, version: data.version });
        continue;
      }

      const result = migrateToLatest(data, path);

      results.push(result);
    }
  } catch {}

  spinner.stop({ text: 'Finished migrating TypeDoc JSON Parser output files. Results:' });

  const failedAny = results.some((result) => result.status === MigrationStatus.Failed);

  for (const result of results) {
    switch (result.status) {
      case MigrationStatus.Success:
        if (failedAny) {
          console.log(yellow(`${tick} ${result.data.name}(${result.data.version}) - Skipping due to other failures. "${result.path}"`));
        } else {
          console.log(green(`${tick} ${result.data.name}(${result.data.version}) - "${result.path}`));

          await writeFile(result.path, JSON.stringify(result.data, null, 2), 'utf-8');
        }

        break;

      case MigrationStatus.Failed:
        console.log(
          red(`${cross} ${result.name}(${result.version}) - Unknown "typedoc-json-parser" version found. Received "${result.from}". "${result.path}"`)
        );

        break;

      case MigrationStatus.Latest:
        console.log(blue(`${tick} ${result.name}(${result.version}) - "${result.path}`));

        break;
    }
  }
}
