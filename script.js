window.onload = () => {
  const resources = [
    {
      nome: "Grama",
      id: "grama",
      img: "grass_block.png",
      quantidade: 0,
      porClick: 1,
      desbloqueado: true,
      desbloqueioRequisito: 0,
      desbloqueioRecurso: null
    },
    {
      nome: "Madeira",
      id: "madeira",
      img: "log.png",
      quantidade: 0,
      porClick: 1,
      desbloqueado: false,
      desbloqueioRequisito: 1000,
      desbloqueioRecurso: "grama"
    },
    {
      nome: "Pedra",
      id: "pedra",
      img: "stone.png",
      quantidade: 0,
      porClick: 1,
      desbloqueado: false,
      desbloqueioRequisito: 5000,
      desbloqueioRecurso: "madeira"
    },
    {
      nome: "Cobre",
      id: "cobre",
      img: "copper.png",
      quantidade: 0,
      porClick: 1,
      desbloqueado: false,
      desbloqueioRequisito: 10000,
      desbloqueioRecurso: "pedra"
    },
    {
      nome: "Ferro",
      id: "ferro",
      img: "iron.png",
      quantidade: 0,
      porClick: 1,
      desbloqueado: false,
      desbloqueioRequisito: 25000,
      desbloqueioRecurso: "cobre"
    }
  ];

  const resourcesDiv = document.getElementById("resources");

  function renderResources() {
    resourcesDiv.innerHTML = "";

    resources.forEach(resource => {
      if (resource.desbloqueado) {
        const container = document.createElement("div");
        container.classList.add("resource");

        const img = document.createElement("img");
        img.src = resource.img;
        img.alt = resource.nome;
        img.style.width = "100px";
        img.style.cursor = "pointer";
        img.onclick = () => {
          resource.quantidade += resource.porClick;
          checkUnlocks();
          renderResources();
        };

        const label = document.createElement("p");
        label.textContent = `${resource.nome}: ${resource.quantidade}`;

        container.appendChild(img);
        container.appendChild(label);
        resourcesDiv.appendChild(container);
      }
    });
  }

  function checkUnlocks() {
    resources.forEach(resource => {
      if (!resource.desbloqueado && resource.desbloqueioRecurso) {
        const req = resources.find(r => r.id === resource.desbloqueioRecurso);
        if (req && req.quantidade >= resource.desbloqueioRequisito) {
          resource.desbloqueado = true;
        }
      }
    });
  }

  renderResources();
  setInterval(() => {
    // Exemplo de save automático e atualização
    localStorage.setItem("mineClickerSave", JSON.stringify(resources));
  }, 3000);
};
// Estrutura base de recurso com upgrades, auto produção e salvamento
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
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 100 },
      { nome: "+1/s", nivel: 0, custo: 500 },
      { nome: "-1s geração", nivel: 0, custo: 1000 }
    ]
  },
  // Pedra, Cobre, Ferro semelhantes, omitido aqui por brevidade
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
    img.style.width = "100px";
    img.style.cursor = "pointer";
    img.onclick = () => {
      res.quantidade += res.porClick;
      checkUnlocks();
      renderResources();
    };

    const label = document.createElement("p");
    label.textContent = `${res.nome}: ${res.quantidade}`;

    const info = document.createElement("p");
    info.textContent = `+${res.porSegundo}/s, Tempo: ${res.tempoAuto}s`;

    // Upgrades
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
      }
    }
  });
  checkUnlocks();
  renderResources();
}

setInterval(() => {
  autoGenerate();
  saveGame();
}, 1000);

document.getElementById("resetButton").onclick = () => {
  if (confirm("Deseja realmente resetar seu progresso?")) {
    localStorage.removeItem("mineClickerSave");
    location.reload();
  }
};

renderResources();
