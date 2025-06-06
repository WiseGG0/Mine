// Recursos base
const baseResources = [
  { nome: "Grama", id: "grama", img: "grass_block.png", quantidade: 0, porClick: 1, desbloqueado: true, desbloqueioRequisito: 0, desbloqueioRecurso: null, valorVenda: 1, gerador: { nivel: 0, ativo: false, custo: 10, upgrades: { quantidade: { nivel: 0, custo: 10 }, tempo: { nivel: 0, custo: 15 } } }, upgradeClick: { nivel: 0, custo: 10 } },
  { nome: "Madeira", id: "madeira", img: "log.png", quantidade: 0, porClick: 1, desbloqueado: false, desbloqueioRequisito: 10, desbloqueioRecurso: "grama", valorVenda: 2, gerador: { nivel: 0, ativo: false, custo: 20, upgrades: { quantidade: { nivel: 0, custo: 50 }, tempo: { nivel: 0, custo: 75 } } }, upgradeClick: { nivel: 0, custo: 50 } },
  { nome: "Pedra", id: "pedra", img: "stone.png", quantidade: 0, porClick: 1, desbloqueado: false, desbloqueioRequisito: 50, desbloqueioRecurso: "madeira", valorVenda: 3, gerador: { nivel: 0, ativo: false, custo: 50, upgrades: { quantidade: { nivel: 0, custo: 100 }, tempo: { nivel: 0, custo: 150 } } }, upgradeClick: { nivel: 0, custo: 100 } },
  { nome: "Cobre", id: "cobre", img: "copper.png", quantidade: 0, porClick: 1, desbloqueado: false, desbloqueioRequisito: 100, desbloqueioRecurso: "pedra", valorVenda: 4, gerador: { nivel: 0, ativo: false, custo: 100, upgrades: { quantidade: { nivel: 0, custo: 200 }, tempo: { nivel: 0, custo: 300 } } }, upgradeClick: { nivel: 0, custo: 200 } },
  { nome: "Ferro", id: "ferro", img: "iron.png", quantidade: 0, porClick: 1, desbloqueado: false, desbloqueioRequisito: 200, desbloqueioRecurso: "cobre", valorVenda: 5, gerador: { nivel: 0, ativo: false, custo: 200, upgrades: { quantidade: { nivel: 0, custo: 400 }, tempo: { nivel: 0, custo: 600 } } }, upgradeClick: { nivel: 0, custo: 400 } }
];

let moedas = 1000;

const materiaisDiv = document.getElementById("materiais");
const moedasDiv = document.getElementById("moedas");

function atualizarInterface() {
  moedasDiv.textContent = `Moedas: ${moedas}`;
  materiaisDiv.innerHTML = "";

  baseResources.forEach((r, i) => {
    // Desbloquear recursos baseados em moedas
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
        <p>+${r.porClick}/click</p>
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
}

// Função para clicar no material e aumentar a quantidade
function clicar(i) {
  const r = baseResources[i];
  r.quantidade += r.porClick;
  atualizarInterface();
}

// Vender 100 unidades do material
function vender(i) {
  const r = baseResources[i];
  if (r.quantidade >= 1) {
    r.quantidade -= 1;
    moedas += r.valorVenda;
    atualizarInterface();
  } else {
    alert(`Você não tem 1 unidades de ${r.nome} para vender.`);
  }
}

// Comprar ou ativar gerador
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

// Melhorar o clique
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

// Melhorar gerador (quantidade ou tempo) - só atualiza custo e nível por enquanto
function upgradeGerador(i, tipo) {
  const r = baseResources[i];
  const upgrade = r.gerador.upgrades[tipo];

  if (moedas >= upgrade.custo) {
    moedas -= upgrade.custo;
    upgrade.nivel++;
    upgrade.custo = Math.floor(upgrade.custo * 1.7);

    // Implementar efeito do upgrade: por simplicidade, só altera custo
    // Pode adicionar lógica para aumentar produção ou reduzir tempo

    atualizarInterface();
  } else {
    alert(`Moedas insuficientes para upgrade de ${tipo}.`);
  }
}

// Atualização periódica para geradores (simples exemplo)
setInterval(() => {
  baseResources.forEach(r => {
    if (r.gerador.ativo) {
      r.quantidade += 1 * (r.gerador.upgrades.quantidade.nivel + 1);
    }
  });
  atualizarInterface();
}, 3000);

atualizarInterface();

