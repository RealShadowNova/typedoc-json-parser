import { Spinner } from '@favware/colorette-spinner';
import { findFilesRecursivelyStringEndsWith } from '@sapphire/node-utilities';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ProjectParser } from '../../lib/structures/ProjectParser';
import { migrateProjectJson } from '../lib/migrateProjectJson';
import type { Options, RequiredExcept } from '../lib/types';

export async function migrateDocs(options: RequiredExcept<Options, 'json'>) {
  const spinner = new Spinner().start({ text: 'Migrating TypeDoc JSON Parser output files' });

  try {
    const directory = resolve(process.cwd(), options.migrate);
    let migratedFiles = 0;
    const warnings = [];

    for await (const path of findFilesRecursivelyStringEndsWith(directory, '.json')) {
      const data = JSON.parse(await readFile(path, 'utf-8'));

      if ('typeDocJsonParserVersion' in data && data.typeDocJsonParserVersion === ProjectParser.version) continue;

      const migrated = migrateProjectJson(data);

      if (typeof migrated === 'string') {
        warnings.push(migrated);
      } else {
        await writeFile(path, JSON.stringify(migrated, null, 2), 'utf-8');

        migratedFiles++;
      }
    }

    spinner.success({ text: `Migrated ${migratedFiles} TypeDoc JSON Parser output files` });

    for (const warning of warnings) console.warn(warning);
  } catch (error) {
    const cause = error as Error;

    spinner.error({ text: 'Failed to migrate TypeDoc JSON Parser output' });

    if (options.verbose) console.log(cause.stack ?? cause.message);

    process.exit(1);
  }
}
