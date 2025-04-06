# Toybox 3: Light Toybox

## Description
An interactive sequence-based toybox where users must place 3 items in the correct order to simulate turning sunlight into usable energy. Part of GVA’s credibility path: *LIGHT ME (The Trial)*.

## Objective
> "Generate light for the community. Pick 3 essentials from the toolbox. Not everything creates light."

## Mechanics
- **Drag & Drop (Ordered):** Place 3 items in left-to-right sequence.
- **Correct Sequence:** `Sun` → `Converter` → `Light Bulb`
- **Decoy Items:** `Pizza`, `Cardboard Box`
- **Feedback:**  
  - ✅ Correct sequence = green glow + +5 XP  
  - ❌ Wrong sequence = red flash + reset + retry

## Layout
- `#game-area` is centered
- 3 drop zones aligned left-to-right with arrows
- `#toolbox` is fixed on the right
- XP counter at top-right
- Continue/Exit buttons appear after success

## XP Flow
- Starts at **10 XP** (carried from Toybox 2)
- Ends at **15 XP**
- Completion unlocks **"Water Me Me"** stage

## Files
- `index.html` – structure
- `style.css` – layout and design
- `game.js` – ordered drop logic
- `config.js` – unused (placeholder)
- `assets/light/` – all sprite images
