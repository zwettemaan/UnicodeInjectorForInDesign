# Changelog

## 1.0.2 - 2026-07-03

- Accept uppercase `0X`/`0D` prefixes (previously only lowercase `0x`/`0d` matched, despite being documented).
- Fix inline docs example: `U+0061`/`U+0062` are lowercase `a`/`b`, not `A`/`B`.
- Build the full insertion string in memory and assign it to the insertion point once, instead of assigning per chunk.
- Wrap the script body in `app.doScript(..., UndoModes.ENTIRE_SCRIPT, ...)` so one run is one undo step.
- Reject invalid code points (`> U+10FFFF`) and lone UTF-16 surrogates (`U+D800`-`U+DFFF`) with an alert instead of silently inserting nothing.
- Sanitize `/`, `\`, and `:` out of the name entered when configuring a copy of the script.

## 1.0.1 - 2026-07-01

- Support Unicode code points above U+FFFF (e.g. U+1F600) via UTF-16 surrogate pairs.
- Support single/double-quoted literal strings with `%`-escape sequences (`%n`, `%r`, `%t`, `%%`, `%'`, `%"`).
