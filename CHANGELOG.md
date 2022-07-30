# Changelog

All notable changes to this project will be documented in this file.

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
