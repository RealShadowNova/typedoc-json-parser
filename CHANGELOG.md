# Changelog

All notable changes to this project will be documented in this file.

# [2.3.1](https://github.com/RealShadowNova/typedoc-json-parser/compare/v2.3.0...v2.3.1) - (2022-07-31)

## 🐛 Bug Fixes

- **deps:** Add `tslib` ([10ad4bb](https://github.com/RealShadowNova/typedoc-json-parser/commit/10ad4bb8101ed2b2aa05cac5ff5d2c02d52cf593))
- **deps:** Update `typedoc` to `0.23.10` ([e17b77e](https://github.com/RealShadowNova/typedoc-json-parser/commit/e17b77ee2f5e0d099bb994c99072dd03da00abc0))

# [2.3.0](https://github.com/RealShadowNova/typedoc-json-parser/compare/v2.2.1...v2.3.0) - (2022-07-31)

## 🚀 Features

- **SignatureParser:** Add the `comment` property ([868db5c](https://github.com/RealShadowNova/typedoc-json-parser/commit/868db5c4ad3c61daac5be622b77e4770e2ec9446))

# [2.2.1](https://github.com/RealShadowNova/typedoc-json-parser/compare/v2.2.0...v2.2.1) - (2022-07-30)

## 🐛 Bug Fixes

- **ProjectParser:** Use `data.version` if `version` is not passed ([e8aaf5c](https://github.com/RealShadowNova/typedoc-json-parser/commit/e8aaf5cd8e9e9d7c7ce2db079475a12ff326cf17))

# [2.2.0](https://github.com/RealShadowNova/typedoc-json-parser/compare/v2.1.0...v2.2.0) - (2022-07-30)

## 🚀 Features

- **ProjectParser:** Add `version` property ([edddca7](https://github.com/RealShadowNova/typedoc-json-parser/commit/edddca78ad590e6ce9023f5ba655689b66c6b694))

# [2.1.0](https://github.com/RealShadowNova/typedoc-json-parser/compare/v2.0.2...v2.1.0) - (2022-07-30)

## 🚀 Features

- **ProjectParser:** Add `typeDocJsonParserVersion` property ([901d9ec](https://github.com/RealShadowNova/typedoc-json-parser/commit/901d9ecf73f4626c8596a6d906e86b3cb764674c))

# [2.0.2](https://github.com/RealShadowNova/typedoc-json-parser/compare/v2.0.1...v2.0.2) - (2022-07-27)

## 🐛 Bug Fixes

- **class-parser:** Export `ClassConstructorParser` ([9dd6dfd](https://github.com/RealShadowNova/typedoc-json-parser/commit/9dd6dfd8f9e1d356c73586af496e9c61179564ac))

## 📝 Documentation

- **ProjectParser:** Strip off external `{@link }` ref ([ef624b7](https://github.com/RealShadowNova/typedoc-json-parser/commit/ef624b7c74619e313394244d11a0ba537705d0e8))

# [2.0.1](https://github.com/RealShadowNova/typedoc-json-parser/compare/v2.0.0...v2.0.1) - (2022-07-27)

## 🐛 Bug Fixes

- **deps:** Update dependency `typedoc` to `0.23.9` ([a8f8307](https://github.com/RealShadowNova/typedoc-json-parser/commit/a8f830795a8afd96c4f563532a9aed5cd7d62044))

# [2.0.0](https://github.com/RealShadowNova/typedoc-json-parser/compare/v1.0.0...v2.0.0) - (2022-07-27)

## 🚀 Features

- **deps:** Update dependency `typedoc` to `0.23.8` (#19) ([63d2b6f](https://github.com/RealShadowNova/typedoc-json-parser/commit/63d2b6fe71067cc36070722b93dc4235fd1c3713))

   ### 💥 Breaking Changes:
   - Updated dependency `typedoc` to `0.23.8`
   - `CommentParser#tags` has been removed along with `#tags` in related interfaces. Use `#blockTags` and `#modifierTags` instead.
   - `CommentParser#extendedDescription` has been removed and merged with `#description` along with related interfaces.


# [1.0.0](https://github.com/RealShadowNova/typedoc-json-parser/tree/v1.0.0) - (2022-06-09)

## 🚀 Features

- Implement `typedoc-json-parser` (#2) ([c51d73f](https://github.com/RealShadowNova/typedoc-json-parser/commit/c51d73f75b99e2369afc29d42e827dbbddc98d00))
