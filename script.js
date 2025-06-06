// Recursos base
const baseResources = [
  { nome: "Grama", id: "grama", img: "grass_block.png", quantidade: 0, porClick: 1, desbloqueado: true, desbloqueioRequisito: 0, desbloqueioRecurso: null, valorVenda: 1, gerador: { nivel: 0, ativo: false, custo: 10, upgrades: { quantidade: { nivel: 0, custo: 10 }, tempo: { nivel: 0, custo: 15 } } }, upgradeClick: { nivel: 0, custo: 10 } },
  { nome: "Madeira", id: "madeira", img: "log.png", quantidade: 0, porClick: 1, desbloqueado: false, desbloqueioRequisito: 10, desbloqueioRecurso: "grama", valorVenda: 2, gerador: { nivel: 0, ativo: false, custo: 20, upgrades: { quantidade: { nivel: 0, custo: 50 }, tempo: { nivel: 0, custo: 75 } } }, upgradeClick: { nivel: 0, custo: 50 } },
  { nome: "Pedra", id: "pedra", img: "stone.png", quantidade: 0, porClick: 1, desbloqueado: false, desbloqueioRequisito: 50, desbloqueioRecurso: "madeira", valorVenda: 3, gerador: { nivel: 0, ativo: false, custo: 50, upgrades: { quantidade: { nivel: 0, custo: 100 }, tempo: { nivel: 0, custo: 150 } } }, upgradeClick: { nivel: 0, custo: 100 } },
  { nome: "Cobre", id: "cobre", img: "copper.png", quantidade: 0, porClick: 1, desbloqueado: false, desbloqueioRequisito: 100, desbloqueioRecurso: "pedra", valorVenda: 4, gerador: { nivel: 0, ativo: false, custo: 100, upgrades: { quantidade: { nivel: 0, custo: 200 }, tempo: { nivel: 0, custo: 300 } } }, upgradeClick: { nivel: 0, custo: 200 } },
  { nome: "Ferro", id: "ferro", img: "iron.png", quantidade: 0, porClick: 1, desbloqueado: false, desbloqueioRequisito: 200, desbloqueioRecurso: "cobre", valorVenda: 5, gerador: { nivel: 0, ativo: false, custo: 200, upgrades: { quantidade: { nivel: 0, custo: 400 }, tempo: { nivel: 0, custo: 600 } } }, upgradeClick: { nivel: 0, custo: 400 } }
];

let moedas = 1000;
let rebirths = 0; // Contador de rebirths

const materiaisDiv = document.getElementById("materiais");
const moedasDiv = document.getElementById("moedas");

// Função para calcular multiplicador de produção (por rebirths)
function multiplicador() {
  return 1 + rebirths * 0.10; // +10% por rebirth
}

function atualizarInterface() {
  moedasDiv.textContent = `Moedas: ${moedas} | Rebirths: ${rebirths}`;

  materiaisDiv.innerHTML = "";

  baseResources.forEach((r, i) => {
    if (!r.desbloqueado && r.desbloqueioRecurso) {
      const req = baseResources.find(x => x.id === r.desbloqueioRecurso);
      if (req && req.quantidade >= r.desbloqueioRequisito) {
        r.desbloqueado = true;
      }
    }

    if (r.desbloqueado) {
      const div = document.createElement("div");
      div.className = "material";

      div.innerHTML = `
        <h3>${r.nome}</h3>
        <img src="${r.img}" alt="${r.nome}" onclick="clicar(${i})" />
        <p>Qtd: ${r.quantidade}</p>
        <p>+${(r.porClick * multiplicador()).toFixed(2)}/click</p>
        <button onclick="vender(${i})">Vender 100 por ${r.valorVenda} moedas</button><br/>
        <button onclick="upgradeClick(${i})">Up Click (${r.upgradeClick.custo} moedas)</button><br/>
        <h4>Gerador</h4>
        <button onclick="comprarGerador(${i})">${r.gerador.ativo ? "Ativado" : "Comprar"} (${r.gerador.custo} moedas)</button><br/>
        <button onclick="upgradeGerador(${i}, 'quantidade')">+Qtd (${r.gerador.upgrades.quantidade.custo} moedas)</button>
        <button onclick="upgradeGerador(${i}, 'tempo')">-Tempo (${r.gerador.upgrades.tempo.custo} moedas)</button>
      `;

      materiaisDiv.appendChild(div);
    }
  });

  // Botão de rebirth
  let btnRebirth = document.getElementById("btnRebirth");
  if (!btnRebirth) {
    btnRebirth = document.createElement("button");
    btnRebirth.id = "btnRebirth";
    btnRebirth.style.marginTop = "20px";
    btnRebirth.textContent = "Rebirth (Resetar para +10% produção) - custa 1000 moedas";
    btnRebirth.onclick = rebirth;
    document.body.appendChild(btnRebirth);
  }
  btnRebirth.disabled = moedas < 1000;
}

