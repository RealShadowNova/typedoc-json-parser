<div align="center">

# TypeDoc JSON Parser

**A package to parse TypeDoc JSON output.**

[![GitHub](https://img.shields.io/github/license/RealShadowNova/typedoc-json-parser)](https://github.com/RealShadowNova/typedoc-json-parserblob/main/LICENSE.md)
[![npm](https://img.shields.io/npm/v/typedoc-json-parser?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/typedoc-json-parser)

[![Support Server](https://discord.com/api/guilds/554742955898961930/embed.png?style=banner2)](https://discord.gg/fERY6AenEv)

</div>

---

## Description

When creating a library in TypeScript, you will often need to create documentation. Very commonly you'll find yourself using [TypeDoc](https://typedoc.org) to generate documentation. However, TypeDoc's JSON output is not very useful for parsing. This package makes this entire process of utilizing the JSON output of TypeDoc a lot easier.

## Installation

You can use the following command to install this package, or replace `npm install -D` with your package manager of choice.

```sh
npm install -D typedoc-json-parser typedoc
```

## Prerequisites

Before using this package's CLI you'll need to have [TypeDoc](https://typedoc.org) setup correctly.

Here is an example `typedoc.json` taken from our package's repository.

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "entryPoints": ["src/index.ts"],
  "json": "docs/api.json",
  "tsconfig": "src/tsconfig.json"
}
```

## CLI Usage

You can provider all options through CLI flags.

```sh
Usage: typedoc-json-parser [options]

Options:
  --json [path]     Path to the TypeDoc JSON output file to parse
  --migrate [path]  Path to the directory containing TypeDoc JSON Parser output files to migrate
  -v, --verbose     Print verbose information (default: false)
  -h, --help        display help for command
```

You can also set these options through a configuration file. This file should be located at your [current working directory](https://nodejs.org/api/process.html#processcwd). It should be named `.typedoc-json-parserrc`, optionally suffixed with `.json`, `.yml`, or `.yaml`.

When using `.typedoc-json-parserrc` or `.typedoc-json-parserrc.json` as your config file you can also use the JSON schema to get schema validation. To do so, add the following to your config file.

```json
{
  "$schema": "https://raw.githubusercontent.com/RealShadowNova/typedoc-json-parser/main/assets/typedoc-json-parser.schema.json"
}
```

### Example JSON file

```json
{
  "$schema": "https://raw.githubusercontent.com/RealShadowNova/typedoc-json-parser/main/assets/typedoc-json-parser.schema.json",
  "json": "docs/api.json"
}
```

### Example YAML file

```yaml
json: 'docs/api.json'
```

## Migrating JSON Files

If you need to migrate JSON files from a previous version of this package, you can use the `migrate` CLI flag. This will recursively search the provided directory for JSON files and migrate them to the latest version.

```sh
typedoc-json-parser --migrate docs
```

## Node.js Usage

Once you have used the CLI to parse the TypeDoc JSON output, you'll want to use that data to create documentation.
This package makes that extremely easy to do.

```typescript
import { readFile } from 'node:fs';
import { resolve } from 'node:path';
import { ProjectParser } from 'typedoc-json-parser';

const data = JSON.parse(readFile(resolve(process.cwd(), 'docs', 'api.json'), 'utf8'));
const project = new ProjectParser({ data });

// Do something with the project
```

## Documentation

While currently we do not have a dedicated way to view documentation for this package, you can still use the intellisense from your IDE and read our source code.
