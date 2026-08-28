# LFK Solutions, LLC — brand assets

Every file here is derived from a single vector master. All PNG/WebP files have a
genuinely transparent background (straight alpha, no matte).

## Colors

| Role   | Hex       |
|--------|-----------|
| Green  | `#00401A` |
| Orange | `#F7A823` |

## Vector masters (source of truth)

| File | Use |
|------|-----|
| `logo-badge.svg` | Square badge — bracket frame + LFK + tagline. The primary mark. |
| `logo-badge-white.svg` | Same, white frame/type + orange chevron, for dark backgrounds. |
| `logo-badge-mono.svg` | Single-colour green (chevron included), for one-colour printing. |
| `logo-navbar.svg` | Horizontal lockup, no frame. Drop-in for the site header. |
| `logo-navbar-white.svg` | White version for the header over the hero. |
| `logo-navbar-mono.svg` | Single-colour green. |
| `logo-icon.svg` | Compact icon — frame + LFK only, no tagline. For favicons/app tiles. |
| `logo-icon-white.svg` | Compact icon, white. |

`logo-badge*` and `logo-icon*` use a **1024 × 1024** viewBox; the frame's outer edge is
flush with the viewBox, so there is no built-in padding — add clear space in layout.
`logo-navbar*` is **631.7 × 242** (aspect 2.611), cropped tight to the artwork.

## Rasters

- `logo-badge-{4096,2048,1024,512,256}.png` — square, transparent
- `logo-badge-white-{2048,1024,512}.png`
- `logo-navbar-{1024,192,128,96,64,48}h.png` — sized by **height**; 48/64/96 cover
  1x/2x/3x for a 48px header
- `logo-navbar-white-{…}h.png`
- `icon-{512,192,180,64,32,16}.png` — from `logo-icon.svg`
- `logo-badge-2048.webp`, `logo-navbar-1024h.webp`

## Notes

- The chevron was an embedded 114×132 bitmap in the previous `logo-white.svg` /
  `LFK_icon.svg`. It is now a real vector path, so the mark is resolution-independent
  at every size.
- The tagline is optically tracked to sit flush with the wordmark on both edges — do
  not re-space it.
- Below roughly 64px the tagline stops being readable; use `logo-icon.svg` there
  rather than shrinking the full lockup. At 16px even the icon is marginal.
- Prefer the SVGs in the site and let the browser scale them. The PNGs exist for
  email signatures, print, social profiles, and app manifests.
