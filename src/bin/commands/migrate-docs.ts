import { Spinner } from '@favware/colorette-spinner';
import { findFilesRecursivelyStringEndsWith } from '@sapphire/node-utilities';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { migrateProjectJson } from '../lib/migrateProjectJson';
import type { Options } from '../lib/types/Options';
import type { RequiredExcept } from '../lib/types/RequiredExcept';

export async function migrateDocs(options: RequiredExcept<Options, 'json'>) {
  const spinner = new Spinner().start({ text: 'Migrating TypeDoc JSON Parser output files' });

  try {
    const directory = resolve(process.cwd(), options.migrate);
    let migratedFiles = 0;

    for await (const path of findFilesRecursivelyStringEndsWith(directory, '.json')) {
      const data = JSON.parse(await readFile(path, 'utf-8'));

      if ('typeDocJsonParserVersion' in data) {
        const migrated = migrateProjectJson(data);

        if (migrated) {
          await writeFile(path, JSON.stringify(migrated, null, 2), 'utf-8');

          migratedFiles++;
        }
      }
    }

    spinner.success({ text: `Migrated ${migratedFiles} TypeDoc JSON Parser output files` });
  } catch (error) {
    const cause = error as Error;

    spinner.error({ text: 'Failed to migrate TypeDoc JSON Parser output' });

    if (options.verbose) console.log(cause.stack ?? cause.message);

    process.exit(1);
  }
}
