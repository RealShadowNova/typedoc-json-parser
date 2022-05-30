import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../types';
import { CommentParser, SignatureParser, SourceParser } from './misc';
import { Parser } from './Parser';
import type { ProjectParser } from './ProjectParser';

export class FunctionParser extends Parser {
  public readonly external: boolean;

  public readonly signatures: SignatureParser[];

  public constructor(data: FunctionParser.Data, project: ProjectParser) {
    super(data, project);

    const { external, signatures } = data;

    this.external = external;
    this.signatures = signatures;
  }

  public toJSON(): FunctionParser.JSON {
    return {
      ...super.toJSON(),
      external: this.external,
      signatures: this.signatures.map((signature) => signature.toJSON())
    };
  }

  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): FunctionParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], flags, signatures = [] } = reflection;

    if (kind !== ReflectionKind.Function) throw new Error(`Expected Function (${ReflectionKind.Function}), but received ${kindString} (${kind})`);

    return new FunctionParser(
      {
        id,
        name,
        comment: CommentParser.generate(comment, project),
        source: sources.length ? SourceParser.generate(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        signatures: signatures.map((signature) => SignatureParser.generate(signature, project))
      },
      project
    );
  }
}

export namespace FunctionParser {
  export interface Data extends Parser.Data {
    external: boolean;

    signatures: SignatureParser[];
  }

  export interface JSON extends Parser.JSON {
    external: boolean;

    signatures: SignatureParser.JSON[];
  }
}
