const resources = [
  {
    name: "Grama",
    key: "grama",
    image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/3c/Grass_Block_JE5_BE5.png",
    unlocked: true,
    amount: 0,
    auto: 0,
    clickPower: 1,
    unlockCost: 0
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
    unlockDependency: "grama"
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
    unlockDependency: "madeira"
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
    unlockDependency: "pedra"
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
    unlockDependency: "cobre"
  }
];

function createResourceElement(resource) {
  const div = document.createElement("div");
  div.className = "resource";
  div.id = resource.key;

  const icon = document.createElement("div");
  icon.className = "clickable";
  icon.style.backgroundImage = `url(${resource.image})`;
  icon.ontouchstart = icon.onclick = () => {
    resource.amount += resource.clickPower;
    update();
  };
  div.appendChild(icon);

  const label = document.createElement("p");
  label.textContent = `${resource.name}: ${resource.amount}`;
  label.id = `${resource.key}-count`;
  div.appendChild(label);

  const upgradeBtn = document.createElement("button");
  upgradeBtn.textContent = `Upgrade automático (+1/s) - Custa 50`;
  upgradeBtn.onclick = () => {
    if (resource.amount >= 50) {
      resource.amount -= 50;
      resource.auto += 1;
      update();
    }
  };
  div.appendChild(upgradeBtn);

  return div;
}

function update() {
  const container = document.getElementById("resources");
  container.innerHTML = "";

  for (let res of resources) {
    if (!res.unlocked && res.unlockDependency) {
      const dep = resources.find(r => r.key === res.unlockDependency);
      if (dep.amount >= res.unlockCost) {
        res.unlocked = true;
      }
    }

    if (res.unlocked) {
      const el = createResourceElement(res);
      container.appendChild(el);
    }
  }
}

setInterval(() => {
  for (let res of resources) {
    res.amount += res.auto;
  }
  update();
}, 1000);

update();
