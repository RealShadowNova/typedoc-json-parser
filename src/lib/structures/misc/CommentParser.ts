import type { JSONOutput } from 'typedoc';
import type { ProjectParser } from '../ProjectParser';

export class CommentParser {
  public readonly project: ProjectParser;

  public readonly description: string | null;

  public readonly extendedDescription: string | null;

  public readonly tags: CommentParser.Tag[];

  public get see(): CommentParser.Tag[] {
    return this.tags.filter((tag) => tag.name === 'see');
  }

  public get example(): CommentParser.Tag[] {
    return this.tags.filter((tag) => tag.name === 'example');
  }

  public get deprecated(): boolean {
    return this.tags.some((tag) => tag.name === 'deprecated');
  }

  public constructor(data: CommentParser.Data, project: ProjectParser) {
    const { description, extendedDescription, tags } = data;

    this.description = description;
    this.extendedDescription = extendedDescription;
    this.tags = tags;

    this.project = project;
  }

  public toJSON(): CommentParser.JSON {
    return {
      description: this.description,
      extendedDescription: this.extendedDescription,
      tags: this.tags
    };
  }

  public static generate(comment: JSONOutput.Comment, project: ProjectParser): CommentParser {
    const { shortText, text, tags } = comment;

    return new CommentParser(
      {
        description: shortText ?? text ?? null,
        extendedDescription: text ?? null,
        tags: tags?.map((tag) => ({ name: tag.tag, text: tag.text })) ?? []
      },
      project
    );
  }
}

export namespace CommentParser {
  export interface Data {
    description: string | null;

    extendedDescription: string | null;

    tags: Tag[];
  }

  export interface JSON {
    description: string | null;

    extendedDescription: string | null;

    tags: Tag[];
  }

  export interface Tag {
    name: string;

    text: string;
  }
}
