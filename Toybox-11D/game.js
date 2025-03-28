const bios = {
  Gaia: {
    title: "Gaia – The Rupture",
    text: `She doesn’t plant. She fractures. Gaia splits the false unity, forcing truth to grow through the cracks.`
  },
  Max: {
    title: "Max – The Forge Hacker",
    text: `Max doesn’t build systems. He melts them down. Efficiency is his rebellion. Output is his roar.`
  },
  Leo: {
    title: "Leo – The Accountability Bomb",
    text: `He tracks everything they bury. Every hidden clause. Every broken oath. Then detonates it in public.`
  },
  Belle: {
    title: "Belle – The Pain Mirror",
    text: `Belle reflects what they tried to numb. Her healing is confrontation. Her silence is a scream.`
  },
  Luna: {
    title: "Luna – The Neural Saboteur",
    text: `Luna cuts through noise with surgical precision. Her maps don't soothe—they provoke.`
  },
  Zara: {
    title: "Zara – The Myth Killer",
    text: `Zara weaponizes awakening. She’s the one who turns their god into code and their control into dust.`
  },
  Rex: {
    title: "Rex – The Tactical Fool",
    text: `He jokes his way into every vault, laughs mid-collapse, and escapes with the only thing they fear: fun.`
  }
};

let matched = {};

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
});

Sortable.create(document.getElementById("toolbox"), {
  group: "labels",
  animation: 150
});

document.querySelectorAll(".character").forEach(char => {
  Sortable.create(char, {
    group: "labels",
    animation: 150,
    onAdd: function (evt) {
      const dragged = evt.item;
      const charName = char.dataset.id;
      const labelName = dragged.dataset.label;
      if (charName === labelName && !matched[charName]) {
        matched[charName] = true;
        checkComplete();
      } else {
        // Revert if incorrect
        document.getElementById("toolbox").appendChild(dragged);
      }
    }
  });
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
