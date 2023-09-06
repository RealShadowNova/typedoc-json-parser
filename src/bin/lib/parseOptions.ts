import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { readJson } from './readJson';
import { readYaml } from './readYaml';
import type { Options } from './types';

export const typedocJsonParserRcPath = join(process.cwd(), '.typedoc-json-parserrc');

export const typedocJsonParserRcJsonPath = `${typedocJsonParserRcPath}.json`;

export const typedocJsonParserRcYmlPath = `${typedocJsonParserRcPath}.yml`;

export const typedocJsonParserRcYamlPath = `${typedocJsonParserRcPath}.yaml`;

export async function parseOptions(options: Partial<Options>): Promise<Options> {
  const typedocJsonParserRcExists = existsSync(typedocJsonParserRcPath);
  const typedocJsonParserRcJsonExists = existsSync(typedocJsonParserRcJsonPath);
  const typedocJsonParserRcYmlExists = existsSync(typedocJsonParserRcYmlPath);
  const typedocJsonParserRcYamlExists = existsSync(typedocJsonParserRcYamlPath);

  if (typedocJsonParserRcYmlExists || typedocJsonParserRcYamlExists) {
    try {
      options = { ...(await readYaml(typedocJsonParserRcYmlExists ? typedocJsonParserRcYmlPath : typedocJsonParserRcYamlPath)), ...options };
    } catch (error) {
      const cause = error as Error;

      console.log('Failed to parse yaml config file');

      if (options.verbose) {
        console.log(cause.stack ?? cause.message);
      }

      process.exit(1);
    }
  } else if (typedocJsonParserRcExists || typedocJsonParserRcJsonExists) {
    try {
      options = { ...(await readJson(typedocJsonParserRcExists ? typedocJsonParserRcPath : typedocJsonParserRcJsonPath)), ...options };
    } catch (error) {
      const cause = error as Error;

      console.log('Failed to parse json config file');

      if (options.verbose) {
        console.log(cause.stack ?? cause.message);
      }

      process.exit(1);
    }
  }

  return options as Options;
}
