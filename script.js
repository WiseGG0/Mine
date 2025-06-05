// Base dos recursos
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

// Estado do gerador automático comprado
let autoGeneratorBought = JSON.parse(localStorage.getItem("autoGeneratorBought")) || false;
const autoGeneratorCost = 10;

// Salvar progresso
function saveGame() {
  localStorage.setItem("mineClickerSave", JSON.stringify(resources));
  localStorage.setItem("moedas", moedas);
  localStorage.setItem("autoGeneratorBought", JSON.stringify(autoGeneratorBought));
}

// Renderizar recursos
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
    img.title = `Clique para coletar ${res.porClick} ${res.nome}`;
    img.onclick = () => {
      res.quantidade += res.porClick;
      checkUnlocks();
      renderResources();
      checkAchievements(res);
    };

    const label = document.createElement("p");
    label.textContent = `${res.nome}: ${res.quantidade}`;

    const info = document.createElement("p");
    info.textContent = `+${res.porSegundo}/s, Tempo geração: ${res.tempoAuto}s`;

    // Botão de venda
    const sellBtn = document.createElement("button");
    sellBtn.textContent = `Vender 100 ${res.nome} por ${res.valorVenda} moeda(s)`;
    sellBtn.onclick = () => {
      if (res.quantidade >= 100) {
        res.quantidade -= 100;
        moedas += res.valorVenda;
        renderResources();
        renderShop();
      } else {
        alert(`Você precisa de pelo menos 100 ${res.nome} para vender.`);
      }
    };

    // Upgrades
    const upgradeDiv = document.createElement("div");
    res.upgrades.forEach((upg, i) => {
      const btn = document.createElement("button");
      btn.textContent = `${upg.nome} (Nv ${upg.nivel}) - Custo: ${upg.custo}`;
      btn.onclick = () => {
        if (moedas >= upg.custo) {
          moedas -= upg.custo;
          upg.nivel++;
          if (i === 0) res.porClick++;
          if (i === 1) res.porSegundo++;
          if (i === 2 && res.tempoAuto > 1) res.tempoAuto--;
          upg.custo = Math.floor(upg.custo * 1.5);
          renderResources();
          renderShop();
          saveGame();
        } else {
          alert("Moedas insuficientes para comprar upgrade.");
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

// Renderizar loja
function renderShop() {
  const shopDiv = document.getElementById("shop-items");
  shopDiv.innerHTML = "";

  // Gerador automático
  const autoGenDiv = document.createElement("div");
  autoGenDiv.className = "shop-item";

  const title = document.createElement("p");
  title.textContent = "Gerador Automático (custa 10 moedas)";
  autoGenDiv.appendChild(title);

  const btnBuyAutoGen = document.createElement("button");
  btnBuyAutoGen.textContent = autoGeneratorBought ? "Comprado" : "Comprar Gerador Automático (10 moedas)";
  btnBuyAutoGen.disabled = autoGeneratorBought;
  btnBuyAutoGen.onclick = () => {
    if (moedas >= autoGeneratorCost) {
      moedas -= autoGeneratorCost;
      autoGeneratorBought = true;
      renderShop();
      saveGame();
    } else {
      alert("Você não tem moedas suficientes para comprar o gerador automático.");
    }
  };
  autoGenDiv.appendChild(btnBuyAutoGen);

  shopDiv.appendChild(autoGenDiv);

  document.getElementById("coins").textContent = moedas;
}

// Desbloquear novos recursos
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

// Geração automática
function autoGenerate(delta) {
  if (!autoGeneratorBought) return;

  resources.forEach(res => {
    if (!res.desbloqueado) return;

    res.tempoAtual += delta;
    if (res.tempoAtual >= res.tempoAuto) {
      res.quantidade += res.porSegundo;
      res.tempoAtual = 0;
    }
  });
}

// Conquistas (exemplo simples)
function checkAchievements(res) {
  // Aqui você pode implementar a lógica de conquistas se quiser
}

function mainLoop(timestamp) {
  if (!mainLoop.lastTimestamp) mainLoop.lastTimestamp = timestamp;
  const delta = (timestamp - mainLoop.lastTimestamp) / 1000;
  mainLoop.lastTimestamp = timestamp;

  autoGenerate(delta);
  renderResources();
  saveGame();

  requestAnimationFrame(mainLoop);
}

// Resetar jogo
document.getElementById("resetButton").onclick = () => {
  if (confirm("Quer realmente resetar o progresso?")) {
    resources = JSON.parse(JSON.stringify(baseResources));
    moedas = 0;
    autoGeneratorBought = false;
    saveGame();
    renderResources();
    renderShop();
  }
};

// Iniciar jogo
checkUnlocks();
renderResources();
renderShop();
requestAnimationFrame(mainLoop);
