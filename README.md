# UnicodeInjectorForInDesign

Script: use keyboard shortcuts to easily insert one or more Unicode characters into InDesign text.

How-to video:

https://www.youtube.com/watch?v=lO97JmZ9jEk

## How it works

You don't configure this script through a dialog or preferences file. Instead you make a copy of
`UnicodeInjector.jsx`, rename the copy to encode what it should insert, and drop it into your
InDesign Scripts folder. InDesign's normal Scripts panel / keyboard-shortcut mechanism then does
the rest: double-click the script (or hit its assigned shortcut) with a text cursor active, and it
inserts the character(s) encoded in its filename.

## Installing

1. Copy `dist/UnicodeInjector.jsx` into your InDesign 'Scripts Panel' folder (right-click the
   'User' folder in the Scripts panel and choose 'Reveal in Explorer'/'Reveal in Finder').
2. Double-click it once from the Scripts panel. You'll be prompted for a name — this makes a
   renamed copy that is now configured to insert whatever you encoded in the name.
3. Optionally assign a keyboard shortcut to the new copy via Edit > Keyboard Shortcuts...
4. Repeat for as many characters/strings as you want.

## Examples

| Script filename | Inserts |
|---|---|
| `U+200A Hair space.jsx` | hair space |
| `U+2011 Non-breaking hyphen.jsx` | non-breaking hyphen |
| `U+1F600 Grinning face.jsx` | 😀 |
| `"before%n%nafter" Insert text.jsx` | two-line literal text |

Descriptive text in the filename (e.g. "Hair space", "Insert text") is ignored — only the
recognized codes/literals are interpreted.

## Supported filename syntax

- `U+nnnn` — 1 to 6 hex digits, e.g. `U+0041`, `u+20eF`
- `0xnnnn` — 1 to 6 hex digits, e.g. `0x0041`, `0X61`
- `0dnnnnn` — 1 to 7 decimal digits, e.g. `0d65`, `0D97`
- `"literal text"` or `'literal text'`
- Escapes inside quoted text: `%n` (newline), `%r` (carriage return), `%t` (tab), `%%` (literal
  `%`), `%'`, `%"`

You can mix multiple codes/literals in one filename, e.g. `U+0061 U+0062.jsx` inserts "ab". Add
spaces between adjacent `U+`/`0x`/`0d` codes so the parser doesn't read extra digits into the
previous one.

Full documentation, including notes on where to look up Unicode code points, is in the header
comment of `UnicodeInjector.jsx` itself — right-click the script on the Scripts panel and choose
'Edit Script' to read it.

## Tested with

- InDesign 2024 / 2025 / 2026
- macOS and Windows
- ExtendScript `.jsx` scripts run from the Scripts panel
