const bios = {
  Gaia: {
    title: "Gaia – Consensus Layer",
    text: "The foundational bridge. Coordinates protocols and mediates cross-layer truth. Without her, nothing syncs."
  },
  Max: {
    title: "Max – Supply Protocol",
    text: "Material backbone. Mints, grows, recycles. Interfacing with energy systems from industrial hemp to decentralized nodes."
  },
  Leo: {
    title: "Leo – Ledger Validator",
    text: "Records the pulse of the system. Handles accountability, integrity, and timestamped rebellion."
  },
  Belle: {
    title: "Belle – Wellness Oracle",
    text: "Biological check-in. Tracks rhythm, safety, health—upstreams somatic data for social restoration."
  },
  Luna: {
    title: "Luna – Cognitive Index",
    text: "Interprets dreams, delusions, diagnostics. Uplink to neural evolution via evidence-based uncertainty."
  },
  Zara: {
    title: "Zara – Spirit Fork",
    text: "Non-consensus interface. Injects chaos, audits belief structures, and runs memetic antivirus routines."
  },
  Rex: {
    title: "Rex – Energy Router",
    text: "Turns play into power. Redirects attention flows, vibe swaps, dopamine engines. Pure decentralized mischief."
  }
};

let matched = {};
let dragged = null;

document.querySelectorAll(".character").forEach(char => {
  char.addEventListener("mouseenter", () => {
    const name = char.dataset.id;
    const card = document.getElementById("popup-card");
    card.innerHTML = `<h2>${bios[name].title}</h2><p>${bios[name].text}</p>`;
    card.style.display = "block";
  });
  char.addEventListener("mouseleave", () => {
    document.getElementById("popup-card").style.display = "none";
  });

  char.addEventListener("dragover", e => e.preventDefault());
  char.addEventListener("drop", e => {
    e.preventDefault();
    const charName = char.dataset.id;
    const labelName = dragged.dataset.label;
    if (charName === labelName && !matched[charName]) {
      char.appendChild(dragged);
      matched[charName] = true;
      checkComplete();
    }
  });
});

document.querySelectorAll(".label").forEach(label => {
  label.addEventListener("dragstart", () => dragged = label);
});

function checkComplete() {
  if (Object.keys(matched).length === 7) {
    document.getElementById("completion").style.display = "block";
    if (!window._xpAdded) {
      window._xpAdded = true;
      if (!playerState.isCompleted("11C")) {
        let currentXP = playerState.getXP();
        currentXP += 5;
        playerState.setXP(currentXP);
        playerState.markCompleted("11C");
        xpEl.textContent = currentXP;
      
        xpEl.classList.add('xp-flash');
        setTimeout(() => xpEl.classList.remove('xp-flash'), 500);
      }
      
      document.getElementById("xp-value").textContent = playerState.getXP();
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("xp-value").textContent = playerState.getXP();
});

function goToMap() {
  window.location.href = "../ProgressMap/index.html";
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html";
}
