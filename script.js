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
