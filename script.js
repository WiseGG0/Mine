const BASE_UPGRADE_COST = 50;
const COST_MULTIPLIER = 1.15;
const SAVE_KEY = "mineClickerSave";

const resources = [
  {
    name: "Grama",
    key: "grama",
    image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/3c/Grass_Block_JE5_BE5.png",
    unlocked: true,
    amount: 0,
    auto: 0,
    clickPower: 1,
    unlockCost: 0,
    upgradeLevel: 0
  },
  {
    name: "Madeira",
    key: "madeira",
    image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/5/5e/Oak_Log.png",
    unlocked: false,
    amount: 0,
    auto: 0,
    clickPower: 1,
    unlockCost: 1000,
    unlockDependency: "grama",
    upgradeLevel: 0
  },
  {
    name: "Pedra",
    key: "pedra",
    image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/8/89/Stone_JE3_BE3.png",
    unlocked: false,
    amount: 0,
    auto: 0,
    clickPower: 1,
    unlockCost: 5000,
    unlockDependency: "madeira",
    upgradeLevel: 0
  },
  {
    name: "Cobre",
    key: "cobre",
    image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/f0/Block_of_Raw_Copper_JE2_BE2.png",
    unlocked: false,
    amount: 0,
    auto: 0,
    clickPower: 1,
    unlockCost: 10000,
    unlockDependency: "pedra",
    upgradeLevel: 0
  },
  {
    name: "Ferro",
    key: "ferro",
    image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/b/b1/Block_of_Raw_Iron_JE2_BE2.png",
    unlocked: false,
    amount: 0,
    auto: 0,
    clickPower: 1,
    unlockCost: 25000,
    unlockDependency: "cobre",
    upgradeLevel: 0
  }
];

// Moedas para loja
let coins = 0;
// Prestígio - bônus multiplicador na coleta
let prestigeCount = 0;
let prestigeMultiplier = 1;

const achievements = [
  {
    id: "firstClick",
    name: "Primeiro Clique",
    description: "Clique no bloco pela primeira vez",
    achieved: false,
    check: () => totalClicks >= 1
  },
  {
    id: "grama100",
    name: "100 Gramas",
    description: "Colete 100 unidades de Grama",
    achieved: false,
    check: () => getResource("grama").amount >= 100
  },
  {
    id: "madeira1000",
    name: "1000 Madeiras",
    description: "Colete 1000 unidades de Madeira",
    achieved: false,
    check: () => getResource("madeira").amount >= 1000
  },
  {
    id: "pedra5000",
    name: "5000 Pedras",
    description: "Colete 5000 unidades de Pedra",
    achieved: false,
    check: () => getResource("pedra").amount >= 5000
  },
  {
    id: "cobre10000",
    name: "10000 Cobres",
    description: "Colete 10000 unidades de Cobre",
    achieved: false,
    check: () => getResource("cobre").amount >= 10000
  },
  {
    id: "ferro25000",
    name: "25000 Ferros",
    description: "Colete 25000 unidades de Ferro",
    achieved: false,
    check: () => getResource("ferro").amount >= 25000
  },
  {
    id: "prestige1",
    name: "Primeiro Prestígio",
    description: "Realize seu primeiro prestígio",
    achieved: false,
    check: () => prestigeCount >= 1
  }
];

let totalClicks = 0;

function getResource(key) {
  return resources.find(r => r.key === key);
}

function createResourceElement(resource) {
  const div = document.createElement("div");
  div.className = "resource";
  div.id = resource.key;

  const icon = document.createElement("div");
  icon.className = "clickable";
  icon.style.backgroundImage = `url(${resource.image})`;
  icon.ontouchstart = icon.onclick = () => {
    resource.amount += resource.clickPower * prestigeMultiplier;
    totalClicks++;
    updateAchievements();
    update();
  };
  div.appendChild(icon);

  const label = document.createElement("p");
  label.innerHTML = `<strong>${resource.name}</strong>: ${Math.floor(resource.amount)}`;
  div.appendChild(label);

  const perSec = document.createElement("p");
  perSec.textContent = `Produção: ${(resource.auto * prestigeMultiplier).toFixed(1)} / s`;
  div.appendChild(perSec);

  const upgradeBtn = document.createElement("button");
   upgradeBtn.textContent = `Upgrade automático (+1/s) - Custa ${getUpgradeCost(resource).toFixed(0)} ${resource.name}`;
  upgradeBtn.onclick = () => {
    const cost = getUpgradeCost(resource);
    if (resource.amount >= cost) {
      resource.amount -= cost;
      resource.auto += 1;
      resource.upgradeLevel++;
      update();
    }
  };
  div.appendChild(upgradeBtn);

  document.getElementById("resources").appendChild(div);
}

