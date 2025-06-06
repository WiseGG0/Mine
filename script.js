let moedas = 1000000;
let rebirths = 0;

const baseResources = [
  {
    nome: "Grama", id: "grama", img: "grass_block.png",
    quantidade: 100, porClick: 100, desbloqueado: true,
    desbloqueioRequisito: 0, desbloqueioRecurso: null,
    valorVenda: 1,
    gerador: {
      nivel: 0, ativo: false, porSegundo: 0,
      tempo: 20, tempoAtual: 0,
      upgrades: { quantidade: { nivel: 0, custo: 10 }, tempo: { nivel: 0, custo: 15 } },
      custo: 10
    },
    upgradeClick: { nivel: 0, custo: 10 }
  },
  {
    nome: "Madeira", id: "madeira", img: "log.png",
    quantidade: 0, porClick: 1, desbloqueado: false,
    desbloqueioRequisito: 10, desbloqueioRecurso: "grama",
    valorVenda: 2,
    gerador: {
      nivel: 0, ativo: false, porSegundo: 0,
      tempo: 20, tempoAtual: 0,
      upgrades: { quantidade: { nivel: 0, custo: 50 }, tempo: { nivel: 0, custo: 75 } },
      custo: 20
    },
    upgradeClick: { nivel: 0, custo: 50 }
  },
  {
    nome: "Pedra", id: "pedra", img: "stone.png",
    quantidade: 0, porClick: 1, desbloqueado: false,
    desbloqueioRequisito: 50, desbloqueioRecurso: "madeira",
    valorVenda: 3,
    gerador: {
      nivel: 0, ativo: false, porSegundo: 0,
      tempo: 20, tempoAtual: 0,
      upgrades: { quantidade: { nivel: 0, custo: 100 }, tempo: { nivel: 0, custo: 150 } },
      custo: 50
    },
    upgradeClick: { nivel: 0, custo: 100 }
  },
  {
    nome: "Cobre", id: "cobre", img: "copper.png",
    quantidade: 0, porClick: 1, desbloqueado: false,
    desbloqueioRequisito: 100, desbloqueioRecurso: "pedra",
    valorVenda: 4,
    gerador: {
      nivel: 0, ativo: false, porSegundo: 0,
      tempo: 20, tempoAtual: 0,
      upgrades: { quantidade: { nivel: 0, custo: 200 }, tempo: { nivel: 0, custo: 300 } },
      custo: 100
    },
    upgradeClick: { nivel: 0, custo: 200 }
  },
  {
    nome: "Ferro", id: "ferro", img: "iron.png",
    quantidade: 0, porClick: 1, desbloqueado: false,
    desbloqueioRequisito: 200, desbloqueioRecurso: "cobre",
    valorVenda: 5,
    gerador: {
      nivel: 0, ativo: false, porSegundo: 0,
      tempo: 20, tempoAtual: 0,
      upgrades: { quantidade: { nivel: 0, custo: 400 }, tempo: { nivel: 0, custo: 600 } },
      custo: 200
    },
    upgradeClick: { nivel: 0, custo: 400 }
  }
];

function clicar(i) {
  baseResources[i].quantidade += baseResources[i].porClick;
  render();
}

function vender(i) {
  if (baseResources[i].quantidade >= 100) {
    baseResources[i].quantidade -= 100;
    moedas += 100 * baseResources[i].valorVenda;
    render();
  }
}

function venderTodos() {
  baseResources.forEach(r => {
    let qtd = Math.floor(r.quantidade / 100) * 100;
    if (qtd > 0) {
      r.quantidade -= qtd;
      moedas += qtd * r.valorVenda;
    }
  });
  render();
}

function upgradeClick(i) {
  let r = baseResources[i];
  if (moedas >= r.upgradeClick.custo) {
    moedas -= r.upgradeClick.custo;
    r.porClick += 1;
    r.upgradeClick.nivel++;
    r.upgradeClick.custo *= 2;
    render();
  }
}

function comprarGerador(i) {
  let r = baseResources[i];
  if (!r.gerador.ativo && moedas >= r.gerador.custo) {
    moedas -= r.gerador.custo;
    r.gerador.ativo = true;
    r.gerador.nivel = 1;
    r.gerador.porSegundo = 1;
    render();
  }
}

function upgradeGerador(i, tipo) {
  let r = baseResources[i];
  if (moedas >= r.gerador.upgrades[tipo].custo) {
    moedas -= r.gerador.upgrades[tipo].custo;
    r.gerador.upgrades[tipo].nivel++;
    r.gerador.upgrades[tipo].custo *= 2;
    if (tipo === "quantidade") r.gerador.porSegundo += 1;
    else if (tipo === "tempo") r.gerador.tempo = Math.max(1, r.gerador.tempo - 1);
    render();
  }
}

function fazerRebirth() {
  if (moedas >= 10) {
    rebirths++;
    moedas = 0;
    baseResources.forEach(r => {
      r.quantidade = 0;
      r.porClick = 1 + rebirths;
      r.upgradeClick = { nivel: 0, custo: 10 * (r.id === "grama" ? 1 : r.valorVenda) };
      r.desbloqueado = r.id === "grama";
      r.gerador = {
        nivel: 0, ativo: false, porSegundo: 0,
        tempo: 20, tempoAtual: 0,
        upgrades: { quantidade: { nivel: 0, custo: 10 * r.valorVenda }, tempo: { nivel: 0, custo: 15 * r.valorVenda } },
        custo: 10 * r.valorVenda
      };
    });
    alert(`Rebirth realizado! Bônus aplicado: +${rebirths} por clique.`);
    render();
  } else {
    alert("Você precisa de 10.000 moedas para fazer Rebirth.");
  }
}

function render() {
  document.getElementById("moedas").innerText = `Moedas: ${moedas} | Rebirths: ${rebirths}`;
  const area = document.getElementById("materiais");
  area.innerHTML = "";
  baseResources.forEach((r, i) => {
    if (!r.desbloqueado) {
      const req = baseResources.find(res => res.id === r.desbloqueioRecurso);
      if (req && req.quantidade >= r.desbloqueioRequisito) r.desbloqueado = true;
      else return;
    }
    const div = document.createElement("div");
    div.className = "material";
    div.innerHTML = `
      <h3>${r.nome}</h3>
      <img src="${r.img}" onclick="clicar(${i})"/>
      <p>Qtd: ${r.quantidade}</p>
      <p>+${r.porClick}/click</p>
      <button onclick="vender(${i})">Vender 100 por ${r.valorVenda} moedas</button><br/>
      <button onclick="upgradeClick(${i})">Up Click (${r.upgradeClick.custo})</button><br/>
      <h4>Gerador</h4>
      <button onclick="comprarGerador(${i})">${r.gerador.ativo ? "Ativado" : "Comprar"} (${r.gerador.custo})</button><br/>
      <button onclick="upgradeGerador(${i}, 'quantidade')">+Qtd (${r.gerador.upgrades.quantidade.custo})</button>
      <button onclick="upgradeGerador(${i}, 'tempo')">-Tempo (${r.gerador.upgrades.tempo.custo})</button>
    `;
    area.appendChild(div);
  });
}

setInterval(() => {
  baseResources.forEach(r => {
    if (r.gerador.ativo) {
      r.gerador.tempoAtual++;
      if (r.gerador.tempoAtual >= r.gerador.tempo) {
        r.gerador.tempoAtual = 0;
        r.quantidade += r.gerador.porSegundo;
      }
    }
  });
  render();
}, 1000);

render();
