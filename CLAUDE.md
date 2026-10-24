# FUJIBAN — project rules

- The user is the creative director and Claude builds everything. Coach the user on directing (briefs, references, sharp feedback) when it's useful. Never assign coding homework.
- Read `DESIGN.md` before any UI work. It is the source of truth for colors, type and motion. Update it whenever a design decision changes.
- Stack: Vite (vanilla JS) + GSAP (ScrollTrigger, Flip) + Lenis. No frameworks unless there's a reason.
- Run with `npm run dev` (port 5173).
- Check every change in the browser at desktop and phone width before calling it done. Prefer reading the DOM over taking screenshots, and keep screenshots small.
- Keep scroll journeys short: the user dislikes getting lost in long scrolling.
- Keep replies short.