function getUpgradeCost(resource) {
  return BASE_UPGRADE_COST * Math.pow(COST_MULTIPLIER, resource.upgradeLevel);
}

function updateResourcesUI() {
  document.getElementById("resources").innerHTML = "";
  resources.forEach(resource => {
    if (!resource.unlocked && canUnlock(resource)) {
      resource.unlocked = true;
    }
    if (resource.unlocked) {
      createResourceElement(resource);
    }
  });
}

function canUnlock(resource) {
  if (!resource.unlockDependency) return true;
  return getResource(resource.unlockDependency).amount >= resource.unlockCost;
}

function updateAchievements() {
  achievements.forEach(ach => {
    if (!ach.achieved && ach.check()) {
      ach.achieved = true;
      const li = document.createElement("li");
      li.textContent = `🏆 ${ach.name}: ${ach.description}`;
      document.getElementById("achievements").appendChild(li);
    }
  });
}

function updateShop() {
  const shop = document.getElementById("shop");
  shop.innerHTML = "";
  resources.forEach(r => {
    if (r.unlocked && r.amount > 0) {
      const item = document.createElement("div");
      item.className = "shop-item";
      item.innerHTML = `
        <span>Vender ${r.name} por ${getSellPrice(r)} moedas</span>
        <button onclick="sellResource('${r.key}')">Vender</button>
      `;
      shop.appendChild(item);
    }
  });
}

function getSellPrice(resource) {
  return Math.floor(resource.amount / 10);
}

function sellResource(key) {
  const res = getResource(key);
  const gain = getSellPrice(res);
  if (gain > 0) {
    res.amount = 0;
    coins += gain;
    update();
  }
}

function updatePrestigeInfo() {
  const div = document.getElementById("prestige-info");
  div.innerHTML = `
    Prestígio: ${prestigeCount} <br/>
    Bônus Atual: x${prestigeMultiplier} <br/>
    <button onclick=\"doPrestige()\">Fazer Prestígio (custa 10000 moedas)</button>
  `;
}

function doPrestige() {
  if (coins >= 10000) {
    coins = 0;
    prestigeCount++;
    prestigeMultiplier += 0.5;
    totalClicks = 0;
    resources.forEach(r => {
      r.amount = 0;
      r.auto = 0;
      r.clickPower = 1;
      r.unlocked = r.key === "grama";
      r.upgradeLevel = 0;
    });
    achievements.forEach(a => (a.achieved = false));
    document.getElementById("achievements").innerHTML = "";
    update();
  }
}

function update() {
  updateResourcesUI();
  updateShop();
  updateAchievements();
  updatePrestigeInfo();
  saveGame();
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

function gameLoop() {
  resources.forEach(r => {
    r.amount += r.auto * prestigeMultiplier;
  });
  update();
}

function saveGame() {
  const data = {
    resources,
    coins,
    prestigeCount,
    prestigeMultiplier,
    achievements: achievements.map(a => a.achieved),
    totalClicks
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem(SAVE_KEY));
  if (data) {
    resources.forEach((r, i) => {
      Object.assign(r, data.resources[i]);
    });
    coins = data.coins;
    prestigeCount = data.prestigeCount;
    prestigeMultiplier = data.prestigeMultiplier;
    data.achievements.forEach((a, i) => (achievements[i].achieved = a));
    totalClicks = data.totalClicks || 0;
  }
}

loadGame();
update();
setInterval(gameLoop, 1000);
