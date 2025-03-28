const bios = {
  Gaia: {
    title: "Gaia – The Soil Binder",
    text: `Gaia doesn’t lead. She nurtures. The fungi listen to her. The worms follow her. Her roots stretch under every system—and quietly keep it alive.`
  },
  Max: {
    title: "Max – The Looper",
    text: `Compost, hempcrete, moss-reactors—Max doesn’t waste anything. What one world discards, he regenerates. His tools? Dirt, decay, and design.`
  },
  Leo: {
    title: "Leo – The Yield Mapper",
    text: `Currency is compost. Leo tracks growth, not gain. His metrics are soil health, seed return, and how many mouths it feeds.`
  },
  Belle: {
    title: "Belle – The Herb Whisperer",
    text: `From mugwort to mushrooms, from nettles to neem—Belle knows what calms, heals, and restores. She speaks the language of plants, not pills.`
  },
  Luna: {
    title: "Luna – The Pattern Forager",
    text: `Knowledge isn’t taught. It’s gathered. Luna studies pollen drift and neural nets in the same breath. She’s part forest, part file.`
  },
  Zara: {
    title: "Zara – The Myth Remover",
    text: `Cactus. Cannabis. Kava. Zara doesn’t romanticize nature—she decodes it. She shows what rituals are worth saving... and which are weeds.`
  },
  Rex: {
    title: "Rex – The Pollinator",
    text: `Playful and chaotic, Rex is wind and wildfire. He spreads joy like seeds—fast, feral, and on purpose.`
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
      playerState.setXP(playerState.getXP() + 5);
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
