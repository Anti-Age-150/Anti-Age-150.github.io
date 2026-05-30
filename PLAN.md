# Anti-Age-150 Landing Site, Altos-Inspired

## Summary
Build a new premium biotech-style website from scratch in this repo, using the Altos Labs homepage as a structural and mood reference, not as a template to copy. The site will present “Anti Aging” and “Go For 150” as a balanced longevity brand: scientific, futuristic, and credible, with a `Join waitlist` CTA.

Reference used for direction:
- [Altos Labs homepage](https://www.altoslabs.com/)
- [AP hot-mic report](https://apnews.com/article/putin-xi-hot-mic-life-span-a2cae1cc2526a3d333ab82eaa9a85d21)
- [CNN report link provided by you](https://www.cnn.com/2025/09/03/asia/xi-putin-chat-immortality-longevity-intl)

## Key Changes
- Create a small multi-page site with:
  - Home page with a full-bleed hero, mission statement, science/research section, and CTA
  - Science page with a deeper explanation of the longevity philosophy
  - Contact or waitlist page for conversions
- Establish a fresh visual identity from scratch:
  - Dark, restrained palette with high-contrast typography
  - Editorial layout, spacious sections, subtle gradients, and premium motion
  - Futuristic but disciplined art direction so it feels biotech-grade, not gimmicky
- Add a news spotlight section that references the AP/CNN longevity moment:
  - A featured card or editorial block about the Xi and Putin hot-mic discussion of science, longevity, and the idea of reaching 150 years old
  - Use the AP image/article as the visual anchor
  - Use the CNN report as the video source, if embeddable/available, otherwise link out cleanly
  - Keep the framing factual and restrained so it reads like a credible industry/news reference, not tabloid clickbait
- Mirror the useful Altos patterning without copying:
  - Thin top navigation
  - Large mission-led hero
  - News/perspectives-style content cards
  - Credibility-focused supporting sections
- Add SEO and trust basics:
  - Clear metadata for anti-aging / longevity / “Go For 150”
  - Open Graph preview
  - Footer with legal-safe language and simple contact links
- Implement the waitlist CTA as a front-end form with a single configurable submission target, so the site is usable immediately even without a backend.

## Test Plan
- Verify responsive layout at mobile, tablet, and desktop widths.
- Check navigation between pages and CTA behavior.
- Confirm typography hierarchy, contrast, and spacing remain consistent across sections.
- Validate the news spotlight renders cleanly with the AP image and CNN video/link fallback.
- Run basic accessibility checks for headings, labels, focus states, and button/link semantics.
- Validate the waitlist form flow and any fallback behavior for missing backend configuration.
- Do a final visual pass against the Altos-inspired intent: premium, scientific, and understated.

## Assumptions
- The repo is starting empty, so this is a greenfield build rather than a redesign of existing app code.
- “Go For 150” is a brand/theme statement, not a literal medical promise.
- Messaging should stay balanced and science-forward, not aggressive or hype-driven.
- The AP/CNN media should be used only in a rights-safe way:
  - Prefer embedding or linking the source-hosted media
  - Do not rehost assets unless the implementation confirms licensing/permission
- No backend exists yet, so the waitlist experience will be front-end first with a configurable integration point.
