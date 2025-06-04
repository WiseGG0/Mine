// Código restaurado sem imagens
const resources = {
  grama: { unlocked: true, count: 0, perSecond: 0, baseCost: 10, upgradeLevel: 0 },
  madeira: { unlocked: false, count: 0, perSecond: 0, baseCost: 100, upgradeLevel: 0 },
  pedra: { unlocked: false, count: 0, perSecond: 0, baseCost: 500, upgradeLevel: 0 },
  cobre: { unlocked: false, count: 0, perSecond: 0, baseCost: 1000, upgradeLevel: 0 },
  ferro: { unlocked: false, count: 0, perSecond: 0, baseCost: 2000, upgradeLevel: 0 },
};

const unlockThresholds = {
  madeira: { resource: 'grama', amount: 1000 },
  pedra: { resource: 'madeira', amount: 5000 },
  cobre: { resource: 'pedra', amount: 10000 },
  ferro: { resource: 'cobre', amount: 25000 },
};

let coins = 0;
let prestigeLevel = 0;
let achievements = [];

function saveGame() {
  localStorage.setItem('mineClickerSave', JSON.stringify({ resources, coins, prestigeLevel, achievements }));
}

function loadGame() {
  const save = JSON.parse(localStorage.getItem('mineClickerSave'));
  if (save) {
    Object.assign(resources, save.resources);
    coins = save.coins;
    prestigeLevel = save.prestigeLevel;
    achievements = save.achievements;
  }
}

function resetGame() {
  localStorage.removeItem('mineClickerSave');
  location.reload();
}

function prestige() {
  prestigeLevel++;
  for (let key in resources) {
    resources[key].count = 0;
    resources[key].perSecond = 0;
    resources[key].upgradeLevel = 0;
    resources[key].unlocked = key === 'grama';
  }
  coins = 0;
  saveGame();
  render();
}

function earn(resource) {
  resources[resource].count += 1 + prestigeLevel;
  checkUnlocks();
  checkAchievements();
  render();
  saveGame();
}

function checkUnlocks() {
  for (const key in unlockThresholds) {
    const { resource, amount } = unlockThresholds[key];
    if (!resources[key].unlocked && resources[resource].count >= amount) {
      resources[key].unlocked = true;
    }
  }
}

function upgrade(resource) {
  const level = resources[resource].upgradeLevel;
  const cost = Math.floor(resources[resource].baseCost * Math.pow(1.75, level));
  if (resources[resource].count >= cost) {
    resources[resource].count -= cost;
    resources[resource].upgradeLevel++;
    resources[resource].perSecond += 1 + prestigeLevel;
    render();
    saveGame();
  }
}

function exchange(resource) {
  if (resources[resource].count >= 100) {
    resources[resource].count -= 100;
    coins += 10;
    render();
    saveGame();
  }
}

function checkAchievements() {
  const list = [
    { id: 'a1', text: 'Obtenha 100 gramas', condition: () => resources.grama.count >= 100 },
    { id: 'a2', text: 'Desbloqueie madeira', condition: () => resources.madeira.unlocked },
    { id: 'a3', text: 'Ganhe 100 moedas', condition: () => coins >= 100 },
  ];
  for (const ach of list) {
    if (!achievements.includes(ach.id) && ach.condition()) {
      achievements.push(ach.id);
    }
  }
}

function renderAchievements() {
  const list = document.getElementById('achievements');
  list.innerHTML = '';
  achievements.forEach(id => {
    const li = document.createElement('li');
    li.textContent = id;
    list.appendChild(li);
  });
}

function renderResources() {
  const container = document.getElementById('resources');
  container.innerHTML = '';
  for (const key in resources) {
    const res = resources[key];
    if (res.unlocked) {
      const div = document.createElement('div');
      div.classList.add('resource');
      div.innerHTML = `
        <div>${key}: ${res.count} (+${res.perSecond}/s)</div>
        <button onclick="earn('${key}')">Coletar ${key}</button>
        <button onclick="upgrade('${key}')">Upgrade (${Math.floor(res.baseCost * Math.pow(1.75, res.upgradeLevel))})</button>
        <button onclick="exchange('${key}')">Trocar 100 ${key} por 10 moedas</button>
      `;
      container.appendChild(div);
    }
  }
}

function renderShop() {
  const shop = document.getElementById('shop');
  shop.innerHTML = `Moedas: ${coins}`;
}

function renderPrestige() {
  const el = document.getElementById('prestige-info');
  el.innerHTML = `Prestígio: ${prestigeLevel} <button onclick="prestige()">Recomeçar com bônus</button>`;
}

function render() {
  renderResources();
  renderShop();
  renderAchievements();
  renderPrestige();
}

function gameLoop() {
  for (const key in resources) {
    if (resources[key].perSecond > 0) {
      resources[key].count += resources[key].perSecond;
    }
  }
  checkUnlocks();
  checkAchievements();
  render();
  saveGame();
}

loadGame();
render();
setInterval(gameLoop, 1000);
