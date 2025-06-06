let moedas = 0;
let rebirthCount = 0;

const baseResources = [
  {
    nome: "Grama",
    id: "grama",
    img: "grass_block.png",
    quantidade: 0,
    porClick: 1,
    desbloqueado: true,
    desbloqueioRequisito: 0,
    desbloqueioRecurso: null,
    valorVenda: 1,
    gerador: {
      nivel: 0,
      ativo: false,
      porSegundo: 0,
      tempo: 20,
      tempoAtual: 0,
      upgrades: {
        quantidade: { nivel: 0, custo: 10 },
        tempo: { nivel: 0, custo: 15 },
      },
      custo: 10,
    },
    upgradeClick: { nivel: 0, custo: 10 },
  },
  {
    nome: "Madeira",
    id: "madeira",
    img: "log.png",
    quantidade: 0,
    porClick: 1,
    desbloqueado: false,
    desbloqueioRequisito: 10,
    desbloqueioRecurso: "grama",
    valorVenda: 2,
    gerador: {
      nivel: 0,
      ativo: false,
      porSegundo: 0,
      tempo: 20,
      tempoAtual: 0,
      upgrades: {
        quantidade: { nivel: 0, custo: 50 },
        tempo: { nivel: 0, custo: 75 },
      },
      custo: 20,
    },
    upgradeClick: { nivel: 0, custo: 50 },
  },
  {
    nome: "Pedra",
    id: "pedra",
    img: "stone.png",
    quantidade: 0,
    porClick: 1,
    desbloqueado: false,
    desbloqueioRequisito: 50,
    desbloqueioRecurso: "madeira",
    valorVenda: 3,
    gerador: {
      nivel: 0,
      ativo: false,
      porSegundo: 0,
      tempo: 20,
      tempoAtual: 0,
      upgrades: {
        quantidade: { nivel: 0, custo: 100 },
        tempo: { nivel: 0, custo: 150 },
      },
      custo: 50,
    },
    upgradeClick: { nivel: 0, custo: 100 },
  },
  {
    nome: "Cobre",
    id: "cobre",
    img: "copper.png",
    quantidade: 0,
    porClick: 1,
    desbloqueado: false,
    desbloqueioRequisito: 100,
    desbloqueioRecurso: "pedra",
    valorVenda: 4,
    gerador: {
      nivel: 0,
      ativo: false,
      porSegundo: 0,
      tempo: 20,
      tempoAtual: 0,
      upgrades: {
        quantidade: { nivel: 0, custo: 200 },
        tempo: { nivel: 0, custo: 300 },
      },
      custo: 100,
    },
    upgradeClick: { nivel: 0, custo: 200 },
  },
  {
    nome: "Ferro",
    id: "ferro",
    img: "iron.png",
    quantidade: 0,
    porClick: 1,
    desbloqueado: false,
    desbloqueioRequisito: 200,
    desbloqueioRecurso: "cobre",
    valorVenda: 5,
    gerador: {
      nivel: 0,
      ativo: false,
      porSegundo: 0,
      tempo: 20,
      tempoAtual: 0,
      upgrades: {
        quantidade: { nivel: 0, custo: 400 },
        tempo: { nivel: 0, custo: 600 },
      },
      custo: 200,
    },
    upgradeClick: { nivel: 0, custo: 400 },
  },
];

let resources = JSON.parse(JSON.stringify(baseResources));

const container = document.getElementById("resourcesContainer");

function atualizarDisplay() {
  container.innerHTML = "";

  // desbloquear novos recursos
  resources.forEach((r, i) => {
    if (
      !r.desbloqueado &&
      resources.find((res) => res.id === r.desbloqueioRecurso).quantidade >=
        r.desbloqueioRequisito
    ) {
      r.desbloqueado = true;
    }
  });

  // Mostrar recursos desbloqueados
  resources.forEach((r, i) => {
    if (!r.desbloqueado) return;

    const div = document.createElement("div");
    div.className = "material";
    div.innerHTML = `
      <h3>${r.nome}</h3>
      <img src="${r.img}" onclick="clicar(${i})" />
      <p>Qtd: ${r.quantidade}</p>
      <p>+${r.porClick}/click</p>
      <button onclick="vender(${i})">Vender 100 por ${r.valorVenda} moedas</button><br/>
      <button onclick="upgradeClick(${i})">Up Click (${r.upgradeClick.custo})</button><br/>
      <h4>Gerador</h4>
      <button onclick="comprarGerador(${i})">${r.gerador.ativo ? "Ativado" : "Comprar"} (${r.gerador.custo})</button><br/>
      <button onclick="upgradeGerador(${i}, 'quantidade')">+Qtd (${r.gerador.upgrades.quantidade.custo})</button>
      <button onclick="upgradeGerador(${i}, 'tempo')">-Tempo (${r.gerador.upgrades.tempo.custo})</button>
    `;

    container.appendChild(div);
  });

  document.getElementById("moedasDisplay").textContent = `Moedas: ${moedas}`;
  document.getElementById("rebirthDisplay").textContent = `Rebirths: ${rebirthCount}`;
}

