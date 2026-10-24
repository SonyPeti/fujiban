# FUJIBAN 富士盤 — Design

A fictional record shop in a Shimokitazawa basement, Tokyo. It sells seven records only: exclusive editions of 300, never repressed.
Mood: **Japan-style, clean, insane.** That means calm, quiet layouts with one or two moments that are completely over the top.

## Concept
Brandon Yasin's structure (loader, a clean grid, tiny type) combined with Corn Revolution's spectacle (a full-screen scene that scrubs with scroll).
- **Loader:** a small square flicks through the 7 covers while a counter runs 0→100. The square then grows into the hero.
- **Hero:** Mount Fuji at night. Scrolling brings dawn, and the rising sun turns out to be a red vinyl record (the hinomaru is a record). The fog parts. The scroll is short: 2 screens max, with visible progress.
- **Crate:** 7 sleeves stacked, which fan out into a grid (FLIP).
- **Record page:** the sleeve moves to the center, the vinyl slides out and spins. *(later)*

## Color tokens
| Token | Hex | Use |
|---|---|---|
| `--washi` | `#ECE8DF` | paper background, the default |
| `--sumi` | `#121212` | ink, text |
| `--hinomaru` | `#D2231C` | the ONLY accent, used sparingly |
| `--fog` | `#B8B3A8` | secondary text, hairlines |
| `--yoru` | `#0B0F1C` | night sky (hero only) |

## Type
- **Latin UI:** Inter Tight, 400/500. Tiny uppercase labels (11px, +0.04em tracking), like Brandon's.
- **Display Japanese:** Shippori Mincho B1, 800. Huge kanji, often set vertically (`writing-mode: vertical-rl`).
- **Numbers:** tabular (`font-variant-numeric: tabular-nums`).
- Never more than 2 sizes on one screen, apart from the display moment.

## Layout
- 12-column grid, 16px gutters, 16px page margin (24px on desktop).
- Corners hold the UI (logo top-left, menu and clock top-right, edition counter bottom-left), like Brandon's.
- Lots of empty space. Fill a screen with one idea, not five.

## Motion
- Easing: `expo.out` / `power4.out` for reveals. `power2.inOut` for scrubs. **No bounce, ever.** Things feel heavy, like a platter.
- Durations: 0.6s (UI) · 1.2s (reveals) · scroll-scrubbed (scenes).
- Text reveals: lines slide up out of a mask. Hover: text rolls (duplicate span).
- Scroll: Lenis smooth scroll. Scenes pin for at most 200vh.
- Respect `prefers-reduced-motion`: skip the scrubs and show the end states.

## Cover art direction
The reference covers are 01 Red Fuji, 05 Wave and 06 Blank Space. Every cover follows them: a **bold, flat Japanese graphic print** with screenprint/risograph texture, lots of negative space, 1–3 colors, and the feel of a 1960s Japanese design poster. **Never photographic.** No text in the art; our type sits on top.

## Records (fictional)
| # | Kanji | Romaji | Artist | Genre | Cover idea |
|---|---|---|---|---|---|
| 01 | 赤富士 | AKA FUJI | Mirai Kōen | city pop | red Fuji, sun disc |
| 02 | 終電 | SHŪDEN | Nightcall Shibuya | synthwave | one train, lit windows, navy night |
| 03 | 雨音 | AMAOTO | Haru Okada | ambient piano | rain hairlines |
| 04 | 夜光 | YAKŌ | Neon Kitsune | night funk | single red paper lantern in the dark |
| 05 | 波 | NAMI | Kanagawa Dub Society | dub | concentric wave lines |
| 06 | 空白 | KŪHAKU | 0/0 | minimal techno | blank paper, one red dot |
| 07 | 桜前線 | SAKURA ZENSEN | Yuki & the Strangers | jazz | petals drifting diagonally |
