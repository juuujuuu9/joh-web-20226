---
title: Valentine's BOGO 50% — Value-based discount
tagline: Extension-only Shopify app that applies 50% off the second-most expensive unit at checkout, with optional free shipping — no server, no database.
role: Lead Developer
client: Chamelo Eyewear
timeline: 2025 – 2026

challenge: |
  Chamelo Eyewear needed a promotional discount for Valentine's that was value-based: 50% off the second-most expensive item in the cart, with optional free shipping — all running automatically at checkout without a backend.

approach: |
  Designed an extension-only Shopify app using a Rust Shopify Function (WebAssembly) for cart logic and an Admin UI extension for merchant configuration. Mapped BOGO rules: expand by quantity, sort by unit price descending, apply 50% to the unit at index 1.

solution: |
  Built a Shopify extension-only app with a value-based BOGO: 50% off one unit — the second-most expensive by unit price. Supports optional 100% off first delivery (free shipping). Merchants create the discount in Settings → Discounts and configure title, dates, and Product/Shipping classes; the function runs at checkout with no code required.

result: |
  Delivered a zero-infrastructure discount that applies automatically at checkout. Clear BOGO logic (e.g. 2× $300, 1× $200 → one $300 unit gets 50% off) and optional free shipping, all configurable from Shopify Admin.

techStack:
  - Shopify Functions (Rust / WASM)
  - Admin UI extensions
  - Extension-only app
  - GraphQL
projectLink: https://github.com/juuujuuu9/Shopify-Value-based-BOGO-50-off-second-most-expensive-unit-
github: https://github.com/juuujuuu9/Shopify-Value-based-BOGO-50-off-second-most-expensive-unit-
servicesProvided:
  - Shopify extensions
  - Discount logic (Rust)
  - Admin UI

heroImage: https://placehold.co/1200x630/f7f8fb/09090d?text=Chamelo+Eyewear+BOGO
---