// Clique no recurso para ganhar
function clicar(i) {
  const r = resources[i];
  r.quantidade += r.porClick;
  atualizarDisplay();
}

// Vender 100 unidades
function vender(i) {
  const r = resources[i];
  if (r.quantidade >= 100) {
    r.quantidade -= 100;
    moedas += r.valorVenda;
    atualizarDisplay();
  }
}

// Upgrade +1 por click do recurso (comprado com moedas)
function upgradeClick(i) {
  const r = resources[i];
  if (moedas >= r.upgradeClick.custo) {
    moedas -= r.upgradeClick.custo;
    r.upgradeClick.nivel++;
    r.porClick++;
    // Aumentar custo para próximo upgrade (fórmula exponencial)
    r.upgradeClick.custo = Math.floor(r.upgradeClick.custo * 1.5);
    atualizarDisplay();
  }
}

// Comprar ou ativar gerador automático
function comprarGerador(i) {
  const r = resources[i];
  if (!r.gerador.ativo && moedas >= r.gerador.custo) {
    moedas -= r.gerador.custo;
    r.gerador.ativo = true;
    r.gerador.porSegundo = 1 + r.gerador.upgrades.quantidade.nivel;
    atualizarDisplay();
  }
}

// Upgrades do gerador (quantidade e tempo)
function upgradeGerador(i, tipo) {
  const r = resources[i];
  const up = r.gerador.upgrades[tipo];
  if (moedas >= up.custo && r.gerador.ativo) {
    moedas -= up.custo;
    up.nivel++;
    if (tipo === "quantidade") {
      r.gerador.porSegundo++;
    } else if (tipo === "tempo") {
      r.gerador.tempo = Math.max(1, r.gerador.tempo * 0.9);
    }
    // Aumentar custo para próximo upgrade
    up.custo = Math.floor(up.custo * 1.7);
    atualizarDisplay();
  }
}

// Vender tudo que tiver 100+
function venderTudo() {
  resources.forEach((r) => {
    while (r.quantidade >= 100) {
      r.quantidade -= 100;
      moedas += r.valorVenda;
    }
  });
  atualizarDisplay();
}

// Rebirth - reset total para ganhos multiplicados (simplificado)
function rebirth() {
  if (moedas < 1000) return alert("Você precisa de pelo menos 1000 moedas para Rebirth!");

  rebirthCount++;
  moedas = 0;
  resources = JSON.parse(JSON.stringify(baseResources));
  resources.forEach((r) => {
    r.desbloqueado = r.id === "grama"; // só liberar grama
    r.quantidade = 0;
    r.porClick = 1 + rebirthCount; // bônus de porClick a cada rebirth
    r.upgradeClick.nivel = 0;
    r.upgradeClick.custo = 10;
    r.gerador.nivel = 0;
    r.gerador.ativo = false;
    r.gerador.porSegundo = 0;
    r.gerador.tempo = 20;
    r.gerador.tempoAtual = 0;
    r.gerador.upgrades.quantidade.nivel = 0;
    r.gerador.upgrades.quantidade.custo = 10;
    r.gerador.upgrades.tempo.nivel = 0;
    r.gerador.upgrades.tempo.custo = 15;
  });

  atualizarDisplay();
}

document.getElementById("btnVenderTudo").addEventListener("click", venderTudo);
document.getElementById("btnRebirth").addEventListener("click", rebirth);

// Loop para atualizar geradores
function loop() {
  const deltaTime = 0.1; // segundos
  resources.forEach((r) => {
    if (r.gerador.ativo) {
      r.gerador.tempoAtual += deltaTime;
      if (r.gerador.tempoAtual >= r.gerador.tempo) {
        r.quantidade += r.gerador.porSegundo;
        r.gerador.tempoAtual = 0;
      }
    }
  });
  atualizarDisplay();
}

setInterval(loop, 100);

atualizarDisplay();
