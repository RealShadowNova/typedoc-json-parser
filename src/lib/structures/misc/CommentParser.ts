import type { JSONOutput } from 'typedoc';
import type { ProjectParser } from '../ProjectParser';

/**
 * Parses data from a comment reflection.
 * @since 1.0.0
 */
export class CommentParser {
  /**
   * The project this parser belongs to.
   */
  public readonly project: ProjectParser;

  /**
   * The description of this comment.
   * @since 1.0.0
   */
  public readonly description: string | null;

  /**
   * The extended description of this comment.
   * @since 1.0.0
   */
  public readonly extendedDescription: string | null;

  /**
   * The tags of this comment.
   * @since 1.0.0
   */
  public readonly tags: CommentParser.Tag[];

  /**
   * The filtered `@see` tags of this comment.
   * @since 1.0.0
   */
  public get see(): CommentParser.Tag[] {
    return this.tags.filter((tag) => tag.name === 'see');
  }

  /**
   * The filtered `@example` tags of this comment.
   * @since 1.0.0
   */
  public get example(): CommentParser.Tag[] {
    return this.tags.filter((tag) => tag.name === 'example');
  }

  /**
   * Whether the comment has an `@deprecated` tag.
   * @since 1.0.0
   */
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

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): CommentParser.JSON {
    return {
      description: this.description,
      extendedDescription: this.extendedDescription,
      tags: this.tags
    };
  }

  /**
   * Generates a new {@link CommentParser} instance from the given data.
   * @since 1.0.0
   * @param comment The comment to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
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
    /**
     * The description of this comment.
     * @since 1.0.0
     */
    description: string | null;

    /**
     * The extended description of this comment.
     * @since 1.0.0
     */
    extendedDescription: string | null;

    /**
     * The tags of this comment.
     * @since 1.0.0
     */
    tags: Tag[];
  }

  export interface JSON {
    /**
     * The description of this comment.
     * @since 1.0.0
     */
    description: string | null;

    /**
     * The extended description of this comment.
     * @since 1.0.0
     */
    extendedDescription: string | null;

    /**
     * The tags of this comment.
     * @since 1.0.0
     */
    tags: Tag[];
  }

  /**
   * A tag of a comment.
   * @since 1.0.0
   */
  export interface Tag {
    /**
     * The name of this tag.
     * @since 1.0.0
     */
    name: string;

    /**
     * The text of this tag.
     * @since 1.0.0
     */
    text: string;
  }
}
