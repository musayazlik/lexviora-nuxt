# Lexviora social sharing cards

Both public JPEGs are 1200 × 630 pixels, sRGB, fully opaque and optimized for Open Graph and large Twitter/X cards.

- `lexviora-share-tr.jpg`: “Hukuka özen. Geleceğe güven.”
- `lexviora-share-en.jpg`: “Care in law. Trust in tomorrow.”

Generated on 21 October 2026 with the built-in image generation tool. The requested `ai-image-generation` skill’s inference.sh CLI was checked, but it had no authenticated session; built-in generation was used to complete the artwork. Resized and encoded as JPEG with Sharp. No runtime AI call or image renderer is needed.

Art direction: midnight navy `#131D2C`, ivory `#F7F5F0`, muted gold `#B49564`, editorial serif typography, limestone colonnade and an evening view over the Bosphorus. Text has safe margins for sharing previews. The artwork uses a typographic Lexviora wordmark and makes no outcome or ranking claims.

The Turkish master prompt requested a finished 1200:630 social card with the exact Turkish headline above, the wordmark “lexviora”, the subtitle “LEGAL & ADVISORY”, and the line “Hukuk ve danışmanlık”. The English variant preserved the visual direction and replaced the headline and supporting line with “Care in law. Trust in tomorrow.” and “Legal insight. Considered advice.”

When replacing a card after launch, use a new filename and update `shared/seo.ts`; social networks cache image URLs independently of the website.
