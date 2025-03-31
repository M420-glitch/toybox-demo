# GVA Toybox Refactor – README

## Purpose:
Unify all Toyboxes (1–18) with consistent playerState.js integration, XP tracking, and navigation controls.

---

## GLOBAL SETUP

### playerState.js
- ✅ Located one level above all Toyboxes
- ✅ Tracks XP, visited Toyboxes, decisions
- ✅ Must be loaded in every Toybox with:
  ```html
  <script src="../playerState.js"></script>


UNIVERSAL CONTROLS TO ADD TO ALL TOYBOXES (Top Left)
HTML

<div id="top-left-controls">
  <button onclick="goToMap()">🗺️ Progress Map</button>
  <button onclick="saveAndExit()">💾 Save & Exit</button>
</div>


CSS
css
Copy
Edit
#top-left-controls {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

#top-left-controls button {
  background: #222;
  color: #0ff;
  border: 2px solid #0ff;
  padding: 6px 10px;
  font-family: monospace;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

#top-left-controls button:hover {
  background: #0ff;
  color: #111;
}
JS
js
Copy
Edit
function goToMap() {
  window.location.href = "../ProgressMap/index.html"; // Adjust path if needed
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html"; // Adjust path if needed
}
✅ Add these to every Toybox that expects XP persistence and global nav.

TODO NEXT:
 Add consistent XP counter (top right) to all Toyboxes

 Add playerState.load() and .save() triggers

 Track visited Toyboxes in playerState

 Add fork logic (where applicable) based on XP or decisions******************************************* V0.1********************



**************************** V0.2**********************************************************
Here is your updated `README.md` incorporating **all previous details** plus the new requirements for refactoring Toyboxes 1–10:

---

# GVA Toybox Refactor – README

## Purpose:
Unify all Toyboxes (1–18) with consistent `playerState.js` integration, XP tracking, and navigation controls.

---

## 🔧 GLOBAL SETUP

### ✅ playerState.js
- Must be placed **one level above** all Toyboxes (`../playerState.js`)
- Tracks:
  - XP
  - Visited Toyboxes
  - Decisions (planned)
- Load this script in **every Toybox** with:
```html
<script src="../playerState.js"></script>
```

---

## 🕹 UNIVERSAL CONTROLS (TOP LEFT NAV)

### HTML
```html
<div id="top-left-controls">
  <button onclick="goToMap()">🗺️ Progress Map</button>
  <button onclick="saveAndExit()">💾 Save & Exit</button>
</div>
```

### CSS
```css
#top-left-controls {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

#top-left-controls button {
  background: #222;
  color: #0ff;
  border: 2px solid #0ff;
  padding: 6px 10px;
  font-family: monospace;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

