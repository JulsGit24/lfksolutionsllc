# Website images — where everything lives

Images are grouped by the **page and section** they appear in, so you can find the
right folder by thinking about *where on the site* the picture shows up.

```
public/assets/
├── home/
│   ├── hero/          full-screen video at the top of the home page
│   └── portfolio/     "Our Work" gallery tiles
├── services/
│   ├── residential/   Residential Plumbing service cards
│   ├── commercial/    Commercial Plumbing service cards
│   └── remodeling/    Remodeling service cards
├── about/
│   ├── team/          staff photos
│   └── values/        the five company-values images
├── why-us/            the three "Why Us" proof images
├── brand/             logos, favicons, icons (see brand/README.md)
└── _unused/           older/duplicate files, not shown on the site
```

## What uses what

| Image | Where it appears | Set in |
|---|---|---|
| `home/hero/hero-video.mp4` | Home hero background **and** the footer background on every page | `src/components/Hero.jsx`, `src/components/Footer.jsx` |
| `home/hero/hero-poster.jpg` | *Not currently used* — see "Loose ends" below | — |
| `home/portfolio/*.png` | "Our Work" gallery (6 tiles) | `src/components/Portfolio.jsx` |
| `services/residential/residential-plumbing.png` | Residential card on home; "Why Us" page | `src/components/Services.jsx`, `src/pages/WhyUsPage.jsx` |
| `services/residential/*` (the rest) | Residential service list on `/services` | `src/pages/ServicesPage.jsx` |
| `services/commercial/commercial-plumbing.png` | Commercial card on home; About page parallax band | `src/components/Services.jsx`, `src/pages/AboutPage.jsx` |
| `services/commercial/*` (the rest) | Commercial service list on `/services` | `src/pages/ServicesPage.jsx` |
| `services/remodeling/remodeling.png` | Remodeling card on home | `src/components/Services.jsx` |
| `about/team/fernando.jpg` | Founder photo on `/about` | `src/pages/AboutPage.jsx` |
| `about/values/*.png` | The five values on `/about` | `src/pages/AboutPage.jsx` |
| `why-us/honesty.png` | Third panel on `/why-us` | `src/pages/WhyUsPage.jsx` |

### Images used in more than one place

A few files are deliberately shared rather than duplicated, so replacing one
changes **every** spot it appears:

- `home/hero/hero-video.mp4` → home hero + footer (all pages)
- `services/residential/residential-plumbing.png` → home services + portfolio + why-us
- `services/commercial/commercial-plumbing.png` → home services + portfolio + about
- `services/remodeling/remodeling.png` → home services + portfolio
- `about/values/trust.png` → about values + about parallax + why-us
- `services/residential/{bathroom,kitchen,full-home-repipe}.png` and
  `services/commercial/new-construction.png` → also reused in the Remodeling list

If you want one of these to differ per location, drop a second file in the other
section's folder and point that component at it.

## Adding a new picture

Dropping a file into a folder makes it **available**, but it does not put it on the
site automatically — each image is referenced by name in the code. Two steps:

1. Put the file in the matching folder above. Use lowercase-with-hyphens names
   (`tankless-heater.png`, not `IMG_4821 (1).PNG`).
2. Reference it, using a path that starts at `/assets/` — for example
   `/assets/services/residential/tankless-heater.png`.

Where to add the reference:

- **Portfolio gallery** — add to the `IMAGE_SRCS` array at the top of
  `src/components/Portfolio.jsx`. The gallery renders one tile per entry, so adding
  a 7th path adds a 7th tile. Titles come from the `portfolio.projects` list in
  `src/locales/en.js` and `es.js` — keep the two arrays the same length.
- **Services page lists** — add to `resImgs`, `comImgs`, or `remodelingImgs` near the
  top of `src/pages/ServicesPage.jsx`. These are matched **by position** against the
  service copy in `src/locales/*.js`, so the Nth image belongs to the Nth service.
- **About values** — add an entry to the values array in `src/pages/AboutPage.jsx`.

## Replacing a picture

Easiest path: give the new file the **exact same name** as the old one and overwrite
it. No code change needed. Mind the shared-image list above.

## Loose ends

- `home/hero/hero-poster.jpg` is not wired up. It looks intended as the poster frame
  for the hero video (shown while the video loads). Adding
  `poster="/assets/home/hero/hero-poster.jpg"` to the `<video>` in
  `src/components/Hero.jsx` would use it.
- `_unused/` holds 16 files that nothing references — older versions of the values
  images, duplicate `fernando` copies, and the pre-rebrand logos. Kept rather than
  deleted in case you still want them; safe to delete once you're sure.
- `hero-video.mp4` is ~32 MB, which is heavy for a page-load video and is downloaded
  on every page because the footer uses it too. Worth compressing at some point.
