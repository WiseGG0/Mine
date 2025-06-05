const baseResources = [
  {
    nome: "Grama",
    id: "grama",
    img: "assets/grass_block.png",
    quantidade: 0,
    porClick: 1,
    porSegundo: 0,
    tempoAuto: 20,
    tempoAtual: 0,
    desbloqueado: true,
    desbloqueioRequisito: 0,
    desbloqueioRecurso: null,
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 10 },
      { nome: "+1/s", nivel: 0, custo: 50 },
      { nome: "-1s geração", nivel: 0, custo: 100 }
    ]
  },
  {
    nome: "Madeira",
    id: "madeira",
    img: "assets/log.png",
    quantidade: 0,
    porClick: 1,
    porSegundo: 0,
    tempoAuto: 20,
    tempoAtual: 0,
    desbloqueado: false,
    desbloqueioRequisito: 1000,
    desbloqueioRecurso: "grama",
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 100 },
      { nome: "+1/s", nivel: 0, custo: 500 },
      { nome: "-1s geração", nivel: 0, custo: 1000 }
    ]
  },
  {
    nome: "Pedra",
    id: "pedra",
    img: "assets/stone.png",
    quantidade: 0,
    porClick: 1,
    porSegundo: 0,
    tempoAuto: 20,
    tempoAtual: 0,
    desbloqueado: false,
    desbloqueioRequisito: 5000,
    desbloqueioRecurso: "madeira",
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 1000 },
      { nome: "+1/s", nivel: 0, custo: 2500 },
      { nome: "-1s geração", nivel: 0, custo: 5000 }
    ]
  },
  {
    nome: "Cobre",
    id: "cobre",
    img: "assets/copper.png",
    quantidade: 0,
    porClick: 1,
    porSegundo: 0,
    tempoAuto: 20,
    tempoAtual: 0,
    desbloqueado: false,
    desbloqueioRequisito: 10000,
    desbloqueioRecurso: "pedra",
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 5000 },
      { nome: "+1/s", nivel: 0, custo: 10000 },
      { nome: "-1s geração", nivel: 0, custo: 20000 }
    ]
  },
  {
    nome: "Ferro",
    id: "ferro",
    img: "assets/iron.png",
    quantidade: 0,
    porClick: 1,
    porSegundo: 0,
    tempoAuto: 20,
    tempoAtual: 0,
    desbloqueado: false,
    desbloqueioRequisito: 25000,
    desbloqueioRecurso: "cobre",
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 20000 },
      { nome: "+1/s", nivel: 0, custo: 50000 },
      { nome: "-1s geração", nivel: 0, custo: 100000 }
    ]
  }
];

let resources = JSON.parse(localStorage.getItem("mineClickerSave")) || baseResources;

function saveGame() {
  localStorage.setItem("mineClickerSave", JSON.stringify(resources));
}

function renderResources() {
  const resourcesDiv = document.getElementById("resources");
  resourcesDiv.innerHTML = "";

  resources.forEach((res, index) => {
    if (!res.desbloqueado) return;

    const container = document.createElement("div");
    container.className = "resource";

    const img = document.createElement("img");
    img.src = res.img;
    img.alt = res.nome;
    img.style.cursor = "pointer";
    img.onclick = () => {
      res.quantidade += res.porClick;
      checkUnlocks();
      renderResources();
      checkAchievements(res);
    };

    const label = document.createElement("p");
    label.textContent = `${res.nome}: ${res.quantidade}`;

    const info = document.createElement("p");
    info.textContent = `+${res.porSegundo}/s, Tempo: ${res.tempoAuto}s`;

    const upgradeDiv = document.createElement("div");
    res.upgrades.forEach((upg, i) => {
      const btn = document.createElement("button");
      btn.textContent = `${upg.nome} (Nv ${upg.nivel}) - Custo: ${upg.custo}`;
      btn.onclick = () => {
        if (res.quantidade >= upg.custo) {
          res.quantidade -= upg.custo;
          upg.nivel++;
          if (i === 0) res.porClick++;
          if (i === 1) res.porSegundo++;
          if (i === 2 && res.tempoAuto > 1) res.tempoAuto--;
          upg.custo = Math.floor(upg.custo * 1.5);
          renderResources();
        }
      };
      upgradeDiv.appendChild(btn);
    });

    container.appendChild(img);
    container.appendChild(label);
    container.appendChild(info);
    container.appendChild(upgradeDiv);
    resourcesDiv.appendChild(container);
  });
}

function checkUnlocks() {
  resources.forEach(res => {
    if (!res.desbloqueado && res.desbloqueioRecurso) {
      const parent = resources.find(r => r.id === res.desbloqueioRecurso);
      if (parent && parent.quantidade >= res.desbloqueioRequisito) {
        res.desbloqueado = true;
      }
    }
  });
}

function autoGenerate() {
  resources.forEach(res => {
    if (res.desbloqueado) {
      res.tempoAtual++;
      if (res.tempoAtual >= res.tempoAuto) {
        res.quantidade += res.porSegundo;
        res.tempoAtual = 0;
        checkAchievements(res);
      }
    }
  });
  checkUnlocks();
  renderResources();
}

function checkAchievements(res) {
  const list = document.getElementById("achievement-list");
  const achieved = document.querySelector(`#achiev-${res.id}`);
  if (!achieved && res.quantidade >= 100) {
    const item = document.createElement("li");
    item.id = `achiev-${res.id}`;
    item.textContent = `Conquistou 100 ${res.nome}!`;
    list.appendChild(item);
  }
}

document.getElementById("resetButton").onclick = () => {
  if (confirm("Deseja realmente resetar seu progresso?")) {
    localStorage.removeItem("mineClickerSave");
    location.reload();
  }
};

renderResources();
setInterval(() => {
  autoGenerate();
  saveGame();
}, 1000);