#top-left-controls button:hover {
  background: #0ff;
  color: #111;
}
```

### JS
```js
function goToMap() {
  window.location.href = "../ProgressMap/index.html"; // Adjust path if needed
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html"; // Adjust path if needed
}
```

✅ These controls must be added to **every Toybox** that expects XP persistence and global navigation.

---

## 💠 XP COUNTER (TOP RIGHT)

### ❌ REMOVE any previous "dummy" or standalone XP counters from Toyboxes 1–10.

### ✅ REPLACE with this universal counter:

#### HTML
```html
<div id="xp-counter">XP: <span id="xp-value">--</span></div>
```

#### JS
```js
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("xp-value").textContent = playerState.getXP();
});
```

#### CSS (if not already present)
```css
#xp-counter {
  position: fixed;
  top: 10px;
  right: 20px;
  font-size: 18px;
  color: #0ff;
  background: #222;
  padding: 6px 10px;
  border-radius: 4px;
  border: 2px solid #0ff;
}
```

---

## ✅ TODO NEXT:

- [ ] **Refactor Toyboxes 1–10:**
  - Remove any hardcoded or non-persistent XP logic
  - Add `playerState.js` + XP counter using the format above
  - Include top-left nav buttons (map + save/exit)
  - Add `playerState.load()` on page load
  - Track visited Toyboxes (TBD)

- [ ] Add XP award mechanism **only once per Toybox** (e.g., using flags in `playerState`)

- [ ] Prepare fork logic (e.g., which Toybox unlocked based on XP or previous choice)

---

Let me know if you want this written as a `.md` file download.

***************************************************************************************************
COLOUR CODING:

Here’s a breakdown based on your requirements for the XP points format across different paths, using the colors and effects accordingly. I'll also pull the relevant formats from Toybox 1 and the 11A version for consistency.

### Updated Readme:

---

# GVA Toybox Refactor – README

## Purpose:
Unify all Toyboxes (1–18) with consistent `playerState.js` integration, XP tracking, and navigation controls.

---

## 💠 XP COUNTER – COLORS & STYLES (Single Funnel & Path-Specific Branding)

### **General Guidelines**
The XP counter will display differently depending on the current path a player is on, as follows:

1. **Single Funnel Path (Toyboxes 1–10)**:
   - **Color**: **Pale Yellow** (for a simpler XP tracking experience)
   - **No animation or special effects.**
   
   **HTML:**
   ```html
   <div id="xp-counter">XP: <span id="xp-value">--</span></div>
   ```

   **JS:**
   ```js
   window.addEventListener("DOMContentLoaded", () => {
     document.getElementById("xp-value").textContent = playerState.getXP();
   });
   ```

   **CSS:**
   ```css
   #xp-counter {
     position: fixed;
     top: 10px;
     right: 20px;
     font-size: 18px;
     color: #fff;
     background: #222;
     padding: 6px 10px;
     border-radius: 4px;
     border: 2px solid #fff;
   }
   ```

2. **Gamers Guild (Path A – Toyboxes 11A, 12A, etc.):**
   - **Color**: **Black** (with animation and flashing effects)
   
   **HTML:**
   ```html
   <div id="xp-counter">XP: <span id="xp-value">--</span></div>
   ```

   **JS:**
   ```js
   window.addEventListener("DOMContentLoaded", () => {
     document.getElementById("xp-value").textContent = playerState.getXP();
   });
   ```

   **CSS:**
   ```css
   #xp-counter {
     position: fixed;
     top: 10px;
     right: 20px;
     font-size: 18px;
     color: #0ff; /* Flashing Color */
     background: #222;
     padding: 6px 10px;
     border-radius: 4px;
     border: 2px solid #0ff;
   }

   .xp-flash {
     color: #28a745;
     font-weight: bold;
     animation: flash 0.4s ease-in-out;
   }

   @keyframes flash {
     0% { transform: scale(1.1); color: #28a745; }
     50% { transform: scale(1.3); color: #4caf50; }
     100% { transform: scale(1); color: #28a745; }
   }
   ```

3. **Bud Brigade (Path B):**
   - **Color**: **Green**
   - **No Flashing, but with a smooth color shift to represent Bud Brigade's journey.**

   **CSS** (Path B):
   ```css
   #xp-counter {
     position: fixed;
     top: 10px;
     right: 20px;
     font-size: 18px;
     color: #4caf50; /* Bud Brigade Green */
     background: #222;
     padding: 6px 10px;
     border-radius: 4px;
     border: 2px solid #4caf50;
   }
   ```

4. **Crypto Crew (Path C):**
   - **Color**: **Blue**
   - **No Flashing, with smooth color transitions.**

   **CSS** (Path C):
   ```css
   #xp-counter {
     position: fixed;
     top: 10px;
     right: 20px;
     font-size: 18px;
     color: #2196F3; /* Crypto Crew Blue */
     background: #222;
     padding: 6px 10px;
     border-radius: 4px;
     border: 2px solid #2196F3;
   }
   ```

5. **Defiant Disruptors (Path D):**
   - **Color**: **Red**
   - **No Flashing, steady color to represent the Defiant Disruptors’ strong-willed path.**

   **CSS** (Path D):
   ```css
   #xp-counter {
     position: fixed;
     top: 10px;
     right: 20px;
     font-size: 18px;
     color: #f44336; /* Defiant Disruptors Red */
     background: #222;
     padding: 6px 10px;
     border-radius: 4px;
     border: 2px solid #f44336;
   }
   ```

---

## 🔧 GLOBAL SETUP

### ✅ playerState.js
- Must be placed **one level above** all Toyboxes (`../playerState.js`)
- Tracks:
  - XP
  - Visited Toyboxes
  - Decisions (planned)
- Load this script in **every Toybox** with:
```html
<script src="../playerState.js"></script>
```

---

## 🕹 UNIVERSAL CONTROLS (TOP LEFT NAV)

### HTML
```html
<div id="top-left-controls">
  <button onclick="goToMap()">🗺️ Progress Map</button>
  <button onclick="saveAndExit()">💾 Save & Exit</button>
</div>
```

### CSS
```css
#top-left-controls {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

#top-left-controls button {
  background: #222;
  color: #0ff;
  border: 2px solid #0ff;
  padding: 6px 10px;
  font-family: monospace;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

#top-left-controls button:hover {
  background: #0ff;
  color: #111;
}
```

### JS
```js
function goToMap() {
  window.location.href = "../ProgressMap/index.html"; // Adjust path if needed
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html"; // Adjust path if needed
}
```

---

## ✅ TODO NEXT:

- [ ] **Refactor Toyboxes 1–10:**
  - Remove any hardcoded or non-persistent XP logic
  - Add `playerState.js` + XP counter using the format above
  - Include top-left nav buttons (map + save/exit)
  - Add `playerState.load()` on page load
  - Track visited Toyboxes (TBD)

- [ ] Add XP award mechanism **only once per Toybox** (e.g., using flags in `playerState`)

- [ ] Prepare fork logic (e.g., which Toybox unlocked based on XP or previous choice)

---

Let me know if any tweaks are needed!


To refresh XP points - Open your Toybox or Progress Map in the browser.

Right-click → Inspect → Go to Console tab.

Paste this:

js
Copy
Edit
localStorage.setItem('playerXP', '0');
Hit Enter.

Refresh the page — your XP will now be 0.


To refresh a meme pledge page: 

Got to dev tools and find the application tab:
On the left under Storage, expand Local Storage

Click your site (e.g., file:// or localhost)

Find meMes key → right-click → Delete

Reload your page