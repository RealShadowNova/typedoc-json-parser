#!/usr/bin/env node

import { Command } from 'commander';
import { buildDocs } from './commands/build-docs';
import { checkRepository } from './commands/check-repository';
import { parseDocs } from './commands/parse-docs';
import { parseOptions } from './lib/parseOptions';
import type { Options } from './lib/types/Options';

async function run() {
  const command = new Command()
    .option('-j, --json <path>', 'Path to the TypeDoc JSON output file.')
    .option('-v, --verbose', 'Print verbose information', false);

  const program = command.parse(process.argv);
  const options = await parseOptions(program.opts<Partial<Options>>());

  if (options.verbose) console.log(`Resolved Options:`, options);
  if (!Reflect.has(options, 'json')) throw new Error('Missing required option: --json');

  // Check if the current working directory is a Node.js repository.
  await checkRepository(options);

  // Build the TypeDoc documentation.
  await buildDocs(options);

  // Parse the TypeDoc JSON output.
  await parseDocs(options);
}

void run();
