class StressProgramAssessment {
  constructor() {
    this.questions = [
      "When I do a job, I do it thoroughly.",
      "I feel responsible for ensuring that those who interact with me feel comfortable.",
      "I am constantly on the go.",
      "If I rest, I rust.",
      "I don't like to show my weaknesses to others.",
      "I often use the phrase, \"It's difficult to say exactly.\"",
      "I often say more than is actually necessary.",
      "I have trouble accepting people who are not precise.",
      "I find it difficult to show my feelings.",
      "\"Just don't give up\" is my motto.",
      "When I express an opinion, I justify it.",
      "When I have a wish, I fulfill it quickly.",
      "I only submit a report after I have revised it several times.",
      "People who dawdle annoy me.",
      "It is important for me to be accepted by others.",
      "I tend to have a hard shell, but a soft core.",
      "I often try to figure out what others expect of me so that I can act accordingly.",
      "I find it difficult to understand people who live carefree lives.",
      "I often interrupt others during discussions.",
      "I solve my own problems.",
      "I complete tasks as quickly as possible.",
      "I keep my distance when interacting with others.",
      "I should do many tasks even better.",
      "I personally take care of minor matters as well.",
      "Success doesn't just fall from the sky; I have to work hard for it.",
      "I have little tolerance for stupid mistakes.",
      "I appreciate it when others answer my questions quickly and concisely.",
      "It is important to me to hear from others whether I have done a good job.",
      "Once I have started a task, I see it through to the end.",
      "I put my wishes and needs aside in favor of other people's needs.",
      "I am often harsh toward others so that they will not hurt me.",
      "I often drum my fingers impatiently on the table (I am impatient).",
      "When explaining facts, I like to use clear enumeration: First..., second... Thirdly.",
      "I believe that most things are not as simple as many people think.",
      "I feel uncomfortable criticizing other people.",
      "I often nod my head during discussions.",
      "I work hard to achieve my goals.",
      "My facial expression tends to be serious.",
      "I am nervous.",
      "Nothing can shake me that quickly.",
      "My problems are nobody else's business.",
      "I often say, \"Hurry up, hurry up, we need to move faster!\"",
      "I often say: \"exactly,\" \"precisely,\" \"logical,\" \"clear,\" etc.",
      "I often say: \"I don't understand that...\"",
      "I like to say, \"Could you try it?\" rather than \"Try it.\"",
      "I am diplomatic.",
      "I try to exceed the expectations placed on me.",
      "I sometimes do two things at once.",
      "My motto is \"grit your teeth.\"",
      "Despite enormous efforts, there are many things I just can't seem to succeed at."
    ];

    this.programs = {
      "Perfection program": [1, 8, 11, 13, 23, 24, 33, 38, 43, 47],
      "Effort program": [5, 6, 10, 18, 25, 29, 34, 37, 44, 50],
      "Rush program": [3, 12, 14, 19, 21, 27, 32, 39, 42, 48],
      "Harmony program": [2, 7, 15, 17, 28, 30, 35, 36, 45, 46],
      "Toughness program": [4, 9, 16, 20, 22, 26, 31, 40, 41, 49]
    };
    this.programVisualAssets = {
      "Perfection program": "program-perfection.png",
      "Effort program": "program-effort.png",
      "Rush program": "program-rush.png",
      "Harmony program": "program-harmony.png",
      "Toughness program": "program-toughness.png"
    };

    this.questionsContainer = document.getElementById("questions");
    this.resultGrid = document.getElementById("resultGrid");
    this.resultsElement = document.getElementById("results");
    this.evaluateButton = document.getElementById("evaluateBtn");
    this.radarChartCanvas = document.getElementById("radarChart");
    this.radarChartInstance = null;

    this.bindEvents();
    this.renderQuestions();
  }

  bindEvents() {
    if (this.evaluateButton) {
      this.evaluateButton.addEventListener("click", () => this.evaluateTest());
    }
  }

  renderQuestions() {
    if (!this.questionsContainer) {
      return;
    }

    this.questions.forEach((question, index) => {
      const questionNumber = index + 1;
      const wrapper = document.createElement("div");
      wrapper.className = "question";

      const scaleOptions = [1, 2, 3, 4, 5]
        .map((value) => `
          <label>
            <input type="radio" name="q${questionNumber}" value="${value}">
            ${value}
          </label>
        `)
        .join("");

      wrapper.innerHTML = `
        <div class="question-text">
          <span class="question-number">${questionNumber}.</span>${question}
        </div>
        <div class="scale">${scaleOptions}</div>
      `;

      this.questionsContainer.appendChild(wrapper);
    });
  }

  evaluateTest() {
    const answers = {};

    for (let i = 1; i <= 50; i++) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      answers[i] = selected ? Number(selected.value) : 0;
    }

    const scores = {};
    for (const [programName, questionNumbers] of Object.entries(this.programs)) {
      scores[programName] = questionNumbers.reduce((sum, qNum) => sum + answers[qNum], 0);
    }

    // Show the results container first so visual content appears immediately.
    this.resultsElement.style.display = "block";

    this.renderResults(scores);
    this.renderRadarChart(scores);

    this.resultsElement.scrollIntoView({ behavior: "smooth" });
  }

  renderResults(scores) {
    this.resultGrid.innerHTML = "";

    Object.entries(scores).forEach(([programName, score]) => {
      const card = document.createElement("div");
      card.className = "result-card" + (score > 40 ? " highlight" : "");
      const imageName = this.programVisualAssets[programName] || "";

      card.innerHTML = `
        <h3>${programName}</h3>
        <div class="result-visual-wrap">
          <img class="result-visual-image" src="${imageName}" alt="${programName} visual">
        </div>
        <div class="score">${score} / 50</div>
        <div class="flag">${score > 40 ? "Dominant under stress" : "Below dominant threshold"}</div>
      `;

      const image = card.querySelector(".result-visual-image");
      if (image) {
        image.addEventListener("error", () => {
          const placeholder = document.createElement("div");
          placeholder.className = "result-visual-placeholder";
          placeholder.textContent = `Missing image: ${imageName}`;
          image.replaceWith(placeholder);
        });
      }

      this.resultGrid.appendChild(card);
    });
  }

  renderRadarChart(scores) {
    const context = this.radarChartCanvas.getContext("2d");
    const isNarrowViewport = window.innerWidth <= 700;

    if (this.radarChartInstance) {
      this.radarChartInstance.destroy();
    }

    this.radarChartInstance = new Chart(context, {
      type: "radar",
      data: {
        labels: Object.keys(scores),
        datasets: [{
          label: "Stress Program Score",
          data: Object.values(scores),
          fill: true,
          backgroundColor: "rgba(15, 118, 110, 0.20)",
          borderColor: "rgba(15, 118, 110, 1)",
          pointBackgroundColor: "rgba(15, 118, 110, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(15, 118, 110, 1)",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: isNarrowViewport
            ? { top: 24, right: 30, bottom: 24, left: 30 }
            : { top: 14, right: 18, bottom: 14, left: 18 }
        },
        scales: {
          r: {
            min: 0,
            max: 50,
            ticks: {
              stepSize: 10,
              backdropColor: "transparent"
            },
            pointLabels: {
              font: {
                size: isNarrowViewport ? 11 : 13
              },
              padding: isNarrowViewport ? 16 : 12
            },
            grid: {
              circular: false
            }
          }
        },
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} / 50`
            }
          }
        }
      }
    });
  }

}

document.addEventListener("DOMContentLoaded", () => {
  new StressProgramAssessment();
});
