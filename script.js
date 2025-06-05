// Estrutura base com recursos, upgrades e vendas
const baseResources = [
  {
    nome: "Grama",
    id: "grama",
    img: "grass_block.png",
    quantidade: 0,
    porClick: 1,
    porSegundo: 0,
    tempoAuto: 20,
    tempoAtual: 0,
    desbloqueado: true,
    desbloqueioRequisito: 0,
    desbloqueioRecurso: null,
    valorVenda: 1,
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 10 },
      { nome: "+1/s", nivel: 0, custo: 50 },
      { nome: "-1s geração", nivel: 0, custo: 100 }
    ]
  },
  {
    nome: "Madeira",
    id: "madeira",
    img: "log.png",
    quantidade: 0,
    porClick: 1,
    porSegundo: 0,
    tempoAuto: 20,
    tempoAtual: 0,
    desbloqueado: false,
    desbloqueioRequisito: 1000,
    desbloqueioRecurso: "grama",
    valorVenda: 2,
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 100 },
      { nome: "+1/s", nivel: 0, custo: 500 },
      { nome: "-1s geração", nivel: 0, custo: 1000 }
    ]
  },
  {
    nome: "Pedra",
    id: "pedra",
    img: "stone.png",
    quantidade: 0,
    porClick: 1,
    porSegundo: 0,
    tempoAuto: 20,
    tempoAtual: 0,
    desbloqueado: false,
    desbloqueioRequisito: 5000,
    desbloqueioRecurso: "madeira",
    valorVenda: 3,
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 1000 },
      { nome: "+1/s", nivel: 0, custo: 2500 },
      { nome: "-1s geração", nivel: 0, custo: 5000 }
    ]
  },
  {
    nome: "Cobre",
    id: "cobre",
    img: "copper.png",
    quantidade: 0,
    porClick: 1,
    porSegundo: 0,
    tempoAuto: 20,
    tempoAtual: 0,
    desbloqueado: false,
    desbloqueioRequisito: 10000,
    desbloqueioRecurso: "pedra",
    valorVenda: 4,
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 5000 },
      { nome: "+1/s", nivel: 0, custo: 10000 },
      { nome: "-1s geração", nivel: 0, custo: 20000 }
    ]
  },
  {
    nome: "Ferro",
    id: "ferro",
    img: "iron.png",
    quantidade: 0,
    porClick: 1,
    porSegundo: 0,
    tempoAuto: 20,
    tempoAtual: 0,
    desbloqueado: false,
    desbloqueioRequisito: 25000,
    desbloqueioRecurso: "cobre",
    valorVenda: 5,
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 20000 },
      { nome: "+1/s", nivel: 0, custo: 50000 },
      { nome: "-1s geração", nivel: 0, custo: 100000 }
    ]
  }
];

let resources = JSON.parse(localStorage.getItem("mineClickerSave")) || baseResources;
let moedas = parseInt(localStorage.getItem("moedas")) || 0;

function saveGame() {
  localStorage.setItem("mineClickerSave", JSON.stringify(resources));
  localStorage.setItem("moedas", moedas);
}

function renderResources() {
  const resourcesDiv = document.getElementById("resources");
  resourcesDiv.innerHTML = "";

  resources.forEach((res) => {
    if (!res.desbloqueado) return;

    const container = document.createElement("div");
    container.className = "resource";

    const img = document.createElement("img");
    img.src = res.img;
    img.alt = res.nome;
    img.onclick = () => {
      res.quantidade += res.porClick;
      checkUnlocks();
      renderResources();
      checkAchievements(res);
    };

    const label = document.createElement("p");
    label.textContent = `${res.nome}: ${res.quantidade}`;

    const info = document.createElement("p");
    info.textContent = `+${res.porSegundo}/s | Tempo: ${res.tempoAuto}s`;

    const sellBtn = document.createElement("button");
    sellBtn.textContent = `Vender 100 ${res.nome} por ${res.valorVenda} moeda(s)`;
    sellBtn.onclick = () => {
      if (res.quantidade >= 100) {
        res.quantidade -= 100;
        moedas += res.valorVenda;
        renderResources();
        renderShop();
      }
    };

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
    container.appendChild(sellBtn);
    container.appendChild(upgradeDiv);
    resourcesDiv.appendChild(container);
  });

  document.getElementById("coins").textContent = moedas;
}

function renderShop() {
  document.getElementById("coins").textContent = moedas;
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
    localStorage.removeItem("moedas");
    location.reload();
  }
};

document.getElementById("prestigeButton").onclick = () => {
  if (confirm("Deseja fazer prestígio? Você perderá seus recursos, mas poderá ganhar bônus futuramente.")) {
    resources.forEach(res => {
      res.quantidade = 0;
      res.porClick = 1;
      res.porSegundo = 0;
      res.tempoAuto = 20;
      res.tempoAtual = 0;
      res.upgrades.forEach(upg => {
        upg.nivel = 0;
        upg.custo = Math.floor(upg.custo / Math.pow(1.5, upg.nivel));
      });
    });
    moedas = 0;
    saveGame();
    renderResources();
  }
};

renderResources();
setInterval(() => {
  autoGenerate();
  saveGame();
}, 1000);
