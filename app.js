const STORAGE_KEY = "manager-lab-paths-v4";
const screens = [...document.querySelectorAll("[data-screen]")];
const languageButtons = [...document.querySelectorAll("[data-language]")];
const headerStatus = document.querySelector("#header-status");

const pathContent = {
  1: {
    1: {
      outcome: {
        zh: "交付速度提升，短期产出更高。",
        en: "Delivery accelerates and short-term output rises."
      },
      impact: {
        zh: "思考被外包给 AI，能力缺口可能持续累积。",
        en: "AI absorbs the thinking, so skill gaps may keep growing."
      },
      reason: {
        zh: "只靠交付后的评审，属于被动补救；它很难阻止日常工作中的认知卸载。",
        en: "Review after delivery is reactive; it cannot prevent cognitive offloading during daily work."
      }
    },
    2: {
      outcome: {
        zh: "交付速度可能下降，但理解被纳入工作流程。",
        en: "Delivery may slow, but understanding becomes part of the workflow."
      },
      impact: {
        zh: "人保留判断，AI 产出更容易被审查、修改和迁移。",
        en: "People keep judgement, and AI output becomes easier to review, revise and reuse."
      },
      reason: {
        zh: "要求解释会把学习嵌入真实任务，让正确使用 AI 成为一种工作习惯。",
        en: "Explaining embeds learning in real work and makes responsible AI use a daily habit."
      }
    },
    3: {
      outcome: {
        zh: "增加独立练习，短期需要额外时间。",
        en: "Adds independent practice and requires extra time in the short term."
      },
      impact: {
        zh: "基础能力更稳，但练习可能与具体业务脱节。",
        en: "Fundamentals become stronger, but practice may feel detached from the business."
      },
      reason: {
        zh: "刻意练习能补基础，适合与方案 B 的学习闭环结合，而不是单独替代真实工作。",
        en: "Deliberate practice builds foundations; pair it with the learning loop in B rather than treating it as a substitute for real work."
      }
    }
  },
  2: {
    1: {
      outcome: {
        zh: "短期故障风险下降，独立排障被强制执行。",
        en: "Immediate failure risk falls, and independent debugging is enforced."
      },
      impact: {
        zh: "团队失去 AI 带来的效率，也失去学习驾驭 AI 的机会。",
        en: "The team loses AI productivity and the chance to learn how to use it well."
      },
      reason: {
        zh: "一刀切禁令把工具当成问题，却没有解决真正的问题：人如何与 AI 分工。",
        en: "A blanket ban treats the tool as the problem, rather than addressing how people should divide work with AI."
      }
    },
    2: {
      outcome: {
        zh: "保留 AI 效率，用评审和校验拦截质量问题。",
        en: "Preserves AI speed and uses review and validation to catch quality issues."
      },
      impact: {
        zh: "产出风险可控，但员工的独立思考能力不会自动增长。",
        en: "Output risk becomes manageable, but independent thinking does not grow automatically."
      },
      reason: {
        zh: "流程能守住结果，却不一定创造练习机会；还需要学习闭环。",
        en: "Processes protect outcomes, but do not necessarily create practice. A learning loop is still needed."
      }
    },
    3: {
      outcome: {
        zh: "常规工作保留 AI 效率，难题强制独立思考。",
        en: "Routine work keeps AI efficiency, while hard problems require independent thinking."
      },
      impact: {
        zh: "能力练习回到真实工作，但需要明确的团队时间预算。",
        en: "Practice returns to real work, but it requires protected team time."
      },
      reason: {
        zh: "关键不是“用不用 AI”，而是区分 AI 作为替代品还是增强器；不同场景采用不同使用模式。",
        en: "The issue is not whether to use AI, but whether it substitutes for people or amplifies them. Different contexts need different modes."
      }
    }
  },
  3: {
    1: {
      outcome: {
        zh: "交付稳定，员工承受的压力更低。",
        en: "Delivery stays stable with less pressure on the employee."
      },
      impact: {
        zh: "员工可能长期留在舒适区，深度思考能力停滞。",
        en: "He may remain in the comfort zone while deep-thinking capability stalls."
      },
      reason: {
        zh: "只安排匹配当前水平的任务，会默认维持现状，而不是主动创造成长机会。",
        en: "Assigning only work that matches the current level reinforces the status quo instead of creating growth."
      }
    },
    2: {
      outcome: {
        zh: "短期需要更多辅导，挑战保持在可控范围。",
        en: "More coaching is needed initially, while challenge remains manageable."
      },
      impact: {
        zh: "能力边界逐步扩大，同时不牺牲基本交付。",
        en: "Capability expands gradually without sacrificing essential delivery."
      },
      reason: {
        zh: "挑战加支持形成脚手架：任务足够难，但失败风险仍可由管理者承接。",
        en: "Challenge plus support creates a scaffold: the task is difficult enough to stretch him, while the manager contains the risk."
      }
    },
    3: {
      outcome: {
        zh: "快速接触高难度任务，明确离开舒适区。",
        en: "Creates immediate exposure to difficult work and a clear exit from the comfort zone."
      },
      impact: {
        zh: "能力可能提升，但抵触和挫败感也可能破坏动力。",
        en: "Capability may improve, but resistance and frustration can undermine motivation."
      },
      reason: {
        zh: "挑战需要支持与梯度，而不是硬性平均分配；可以用分层任务替代强制安排。",
        en: "Challenge needs support and progression, not rigid allocation. Use tiered assignments instead of forcing a fixed split."
      }
    }
  }
};

