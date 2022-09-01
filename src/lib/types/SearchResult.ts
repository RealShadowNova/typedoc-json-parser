import type { ClassConstructorParser, ClassMethodParser, ClassParser, ClassPropertyParser } from '../structures/class-parser';
import type { ConstantParser } from '../structures/ConstantParser';
import type { EnumParser, EnumPropertyParser } from '../structures/enum-parser';
import type { FunctionParser } from '../structures/FunctionParser';
import type { InterfaceParser, InterfacePropertyParser } from '../structures/interface-parser';
import type { ParameterParser, SignatureParser, TypeParameterParser } from '../structures/misc';
import type { NamespaceParser } from '../structures/NamespaceParser';
import type { TypeAliasParser } from '../structures/TypeAliasParser';

export type SearchResult =
  | ClassParser
  | ClassConstructorParser
  | ClassMethodParser
  | SignatureParser
  | TypeParameterParser
  | ParameterParser
  | ClassPropertyParser
  | ConstantParser
  | EnumParser
  | EnumPropertyParser
  | FunctionParser
  | InterfaceParser
  | InterfacePropertyParser
  | NamespaceParser
  | TypeAliasParser;
