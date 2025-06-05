// ====== Dados iniciais ======

const resources = {
  Grama: { count: 0, perSecond: 0, unlocked: true, upgrades: [0,0,0], lastGen: 0 },
  Madeira: { count: 0, perSecond: 0, unlocked: false, upgrades: [0,0,0], lastGen: 0 },
  Pedra: { count: 0, perSecond: 0, unlocked: false, upgrades: [0,0,0], lastGen: 0 },
  Cobre: { count: 0, perSecond: 0, unlocked: false, upgrades: [0,0,0], lastGen: 0 },
  Ferro: { count: 0, perSecond: 0, unlocked: false, upgrades: [0,0,0], lastGen: 0 },
};

let coins = 0;
let prestige = 0;

const upgradeBaseCosts = [10, 50, 100]; // base para cada tipo de upgrade
const shopItems = [
  { name: "Espada de Pedra", cost: 100, desc: "Aumenta moedas em 10" },
  { name: "Picareta de Ferro", cost: 500, desc: "Aumenta moedas em 50" },
  { name: "Machado de Ouro", cost: 2000, desc: "Aumenta moedas em 200" },
];

const achievementsList = [
  { id: "grana_1k", text: "Coletou 1000 Gramas", check: () => resources.Grama.count >= 1000 },
  { id: "madeira_5k", text: "Coletou 5000 Madeiras", check: () => resources.Madeira.count >= 5000 },
  { id: "pedra_10k", text: "Coletou 10000 Pedras", check: () => resources.Pedra.count >= 10000 },
  { id: "cobre_25k", text: "Coletou 25000 Cobre", check: () => resources.Cobre.count >= 25000 },
  { id: "ferro_50k", text: "Coletou 50000 Ferro", check: () => resources.Ferro.count >= 50000 },
];

let unlockedAchievements = new Set();

// ====== Funções ======

function calcUpgradeCost(level, type) {
  // custo crescente exponencial
  return Math.floor(upgradeBaseCosts[type] * Math.pow(1.5, level));
}

function updateResourceUI(name) {
  const res = resources[name];
  let div = document.getElementById(`res-${name}`);
  if (!div) {
    div = document.createElement("div");
    div.className = "resource";
    div.id = `res-${name}`;
    document.getElementById("resources").appendChild(div);
  }
  div.innerHTML = `
    <h3>${name}</h3>
    <img id="${name.toLowerCase()}Block" src="${name.toLowerCase()}_block.png" alt="Bloco de ${name}" />
    <p>${name}s: <span id="count-${name}">${res.count.toFixed(0)}</span></p>
    <p>${name}/s: <span id="ps-${name}">${res.perSecond}</span></p>
    <button onclick="mine('${name}')">Coletar ${name} (x${1 + res.upgrades[0] + prestige} por clique)</button><br>
    <button onclick="buyUpgrade('${name}', 0)" ${canAffordUpgrade(name,0) ? '' : 'disabled'}>
      Aumentar clique (Nv ${res.upgrades[0]}) - Custo: ${calcUpgradeCost(res.upgrades[0], 0)}
    </button>
    <button onclick="buyUpgrade('${name}', 1)" ${canAffordUpgrade(name,1) ? '' : 'disabled'}>
      +1/s automático (Nv ${res.upgrades[1]}) - Custo: ${calcUpgradeCost(res.upgrades[1], 1)}
    </button>
    <button onclick="buyUpgrade('${name}', 2)" ${canAffordUpgrade(name,2) ? '' : 'disabled'}>
      Reduzir tempo automático (Nv ${res.upgrades[2]}) - Custo: ${calcUpgradeCost(res.upgrades[2], 2)}
    </button>
  `;
  div.style.display = res.unlocked ? "block" : "none";
}

function canAffordUpgrade(name, type) {
  const res = resources[name];
  return coins >= calcUpgradeCost(res.upgrades[type], type);
}

function updateAllResourcesUI() {
  for (const name in resources) {
    updateResourceUI(name);
  }
  document.getElementById("coins").textContent = coins.toFixed(0);
}

function unlockResources() {
  if (!resources.Madeira.unlocked && resources.Grama.count >= 1000) {
    resources.Madeira.unlocked = true;
    alert("Madeira desbloqueada!");
  }
  if (!resources.Pedra.unlocked && resources.Madeira.count >= 5000) {
    resources.Pedra.unlocked = true;
    alert("Pedra desbloqueada!");
  }
  if (!resources.Cobre.unlocked && resources.Pedra.count >= 10000) {
    resources.Cobre.unlocked = true;
    alert("Cobre desbloqueado!");
  }
  if (!resources.Ferro.unlocked && resources.Cobre.count >= 25000) {
    resources.Ferro.unlocked = true;
    alert("Ferro desbloqueado!");
  }
}

