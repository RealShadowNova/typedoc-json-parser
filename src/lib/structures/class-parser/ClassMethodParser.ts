import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SignatureParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { ClassParser } from './ClassParser';

export class ClassMethodParser extends Parser {
  public readonly accessibility: ClassParser.Accessibility;

  public readonly abstract: boolean;

  public readonly static: boolean;

  public readonly signatures: SignatureParser[];

  public constructor(data: ClassMethodParser.Data, project: ProjectParser) {
    super(data, project);

    const { accessibility, abstract, static: _static, signatures } = data;

    this.accessibility = accessibility;
    this.abstract = abstract;
    this.static = _static;
    this.signatures = signatures;
  }

  public toJSON(): ClassMethodParser.JSON {
    return {
      ...super.toJSON(),
      accessibility: this.accessibility,
      abstract: this.abstract,
      static: this.static,
      signatures: this.signatures.map((signature) => signature.toJSON())
    };
  }

  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): ClassMethodParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], flags, signatures = [] } = reflection;

    if (kind !== ReflectionKind.Method) throw new Error(`Expected Method (${ReflectionKind.Method}), but received ${kindString} (${kind})`);

    return new ClassMethodParser(
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
        signatures: signatures.map((signature) => SignatureParser.generate(signature, project))
      },
      project
    );
  }
}

export namespace ClassMethodParser {
  export interface Data extends Parser.Data {
    accessibility: ClassParser.Accessibility;

    abstract: boolean;

    static: boolean;

    signatures: SignatureParser[];
  }

  export interface JSON extends Parser.JSON {
    accessibility: ClassParser.Accessibility;

    abstract: boolean;

    static: boolean;

    signatures: SignatureParser.JSON[];
  }
}
