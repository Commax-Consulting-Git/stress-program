class StressProgramAssessment {
  constructor() {
    this.questions = [
      "I always do my work thoroughly.",
      "It is my responsibility to make sure that the people I deal with feel comfortable.",
      "I am constantly on the go.",
      "I appear strong to others and do not show them my weaknesses.",
      "My motto is: 'A rolling stone gathers no moss.'",
      "I often use the phrase 'You can't say that for sure.'",
      "I often say more than is actually necessary.",
      "I find it difficult to accept people who are not exactly like me.",
      "I find it difficult to show my feelings.",
      "'Don't give up' is my motto.",
      "When I express my opinion, I also justify it.",
      "When I have a wish, I make it come true quickly.",
      "Before I submit a report, I revise it several times.",
      "People who 'dawdle' annoy me. Dawdling is a waste of time.",
      "Being accepted by others is important to me.",
      "I have a hard shell rather than a soft core. You have to be tough at work.",
      "I often try to figure out what others expect of me.",
      "I find it difficult to understand people who live carefree lives.",
      "I often interrupt during discussions.",
      "I solve my own problems.",
      "I have a hard shell rather than a soft core. You have to be tough at work.",
      "I often try to figure out what others expect of me.",
      "I find it difficult to understand people who live carefree lives.",
      "I often interrupt during discussions.",
      "I solve my own problems.",
      "I have a hard shell rather than a soft core. You have to be tough at work.",
      "I often try to figure out what others expect of me.",
      "I find it difficult to understand people who live carefree lives.",
      "Once I start a task, I see it through to the end.",
      "I put my needs and desires aside in favor of others.",
      "I am often harsh toward others so that they will not hurt me.",
      "I often drum my fingers impatiently on the table.",
      "When explaining facts, I like to use clear enumeration: 1., 2., 3.,",
      "I am convinced that most things are not as simple as many people claim.",
      "I don't like criticizing others.",
      "I often nod my head during discussions.",
      "I always strive to achieve my goals.",
      "My facial expression tends to be serious.",
      "I am nervous.",
      "Nothing can shake me easily.",
      "My problems are nobody else's business.",
      "I often say, 'Get a move on.'",
      "I often say: 'Exactly,' 'Precisely,' 'Sure,' 'Logical.'",
      "I often say: 'I don't understand that...'",
      "I tend to say 'Could you try it?' rather than 'Try it.'",
      "I am diplomatic.",
      "I always try to exceed the expectations placed on me.",
      "When I'm on the phone, I also work on emails at the same time.",
      "My motto is: 'Grit your teeth.'",
      "Despite enormous effort, there are many things I simply cannot achieve."
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
                size: 13
              }
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