function mine(name) {
  const res = resources[name];
  const gain = 1 + res.upgrades[0] + prestige;
  res.count += gain;
  updateResourceUI(name);
  checkAchievements();
  unlockResources();
  saveGame();
}

function buyUpgrade(name, type) {
  const res = resources[name];
  const cost = calcUpgradeCost(res.upgrades[type], type);
  if (coins >= cost) {
    coins -= cost;
    res.upgrades[type]++;
    updateAllResourcesUI();
    updateShop();
    saveGame();
  } else {
    alert("Moedas insuficientes!");
  }
}

function updateShop() {
  const shopDiv = document.getElementById("shop-items");
  shopDiv.innerHTML = "";
  shopItems.forEach((item, i) => {
    const btn = document.createElement("button");
    btn.textContent = `${item.name} - Custo: ${item.cost} moedas`;
    btn.onclick = () => {
      if (coins >= item.cost) {
        coins -= item.cost;
        // efeito do item: só adiciona moedas como exemplo
        coins += item.cost / 10;
        alert(`Comprou ${item.name}! Moedas aumentadas em ${item.cost/10}`);
        updateAllResourcesUI();
        updateShop();
        saveGame();
      } else {
        alert("Moedas insuficientes!");
      }
    };
    shopDiv.appendChild(btn);
  });
}

function generateResources(delta) {
  const now = Date.now();
  for (const name in resources) {
    const res = resources[name];
    if (!res.unlocked) continue;

    // tempo base: 20s por unidade, reduzido por upgrade (cada nível reduz 1s)
    const baseInterval = 20000;
    const timeReduction = 1000 * res.upgrades[2];
    const interval = Math.max(5000, baseInterval - timeReduction);

    if (now - res.lastGen >= interval) {
      const amount = res.upgrades[1];
      if (amount > 0) {
        res.count += amount;
        res.lastGen = now;
        updateResourceUI(name);
        checkAchievements();
        unlockResources();
        saveGame();
      }
    }
  }
}

function checkAchievements() {
  const list = document.getElementById("achievement-list");
  achievementsList.forEach(a => {
    if (!unlockedAchievements.has(a.id) && a.check()) {
      unlockedAchievements.add(a.id);
      const li = document.createElement("li");
      li.textContent = a.text;
      list.appendChild(li);
      alert(`Conquista desbloqueada: ${a.text}`);
      saveGame();
    }
  });
}

function resetGame() {
  if (!confirm("Tem certeza que deseja resetar todo o progresso?")) return;
  for (const name in resources) {
    resources[name].count = 0;
    resources[name].upgrades = [0,0,0];
    resources[name].lastGen = 0;
  }
  resources.Madeira.unlocked = false;
  resources.Pedra.unlocked = false;
  resources.Cobre.unlocked = false;
  resources.Ferro.unlocked = false;
  coins = 0;
  prestige = 0;
  unlockedAchievements.clear();
  document.getElementById("achievement-list").innerHTML = "";
  updateAllResourcesUI();
  updateShop();
  saveGame();
}

function doPrestige() {
  if (!confirm("Quer recomeçar o jogo com bônus de prestígio? Você perderá tudo, mas ganhará +1 ao clique permanentemente.")) return;
  resetGame();
  prestige++;
  alert(`Prestígio ativado! Agora você ganha +${prestige} a cada clique!`);
  updateAllResourcesUI();
  saveGame();
}

function saveGame() {
  const saveData = {
    resources,
    coins,
    prestige,
    unlockedAchievements: Array.from(unlockedAchievements),
  };
  localStorage.setItem("mineClickerSave", JSON.stringify(saveData));
}

function loadGame() {
  const saved = localStorage.getItem("mineClickerSave");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      for (const name in resources) {
        if (data.resources[name]) {
          resources[name].count = data.resources[name].count;
          resources[name].upgrades = data.resources[name].upgrades;
          resources[name].unlocked = data.resources[name].unlocked;
          resources[name].lastGen = data.resources[name].lastGen || 0;
        }
      }
      coins = data.coins || 0;
      prestige = data.prestige || 0;
      unlockedAchievements = new Set(data.unlockedAchievements || []);
      unlockedAchievements.forEach(id => {
        const list = document.getElementById("achievement-list");
        const ach = achievementsList.find(a => a.id === id);
        if (ach) {
          const li = document.createElement("li");
          li.textContent = ach.text;
          list.appendChild(li);
        }
      });
    } catch(e) {
      console.error("Erro ao carregar save:", e);
    }
  }
}

function gameLoop() {
  generateResources();
  updateAllResourcesUI();
  unlockResources();
}

document.getElementById("resetButton").onclick = resetGame;
document.getElementById("prestigeButton").onclick = doPrestige;

// ====== Inicialização ======

loadGame();
updateAllResourcesUI();
updateShop();

setInterval(gameLoop, 1000);
