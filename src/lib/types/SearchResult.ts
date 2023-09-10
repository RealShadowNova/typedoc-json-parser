import type { ClassConstructorParser, ClassMethodParser, ClassParser, ClassPropertyParser } from '#lib/structures/class-parser';
import type { EnumMemberParser, EnumParser } from '#lib/structures/enum-parser';
import type { FunctionParser } from '#lib/structures/FunctionParser';
import type { InterfaceParser, InterfacePropertyParser } from '#lib/structures/interface-parser';
import type { ParameterParser, SignatureParser, TypeParameterParser } from '#lib/structures/misc';
import type { NamespaceParser } from '#lib/structures/NamespaceParser';
import type { TypeAliasParser } from '#lib/structures/TypeAliasParser';
import type { VariableParser } from '#lib/structures/VariableParser';

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
