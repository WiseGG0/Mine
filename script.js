const recursos = [
  {
    nome: "Grama", id: "grama", img: "grass_block.png",
    quantidade: 0, porClick: 1, desbloqueado: true,
    valorVenda: 1, custoDesbloqueio: 0,
    upgradeClick: { nivel: 0, custo: 10 },
    gerador: {
      ativo: false, nivel: 0, tempo: 5000, tempoAtual: 0,
      upgrades: {
        quantidade: { nivel: 0, custo: 10 },
        tempo: { nivel: 0, custo: 15 }
      },
      custo: 10
    }
  },
  {
    nome: "Madeira", id: "madeira", img: "log.png",
    quantidade: 0, porClick: 1, desbloqueado: false,
    valorVenda: 2, custoDesbloqueio: 10,
    upgradeClick: { nivel: 0, custo: 50 },
    gerador: {
      ativo: false, nivel: 0, tempo: 5000, tempoAtual: 0,
      upgrades: {
        quantidade: { nivel: 0, custo: 50 },
        tempo: { nivel: 0, custo: 75 }
      },
      custo: 20
    }
  },
  {
    nome: "Pedra", id: "pedra", img: "stone.png",
    quantidade: 0, porClick: 1, desbloqueado: false,
    valorVenda: 3, custoDesbloqueio: 100,
    upgradeClick: { nivel: 0, custo: 100 },
    gerador: {
      ativo: false, nivel: 0, tempo: 5000, tempoAtual: 0,
      upgrades: {
        quantidade: { nivel: 0, custo: 100 },
        tempo: { nivel: 0, custo: 150 }
      },
      custo: 50
    }
  },
  {
    nome: "Cobre", id: "cobre", img: "copper.png",
    quantidade: 0, porClick: 1, desbloqueado: false,
    valorVenda: 4, custoDesbloqueio: 200,
    upgradeClick: { nivel: 0, custo: 200 },
    gerador: {
      ativo: false, nivel: 0, tempo: 5000, tempoAtual: 0,
      upgrades: {
        quantidade: { nivel: 0, custo: 200 },
        tempo: { nivel: 0, custo: 300 }
      },
      custo: 100
    }
  },
  {
    nome: "Ferro", id: "ferro", img: "iron.png",
    quantidade: 0, porClick: 1, desbloqueado: false,
    valorVenda: 5, custoDesbloqueio: 400,
    upgradeClick: { nivel: 0, custo: 400 },
    gerador: {
      ativo: false, nivel: 0, tempo: 5000, tempoAtual: 0,
      upgrades: {
        quantidade: { nivel: 0, custo: 400 },
        tempo: { nivel: 0, custo: 600 }
      },
      custo: 200
    }
  }
];

let moedas = 0;

function renderRecursos() {
  const container = document.getElementById("recursos");
  container.innerHTML = "";
  recursos.forEach((r, i) => {
    if (!r.desbloqueado) return;

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
    container.appendChild(div);
  });
}

function renderLojaMoedas() {
  const loja = document.getElementById("lojaMoedas");
  loja.innerHTML = "";
  recursos.forEach((r, i) => {
    if (r.desbloqueado) return;
    const btn = document.createElement("button");
    btn.textContent = `Desbloquear ${r.nome} (${r.custoDesbloqueio} moedas)`;
    btn.onclick = () => {
      if (moedas >= r.custoDesbloqueio) {
        moedas -= r.custoDesbloqueio;
        r.desbloqueado = true;
        renderTudo();
      }
    };
    loja.appendChild(btn);
  });
}

function clicar(i) {
  recursos[i].quantidade += recursos[i].porClick;
  renderTudo();
}

function vender(i) {
  if (recursos[i].quantidade >= 100) {
    recursos[i].quantidade -= 100;
    moedas += recursos[i].valorVenda;
    renderTudo();
  }
}

function upgradeClick(i) {
  const r = recursos[i];
  if (r.quantidade >= r.upgradeClick.custo) {
    r.quantidade -= r.upgradeClick.custo;
    r.porClick++;
    r.upgradeClick.nivel++;
    r.upgradeClick.custo = Math.floor(r.upgradeClick.custo * 1.5);
    renderTudo();
  }
}

function comprarGerador(i) {
  const r = recursos[i];
  if (!r.gerador.ativo && moedas >= r.gerador.custo) {
    moedas -= r.gerador.custo;
    r.gerador.ativo = true;
    r.gerador.nivel = 1;
    r.gerador.porSegundo = 1;
    renderTudo();
  }
}

function upgradeGerador(i, tipo) {
  const r = recursos[i];
  const up = r.gerador.upgrades[tipo];
  if (moedas >= up.custo) {
    moedas -= up.custo;
    up.nivel++;
    if (tipo === "quantidade") {
      r.gerador.porSegundo += 1;
    } else {
      r.gerador.tempo = Math.max(1000, r.gerador.tempo - 500);
    }
    up.custo = Math.floor(up.custo * 1.6);
    renderTudo();
  }
}

function gerarRecursos() {
  recursos.forEach(r => {
    if (r.gerador.ativo) {
      r.gerador.tempoAtual += 1000;
      if (r.gerador.tempoAtual >= r.gerador.tempo) {
        r.gerador.tempoAtual = 0;
        r.quantidade += r.gerador.porSegundo;
      }
    }
  });
  renderTudo();
}

function renderTudo() {
  document.getElementById("moedas").textContent = `Moedas: ${moedas}`;
  renderRecursos();
  renderLojaMoedas();
}

setInterval(gerarRecursos, 1000);
renderTudo();
