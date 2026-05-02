# Replit Agent Task Spec

## Instructions for Replit Agent
You are building/improving this project. Read this file carefully before touching any code.
Commit all changes with prefix "replit: " and push to main when done.

## Stack Rules (non-negotiable)
- Static → Cloudflare Pages (never Vercel)
- DB → Supabase self-hosted Docker (never cloud Supabase)
- Auth → NextAuth.js (free, not Auth0/Clerk)
- AI → Claude Sonnet 4.6 via Anthropic API (model: claude-sonnet-4-6)
- Payments (adult) → CCBill or Segpay only

## Improvements To Make
1. **Add more enemy types** — Add at least 3 new enemy types beyond the current basic enemy: (a) Fast Scout — moves 2x speed, low health; (b) Heavy Tank — moves slowly, takes 5 hits; (c) Sniper — stays still, fires projectiles at player. Each should have visually distinct appearance using canvas drawing.
2. **Add level progression** — Implement a level system. Level 1: basic enemies only. Level 2: introduce Fast Scouts. Level 3: introduce Heavy Tanks. Level 4+: all types + increased spawn rate. Show "Level X" text on screen when advancing. Advance level every 500 points.
3. **Add high score system with localStorage** — Track top 5 high scores in localStorage. Show a "HIGH SCORES" panel on the game over screen listing name + score. On new high score, prompt player to enter their name (3 characters, arcade style). Load and display scores on game start screen too.
4. **Improve sprite animations** — Replace any static/simple enemy/player shapes with animated sprites using canvas. Add: player walk cycle (4 frames), player shoot animation (2 frames), enemy walk cycle (3 frames), death explosion animation (5 frames using circles/particles). Use requestAnimationFrame-based frame timing.
5. **Add sound effects via Web Audio API** — Use the Web Audio API (no external files needed) to generate: shoot sound (short square wave beep), explosion sound (white noise burst), level up sound (ascending tones), game over sound (descending tones), enemy hit sound (mid-frequency ping). All sounds generated programmatically — no audio file downloads needed.
6. **Add mobile touch controls** — Add an on-screen D-pad for movement (left/right arrows) and a fire button, visible only on touch devices (use `'ontouchstart' in window` check). Place controls at the bottom of the screen. Support both touch and existing keyboard controls simultaneously.
7. **Add game start screen** — Add a proper start screen with game title "MARINE BROS", high scores list, and "TAP TO START" / "PRESS SPACE TO START" prompt. Don't auto-start the game on page load.
8. **Add Cloudflare Pages config** — Add a `_headers` file with basic security headers. The game is a single HTML file — document in README that it deploys directly to Cloudflare Pages with no build step.

## Do Not Touch
- README.md (keep as-is)
- Core game mechanics in game.js (improve, don't replace)

## Definition of Done
- [ ] All improvements implemented and working
- [ ] Game runs without errors in browser console
- [ ] 3+ enemy types present and working
- [ ] Level progression advances correctly
- [ ] High scores save and load from localStorage
- [ ] Sound effects play on shoot/explosion/level-up
- [ ] Touch controls visible and functional on mobile
- [ ] Pushed to main with "replit: " commit prefix
