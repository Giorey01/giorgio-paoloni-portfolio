## BOLT'S JOURNAL - CRITICAL LEARNINGS ONLY

## 2024-05-18 - Portfolio Data Processing
**Learning:** `Object.entries(imageData).filter(...).map(...).filter(...)` pattern in `src/app/page.tsx` and `src/app/portfolio/page.tsx` creates multiple intermediate arrays, iterating over all keys repeatedly. When dealing with dynamically fetched JSON objects, this can be slow and use excess memory.
**Action:** Replace `Object.entries(imageData).filter(...).map(...).filter(...)` with a single `.reduce()` pass to optimize execution time and reduce memory allocations, saving intermediate array creations. Same logic applies for extracting `slugs` in `generateStaticParams` (`src/app/portfolio/[slug]/page.tsx`).