let state = loadState();
let activeScreen = 0;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      language: ["both", "zh", "en"].includes(saved?.language) ? saved.language : "both",
      choices: saved?.choices && typeof saved.choices === "object" ? saved.choices : {}
    };
  } catch {
    return { language: "both", choices: {} };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The page remains usable without persistent storage.
  }
}

function setLanguage(language) {
  state.language = ["both", "zh", "en"].includes(language) ? language : "both";
  document.documentElement.dataset.lang = state.language;
  document.documentElement.lang = state.language === "en" ? "en" : "zh-CN";

  languageButtons.forEach((button) => {
    const active = button.dataset.language === state.language;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  saveState();
}

function pathMarkup(stage, choice) {
  const content = pathContent[stage][choice];
  return `
    <div class="logic-line">
      <span><span class="lang-zh">短期结果</span><span class="lang-en">IMMEDIATE</span></span>
      <p>
        <span class="lang-zh">${content.outcome.zh}</span>
        <span class="lang-en">${content.outcome.en}</span>
      </p>
    </div>
    <div class="logic-line">
      <span><span class="lang-zh">长期影响</span><span class="lang-en">LONG TERM</span></span>
      <p>
        <span class="lang-zh">${content.impact.zh}</span>
        <span class="lang-en">${content.impact.en}</span>
      </p>
    </div>
    <div class="logic-line">
      <span><span class="lang-zh">底层逻辑</span><span class="lang-en">REASONING</span></span>
      <p>
        <span class="lang-zh">${content.reason.zh}</span>
        <span class="lang-en">${content.reason.en}</span>
      </p>
    </div>
  `;
}

function selectChoice(stage, choice) {
  state.choices[stage] = choice;
  saveState();

  const screen = document.querySelector(`[data-screen="${stage}"]`);
  screen.querySelectorAll(".option-block").forEach((block) => {
    const button = block.querySelector(".option");
    const logic = block.querySelector(".path-logic");
    const selected = Number(button.dataset.choice) === choice;

    block.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
    logic.classList.toggle("is-visible", selected);
    logic.innerHTML = selected ? pathMarkup(stage, choice) : "";
  });

  const next = screen.querySelector(".next-button");
  next.disabled = false;
  next.setAttribute("aria-disabled", "false");
}

function showScreen(index, options = {}) {
  const safeIndex = Math.max(0, Math.min(screens.length - 1, Number(index) || 0));
  activeScreen = safeIndex;

  screens.forEach((screen, screenIndex) => {
    const active = screenIndex === safeIndex;
    screen.classList.toggle("is-active", active);
    screen.setAttribute("aria-hidden", String(!active));
  });

  headerStatus.textContent = safeIndex === 4
    ? "REVIEW"
    : `${String(safeIndex + 1).padStart(2, "0")} / 05`;

  if (options.scroll !== false) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function restoreChoices() {
  Object.entries(state.choices).forEach(([stage, choice]) => {
    if (pathContent[stage]?.[choice]) {
      selectChoice(Number(stage), Number(choice));
    }
  });
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.go));
});

document.querySelectorAll(".scene-screen").forEach((screen) => {
  const stage = Number(screen.dataset.screen);
  screen.querySelectorAll(".option").forEach((button) => {
    button.addEventListener("click", () => selectChoice(stage, Number(button.dataset.choice)));
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && activeScreen > 0) {
    showScreen(activeScreen - 1);
  }
  if (event.key === "ArrowRight" && activeScreen > 0 && activeScreen < 4) {
    const next = screens[activeScreen].querySelector(".next-button");
    if (next && !next.disabled) {
      showScreen(activeScreen + 1);
    }
  }
});

setLanguage(state.language);
restoreChoices();
showScreen(0, { scroll: false });
