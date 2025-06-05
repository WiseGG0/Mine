// Estrutura base de recurso com upgrades, auto produção, conquistas, salvamento e sistema de vendas
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
  }
  // Adicione outros recursos aqui
];

let resources = JSON.parse(localStorage.getItem("mineClickerSave")) || baseResources;
let moedas = parseInt(localStorage.getItem("moedas")) || 0;
let geradorBonus = parseInt(localStorage.getItem("geradorBonus")) || 0;

function saveGame() {
  localStorage.setItem("mineClickerSave", JSON.stringify(resources));
  localStorage.setItem("moedas", moedas);
  localStorage.setItem("geradorBonus", geradorBonus);
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
    info.textContent = `+${res.porSegundo}/s, Tempo: ${res.tempoAuto}s`;

    const sellBtn = document.createElement("button");
    sellBtn.textContent = `Vender 100 ${res.nome} por ${res.valorVenda} moeda(s)`;
    sellBtn.onclick = () => {
      if (res.quantidade >= 100) {
        res.quantidade -= 100;
        moedas += res.valorVenda;
        renderResources();
        renderBonusShop();
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

function renderBonusShop() {
  const bonusDiv = document.getElementById("bonus-items");
  bonusDiv.innerHTML = "";

  const btn = document.createElement("button");
  btn.textContent = `Comprar Gerador Automático (10 moedas)`;
  btn.disabled = moedas < 10;
  btn.onclick = () => {
    if (moedas >= 10) {
      moedas -= 10;
      geradorBonus++;
      renderBonusShop();
      renderResources();
    }
  };

  bonusDiv.appendChild(btn);
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
  for (let i = 0; i < 1 + geradorBonus; i++) {
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
  }
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
    localStorage.clear();
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
    geradorBonus = 0;
    saveGame();
    renderResources();
    renderBonusShop();
  }
};

renderResources();
renderBonusShop();
setInterval(() => {
  autoGenerate();
  saveGame();
}, 1000);
