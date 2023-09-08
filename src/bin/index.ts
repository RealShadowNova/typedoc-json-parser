#!/usr/bin/env node

import { bold, red } from 'colorette';
import { Command } from 'commander';
import { buildDocs } from './commands/build-docs';
import { checkRepository } from './commands/check-repository';
import { migrateDocs } from './commands/migrate-docs';
import { parseDocs } from './commands/parse-docs';
import { parseOptions } from './lib/parseOptions';
import type { Options, RequiredExcept } from './lib/types';

async function run() {
  const command = new Command()
    .option('--json [path]', 'Path to the TypeDoc JSON output file to parse')
    .option('--migrate [path]', 'Path to the directory containing TypeDoc JSON Parser output files to migrate')
    .option('-v, --verbose', 'Print verbose information', false);

  const program = command.parse(process.argv);
  const options = await parseOptions(program.opts<Partial<Options>>());

  if (options.verbose) {
    console.log(`Resolved Options:`, options);
  }

  if (!Reflect.has(options, 'json') && !Reflect.has(options, 'migrate')) {
    console.error(red(`${bold('[ERROR]')} You must specify either the --json or --migrate option`));
  }

  // Check if the current working directory is a Node.js repository.
  await checkRepository(options);

  if (options.migrate) {
    await migrateDocs(options as RequiredExcept<Options, 'json'>);
  } else if (options.json) {
    // Build the TypeDoc documentation.
    await buildDocs(options);

    // Parse the TypeDoc JSON output.
    await parseDocs(options as RequiredExcept<Options, 'migrate'>);
  }
}

void run();
