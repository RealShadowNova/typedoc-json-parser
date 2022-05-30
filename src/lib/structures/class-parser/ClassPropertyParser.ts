import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';
import { ClassParser } from './ClassParser';

export class ClassPropertyParser extends Parser {
  public readonly accessibility: ClassParser.Accessibility;

  public readonly abstract: boolean;

  public readonly static: boolean;

  public readonly readonly: boolean;

  public readonly optional: boolean;

  public readonly type: TypeParser | null;

  public constructor(data: ClassPropertyParser.Data, project: ProjectParser) {
    super(data, project);

    const { accessibility, abstract, static: _static, readonly, optional, type } = data;

    this.accessibility = accessibility;
    this.abstract = abstract;
    this.static = _static;
    this.readonly = readonly;
    this.optional = optional;
    this.type = type;
  }

  public toJSON(): ClassPropertyParser.JSON {
    return {
      ...super.toJSON(),
      accessibility: this.accessibility,
      abstract: this.abstract,
      static: this.static,
      readonly: this.readonly,
      optional: this.optional,
      type: this.type ? this.type.toJSON() : null
    };
  }

  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): ClassPropertyParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], type, flags } = reflection;

    if (kind !== ReflectionKind.Property && kind !== ReflectionKind.Accessor) {
      throw new Error(
        `Expected Property (${ReflectionKind.Property}) or Accessor (${ReflectionKind.Accessor}), but received ${kindString} (${kind})`
      );
    }

    if (kind === ReflectionKind.Accessor) {
      const [getter] = reflection.getSignature ?? [];

      if (getter === undefined) throw new Error(`Expected Accessor (${ReflectionKind.Accessor}) with a getter, but there was none`);

      const { id, name, comment = {}, type, flags } = getter;

      return new ClassPropertyParser(
        {
          id,
          name,
          comment: CommentParser.generate(comment, project),
          source: sources.length ? SourceParser.generate(sources[0], project) : null,
          accessibility: flags.isPrivate
            ? ClassParser.Accessibility.Private
            : flags.isProtected
            ? ClassParser.Accessibility.Protected
            : ClassParser.Accessibility.Public,
          abstract: Boolean(flags.isAbstract),
          static: Boolean(flags.isStatic),
          readonly: Boolean(flags.isReadonly),
          optional: Boolean(flags.isOptional),
          type: type ? TypeParser.generate(type, project) : null
        },
        project
      );
    }

    return new ClassPropertyParser(
      {
        id,
        name,
        comment: CommentParser.generate(comment, project),
        source: sources.length ? SourceParser.generate(sources[0], project) : null,
        accessibility: flags.isPrivate
          ? ClassParser.Accessibility.Private
          : flags.isProtected
          ? ClassParser.Accessibility.Protected
          : ClassParser.Accessibility.Public,
        abstract: Boolean(flags.isAbstract),
        static: Boolean(flags.isStatic),
        readonly: Boolean(flags.isReadonly),
        optional: Boolean(flags.isOptional),
        type: type ? TypeParser.generate(type, project) : null
      },
      project
    );
  }
}

export namespace ClassPropertyParser {
  export interface Data extends Parser.Data {
    accessibility: ClassParser.Accessibility;

    abstract: boolean;

    static: boolean;

    readonly: boolean;

    optional: boolean;

    type: TypeParser | null;
  }

  export interface JSON extends Parser.JSON {
    accessibility: ClassParser.Accessibility;

    abstract: boolean;

    static: boolean;

    readonly: boolean;

    optional: boolean;

    type: TypeParser.JSON | null;
  }
}
