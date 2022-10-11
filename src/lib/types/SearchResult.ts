import type { ClassConstructorParser, ClassMethodParser, ClassParser, ClassPropertyParser } from '../structures/class-parser';
import type { EnumMemberParser, EnumParser } from '../structures/enum-parser';
import type { FunctionParser } from '../structures/FunctionParser';
import type { InterfaceParser, InterfacePropertyParser } from '../structures/interface-parser';
import type { ParameterParser, SignatureParser, TypeParameterParser } from '../structures/misc';
import type { NamespaceParser } from '../structures/NamespaceParser';
import type { TypeAliasParser } from '../structures/TypeAliasParser';
import type { VariableParser } from '../structures/VariableParser';

export type SearchResult =
  | ClassParser
  | ClassConstructorParser
  | ClassMethodParser
  | SignatureParser
  | TypeParameterParser
  | ParameterParser
  | ClassPropertyParser
  | VariableParser
  | EnumParser
  | EnumMemberParser
  | FunctionParser
  | InterfaceParser
  | InterfacePropertyParser
  | NamespaceParser
  | TypeAliasParser;
