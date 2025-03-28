# Toybox 2: Ground Toybox

## Description
An interactive drag-and-drop toybox where users must select 3 essentials for growing crops and avoid distractions. Part of GVA’s credibility path: *GROUND ME (The Covenant)*.

## Objective
> "Grow crops for the community. Pick 3 essentials from the toolbox. Not everything belongs in the soil."

## Mechanics
- **Drag & Drop:** Place 3 items into the soil area.
- **Correct Items:** `Seed`, `Watering Can`, `Sunlight`
- **Decoy Items:** `Can of Cola`, `Flat Screen TV`
- **Feedback:**  
  - ✅ Correct combo triggers green glow + +5 XP  
  - ❌ Wrong combo resets and allows retry

## Layout
- `#game-area` is centered on screen
- `#toolbox` is fixed on the right side
- XP counter in top-right
- Continue/Exit buttons appear on successful completion

## XP Flow
- Starts at **5 XP** (carried from Toybox 1)
- Ends at **10 XP**
- Completion moves user toward **TOYBOX 3: Light Me Me**

## Files
- `index.html` – structure
- `style.css` – layout and visual style
- `game.js` – core interaction logic
- `config.js` – (currently unused, placeholder)
- `assets/grow/` – all sprite images

