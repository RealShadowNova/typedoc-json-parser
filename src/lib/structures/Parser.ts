import type { CommentParser, SourceParser } from './misc';
import type { ProjectParser } from './ProjectParser';

export abstract class Parser {
  public readonly project: ProjectParser;

  public readonly id: number;

  public readonly name: string;

  public readonly comment: CommentParser;

  public readonly source: SourceParser | null;

  public constructor(data: Parser.Data, project: ProjectParser) {
    const { id, name, comment, source } = data;

    this.id = id;
    this.name = name;
    this.comment = comment;
    this.source = source;

    this.project = project;
  }

  public toJSON(): Parser.JSON {
    return {
      id: this.id,
      name: this.name,
      comment: this.comment.toJSON(),
      source: this.source ? this.source.toJSON() : null
    };
  }
}

export namespace Parser {
  export interface Data {
    id: number;

    name: string;

    comment: CommentParser;

    source: SourceParser | null;
  }

  export interface JSON {
    id: number;

    name: string;

    comment: CommentParser.JSON;

    source: SourceParser.JSON | null;
  }
}
