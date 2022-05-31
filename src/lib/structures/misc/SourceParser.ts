import { basename, dirname } from 'node:path';
import type { JSONOutput } from 'typedoc';
import type { ProjectParser } from '../ProjectParser';

/**
 * Parses data from a source reflection.
 * @since 1.0.0
 */
export class SourceParser {
  /**
   * The project this parser belongs to.
   * @since 1.0.0
   */
  public readonly project: ProjectParser;

  /**
   * The line number of this source.
   * @since 1.0.0
   */
  public readonly line: number;

  /**
   * The file name of this source.
   * @since 1.0.0
   */
  public readonly file: string;

  /**
   * The path of this source.
   * @since 1.0.0
   */
  public readonly path: string;

  public constructor(data: SourceParser.Data, project: ProjectParser) {
    const { line, file, path } = data;

    this.line = line;
    this.file = file;
    this.path = path;

    this.project = project;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): SourceParser.JSON {
    return {
      line: this.line,
      file: this.file,
      path: this.path
    };
  }

  /**
   * Generates a new {@link SourceParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
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
    /**
     * The line number of this source.
     * @since 1.0.0
     */
    line: number;

    /**
     * The file name of this source.
     * @since 1.0.0
     */
    file: string;

    /**
     * The path of this source.
     * @since 1.0.0
     */
    path: string;
  }

  export interface JSON {
    /**
     * The line number of this source.
     * @since 1.0.0
     */
    line: number;

    /**
     * The file name of this source.
     * @since 1.0.0
     */
    file: string;

    /**
     * The path of this source.
     * @since 1.0.0
     */
    path: string;
  }
}
