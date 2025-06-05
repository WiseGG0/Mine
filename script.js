const baseResources = [
  {
    nome: "Grama",
    id: "grama",
    img: "grass_block.png",
    quantidade: 0,
    porClick: 1,
    desbloqueado: true,
    desbloqueioRequisito: 0,
    desbloqueioCustoMoeda: 0,
    valorVenda: 1,
    upgrades: [{ nome: "+1 por click", nivel: 0, custo: 10 }],
    gerador: {
      comprado: false,
      porSegundo: 0,
      tempoAuto: 20,
      tempoAtual: 0,
      upgrades: [
        { nome: "+1/s", nivel: 0, custo: 10 },
        { nome: "-1s geração", nivel: 0, custo: 20 }
      ]
    }
  },
  {
    nome: "Madeira",
    id: "madeira",
    img: "log.png",
    quantidade: 0,
    porClick: 1,
    desbloqueado: false,
    desbloqueioRequisito: 0,
    desbloqueioCustoMoeda: 10,
    valorVenda: 2,
    upgrades: [{ nome: "+1 por click", nivel: 0, custo: 100 }],
    gerador: {
      comprado: false,
      porSegundo: 0,
      tempoAuto: 20,
      tempoAtual: 0,
      upgrades: [
        { nome: "+1/s", nivel: 0, custo: 50 },
        { nome: "-1s geração", nivel: 0, custo: 100 }
      ]
    }
  },
  {
    nome: "Pedra",
    id: "pedra",
    img: "stone.png",
    quantidade: 0,
    porClick: 1,
    desbloqueado: false,
    desbloqueioRequisito: 0,
    desbloqueioCustoMoeda: 100,
    valorVenda: 3,
    upgrades: [{ nome: "+1 por click", nivel: 0, custo: 500 }],
    gerador: {
      comprado: false,
      porSegundo: 0,
      tempoAuto: 20,
      tempoAtual: 0,
      upgrades: [
        { nome: "+1/s", nivel: 0, custo: 200 },
        { nome: "-1s geração", nivel: 0, custo: 500 }
      ]
    }
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

  resources.forEach(res => {
    if (!res.desbloqueado) return;

    const container = document.createElement("div");
    container.className = "resource";

    const img = document.createElement("img");
    img.src = res.img;
    img.alt = res.nome;
    img.onclick = () => {
      res.quantidade += res.porClick;
      renderResources();
      checkAchievements(res);
    };

    const label = document.createElement("p");
    label.textContent = `${res.nome}: ${res.quantidade}`;

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

    // Upgrade de recurso
    const upgradeBtn = document.createElement("button");
    const upg = res.upgrades[0];
    upgradeBtn.textContent = `${upg.nome} (Nv ${upg.nivel}) - Custo: ${upg.custo}`;
    upgradeBtn.onclick = () => {
      if (res.quantidade >= upg.custo) {
        res.quantidade -= upg.custo;
        upg.nivel++;
        res.porClick++;
        upg.custo = Math.floor(upg.custo * 1.5);
        renderResources();
      }
    };

    // Gerador
    const geradorDiv = document.createElement("div");
    geradorDiv.innerHTML = "<strong>Gerador Automático</strong><br>";

    if (!res.gerador.comprado) {
      const buyGerador = document.createElement("button");
      buyGerador.textContent = `Comprar Gerador - 10 moedas`;
      buyGerador.onclick = () => {
        if (moedas >= 10) {
          moedas -= 10;
          res.gerador.comprado = true;
          renderResources();
        }
      };
      geradorDiv.appendChild(buyGerador);
    } else {
      res.gerador.upgrades.forEach((upg, i) => {
        const btn = document.createElement("button");
        btn.textContent = `${upg.nome} (Nv ${upg.nivel}) - ${upg.custo} moedas`;
        btn.onclick = () => {
          if (moedas >= upg.custo) {
            moedas -= upg.custo;
            upg.nivel++;
            if (i === 0) res.gerador.porSegundo++;
            if (i === 1 && res.gerador.tempoAuto > 1) res.gerador.tempoAuto--;
            upg.custo = Math.floor(upg.custo * 2);
            renderResources();
          }
        };
        geradorDiv.appendChild(btn);
      });
    }

    container.appendChild(img);
    container.appendChild(label);
    container.appendChild(sellBtn);
    container.appendChild(upgradeBtn);
    container.appendChild(geradorDiv);
    resourcesDiv.appendChild(container);
  });

  document.getElementById("coins").textContent = moedas;
}

function renderShop() {
  const loja = document.getElementById("moeda-loja");
  loja.innerHTML = "";

  resources.forEach(res => {
    if (res.desbloqueado || res.desbloqueioCustoMoeda === 0) return;
    const btn = document.createElement("button");
    btn.textContent = `Desbloquear ${res.nome} - ${res.desbloqueioCustoMoeda} moedas`;
    btn.onclick = () => {
      if (moedas >= res.desbloqueioCustoMoeda) {
        moedas -= res.desbloqueioCustoMoeda;
        res.desbloqueado = true;
        renderResources();
        renderShop();
      }
    };
    loja.appendChild(btn);
  });

  document.getElementById("coins").textContent = moedas;
}

function autoGenerate() {
  resources.forEach(res => {
    if (res.gerador.comprado) {
      res.gerador.tempoAtual++;
      if (res.gerador.tempoAtual >= res.gerador.tempoAuto) {
        res.quantidade += res.gerador.porSegundo;
        res.gerador.tempoAtual = 0;
        checkAchievements(res);
      }
    }
  });
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

document.getElementById("prestigeButton").onclick = () => {
  if (confirm("Fazer Rebirth? Isso reiniciará seus recursos mas manterá suas moedas.")) {
    resources.forEach(res => {
      res.quantidade = 0;
      res.porClick = 1;
      res.desbloqueado = res.desbloqueioCustoMoeda === 0;
      res.upgrades.forEach(u => {
        u.nivel = 0;
        u.custo = 10;
      });
      res.gerador.comprado = false;
      res.gerador.porSegundo = 0;
      res.gerador.tempoAuto = 20;
      res.gerador.tempoAtual = 0;
      res.gerador.upgrades.forEach(u => {
        u.nivel = 0;
        u.custo = u.nome.includes("+1/s") ? 10 : 20;
      });
    });
    saveGame();
    renderResources();
    renderShop();
  }
};

renderResources();
renderShop();
setInterval(() => {
  autoGenerate();
  saveGame();
}, 1000);
