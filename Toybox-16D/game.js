let currentQuestion = 0;
let questionsViewed = new Set();

const questions = {
  1: "If cannabis has been used as medicine, fuel, food, and industrial material for thousands of years, why have governments across the world spent the last century criminalizing it while allowing the pharmaceutical, oil, and chemical industries to flourish?",
  2: "Why is the most profitable business model for the medical industry one that treats symptoms indefinitely rather than curing diseases outright?",
  3: "Why have governments and corporations suppressed or ignored decentralized energy—like Tesla’s wireless power, hemp biofuel, or free-energy devices—while keeping fossil fuels dominant?",
  4: "Why do a handful of corporations control the global food supply, patent seeds, and criminalize independent farming while dictating what people eat?",
  5: "If information is truly free, why is history written by the victors, research funded by vested interests, and censorship rising in the digital age?",
  6: "Why are altered states—through meditation, psychedelics, or self-inquiry—demonized, while fear-based obedience is reinforced?",
  7: "If democracy means rule by the people, why is the financial system built to keep power in the hands of a tiny elite while trapping the rest in servitude?"
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("xp-value").textContent = playerState.getXP();

  document.querySelectorAll(".question-box").forEach(box => {
    box.addEventListener("click", () => {
      const qNum = box.getAttribute("data-question");
      if (questionsViewed.has(Number(qNum))) return;

      currentQuestion = qNum;
      document.getElementById("question-number").textContent = qNum;
      document.getElementById("question-text").textContent = questions[qNum];
      document.getElementById("question-modal").style.display = "flex";
      document.getElementById("back-button").style.display = "none";

      setTimeout(() => {
        document.getElementById("back-button").style.display = "inline-block";
      }, 9000);
    });
  });

  document.getElementById("back-button").addEventListener("click", () => {
    questionsViewed.add(Number(currentQuestion));
    document.querySelector(`.question-box[data-question="${currentQuestion}"]`).classList.add("answered");
    document.getElementById("question-modal").style.display = "none";

    if (questionsViewed.size === 7) {
      document.getElementById("completion").style.display = "block";
    }
  });
});

function goToMap() {
  window.location.href = "../ProgressMap/index.html";
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html";
}
