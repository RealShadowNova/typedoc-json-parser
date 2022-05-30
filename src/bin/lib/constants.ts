import { join } from 'node:path';

export const typedocJsonParserRcPath = join(process.cwd(), '.typedoc-json-parserrc');

export const typedocJsonParserRcJsonPath = `${typedocJsonParserRcPath}.json`;

export const typedocJsonParserRcYmlPath = `${typedocJsonParserRcPath}.yml`;

export const typedocJsonParserRcYamlPath = `${typedocJsonParserRcPath}.yaml`;
