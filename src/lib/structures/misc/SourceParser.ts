import { basename, dirname } from 'node:path';
import type { JSONOutput } from 'typedoc';
import type { ProjectParser } from '../ProjectParser';

export class SourceParser {
  public readonly project: ProjectParser;

  public readonly line: number;

  public readonly file: string;

  public readonly path: string;

  public constructor(data: SourceParser.Data, project: ProjectParser) {
    const { line, file, path } = data;

    this.line = line;
    this.file = file;
    this.path = path;

    this.project = project;
  }

  public toJSON(): SourceParser.JSON {
    return {
      line: this.line,
      file: this.file,
      path: this.path
    };
  }

  public static generate(reflection: JSONOutput.SourceReference, project: ProjectParser): SourceParser {
    const { line, fileName } = reflection;

    return new SourceParser(
      {
        line,
        file: basename(fileName),
        path: dirname(fileName)
      },
      project
    );
  }
}

export namespace SourceParser {
  export interface Data {
    line: number;

    file: string;

    path: string;
  }

  export interface JSON {
    line: number;

    file: string;

    path: string;
  }
}
