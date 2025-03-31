const bios = {
  Gaia: {
    title: "Gaia – The Living Bridge",
    text: `She doesn’t rule. She remembers. Gaia connects what was lost and reminds the others why the battle must be won. Her home is in the eye of the storm. Her whisper breaks empires.`
  },
  Max: {
    title: "Max – The Industrial Flame",
    text: `Max builds what others only dream of. Gears, roots, reactors — if it can be shaped, Max will forge it. He sees energy where others see waste. And he never looks back.`
  },
  Leo: {
    title: "Leo – The Relentless Ledger",
    text: `Governance is not paperwork. It’s war. Leo remembers every broken promise and turns it into fire. He tracks everything. And what he tracks, he changes.`
  },
  Belle: {
    title: "Belle – The Last Healer",
    text: `She can find the heartbeat in a wasteland. She knows where wellness begins—and what tries to bury it. Belle carries no weapons. But her silence is lethal.`
  },
  Luna: {
    title: "Luna – The Clinical Mind",
    text: `She walks between data and dream. Every neuron matters. Luna sees maps of meaning in what others ignore. She won’t cure you. She’ll wake you.`
  },
  Zara: {
    title: "Zara – The Spirit Hacker",
    text: `She doesn’t believe in belief. Zara dances through dogma and shatters illusions with grace. She’s not here to convert. She’s here to unmask.`
  },
  Rex: {
    title: "Rex – The Recreational Wrecking Ball",
    text: `Laughter is his weapon. Freedom is his drug. Rex fights by inviting you to play — and when the tyrants look confused, he drops the hammer.`
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
      if (!playerState.isCompleted("11A")) {
        let currentXP = playerState.getXP();
        currentXP += 5;
        playerState.setXP(currentXP);
        playerState.markCompleted("11A");
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
  window.location.href = "../ProgressMap/index.html"; // Adjust path if needed
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html"; // Adjust path if needed
}