// Clicar no recurso
function clicar(i) {
  const r = baseResources[i];
  r.quantidade += r.porClick * multiplicador();
  atualizarInterface();
}

// Vender 100 unidades
function vender(i) {
  const r = baseResources[i];
  if (r.quantidade >= 1) {
    r.quantidade -= 1;
    moedas += r.valorVenda;
    atualizarInterface();
  } else {
    alert(`Você não tem 100 unidades de ${r.nome} para vender.`);
  }
}

// Comprar ativar gerador
function comprarGerador(i) {
  const r = baseResources[i];
  if (!r.gerador.ativo) {
    if (moedas >= r.gerador.custo) {
      moedas -= r.gerador.custo;
      r.gerador.ativo = true;
      r.gerador.nivel = 1;
      atualizarInterface();
    } else {
      alert("Moedas insuficientes para comprar o gerador.");
    }
  } else {
    alert("Gerador já ativado.");
  }
}

// Upgrade de clique
function upgradeClick(i) {
  const r = baseResources[i];
  if (moedas >= r.upgradeClick.custo) {
    moedas -= r.upgradeClick.custo;
    r.upgradeClick.nivel++;
    r.porClick++;
    r.upgradeClick.custo = Math.floor(r.upgradeClick.custo * 1.5);
    atualizarInterface();
  } else {
    alert("Moedas insuficientes para upgrade de clique.");
  }
}

// Upgrade gerador (quantidade ou tempo)
function upgradeGerador(i, tipo) {
  const r = baseResources[i];
  const upgrade = r.gerador.upgrades[tipo];

  if (moedas >= upgrade.custo) {
    moedas -= upgrade.custo;
    upgrade.nivel++;
    upgrade.custo = Math.floor(upgrade.custo * 1.7);
    atualizarInterface();
  } else {
    alert(`Moedas insuficientes para upgrade de ${tipo}.`);
  }
}

// Função rebirth
function rebirth() {
  if (moedas < 1000) {
    alert("Você precisa de pelo menos 1000 moedas para fazer rebirth.");
    return;
  }
  if (confirm("Tem certeza que deseja reiniciar seu progresso para ganhar +10% de produção permanente?")) {
    moedas = 0;
    rebirths++;
    // Resetar todos os recursos
    baseResources.forEach(r => {
      r.quantidade = 0;
      r.porClick = 1 + r.upgradeClick.nivel; // reset base + upgrades de clique
      r.gerador.ativo = false;
      r.gerador.nivel = 0;
      r.gerador.upgrades.quantidade.nivel = 0;
      r.gerador.upgrades.quantidade.custo = (r.id === "grama") ? 10 : r.gerador.upgrades.quantidade.custo;
      r.gerador.upgrades.tempo.nivel = 0;
      r.gerador.upgrades.tempo.custo = (r.id === "grama") ? 15 : r.gerador.upgrades.tempo.custo;
      r.upgradeClick.custo = (r.id === "grama") ? 10 : r.upgradeClick.custo;
      r.desbloqueado = r.id === "grama" ? true : false; // só grama desbloqueado
    });
    atualizarInterface();
  }
}

// Atualização periódica dos geradores (cada 3s)
setInterval(() => {
  baseResources.forEach(r => {
    if (r.gerador.ativo) {
      // Produção por segundo (3s aqui) com multiplicador e upgrade de quantidade
      const producao = (1 + r.gerador.upgrades.quantidade.nivel) * multiplicador();
      r.quantidade += producao;
    }
  });
  atualizarInterface();
}, 3000);

atualizarInterface();
