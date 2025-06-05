// Estrutura base de recurso com upgrades, auto produção, conquistas, salvamento e sistema de vendas
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
    valorVenda: 1,
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
    valorVenda: 2,
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 100 },
      { nome: "+1/s", nivel: 0, custo: 500 },
      { nome: "-1s geração", nivel: 0, custo: 1000 }
    ]
  },
  {
    nome: "Pedra",
    id: "pedra",
    img: "stone.png",
    quantidade: 0,
    porClick: 1,
    porSegundo: 0,
    tempoAuto: 20,
    tempoAtual: 0,
    desbloqueado: false,
    desbloqueioRequisito: 5000,
    desbloqueioRecurso: "madeira",
    valorVenda: 3,
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 1000 },
      { nome: "+1/s", nivel: 0, custo: 2500 },
      { nome: "-1s geração", nivel: 0, custo: 5000 }
    ]
  },
  {
    nome: "Cobre",
    id: "cobre",
    img: "copper.png",
    quantidade: 0,
    porClick: 1,
    porSegundo: 0,
    tempoAuto: 20,
    tempoAtual: 0,
    desbloqueado: false,
    desbloqueioRequisito: 10000,
    desbloqueioRecurso: "pedra",
    valorVenda: 4,
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 5000 },
      { nome: "+1/s", nivel: 0, custo: 10000 },
      { nome: "-1s geração", nivel: 0, custo: 20000 }
    ]
  },
  {
    nome: "Ferro",
    id: "ferro",
    img: "iron.png",
    quantidade: 0,
    porClick: 1,
    porSegundo: 0,
    tempoAuto: 20,
    tempoAtual: 0,
    desbloqueado: false,
    desbloqueioRequisito: 25000,
    desbloqueioRecurso: "cobre",
    valorVenda: 5,
    upgrades: [
      { nome: "+1 por click", nivel: 0, custo: 20000 },
      { nome: "+1/s", nivel: 0, custo: 50000 },
      { nome: "-1s geração", nivel: 0, custo: 100000 }
    ]
  }
];

let resources = JSON.parse(localStorage.getItem("mineClickerSave")) || baseResources;
resources.forEach((res, i) => {
  // Reatribuir valorVenda se estiver faltando (corrigir bug de save antigo)
  if (res.valorVenda == null) {
    const valoresPadrao = [1, 2, 3, 4, 5];
    res.valorVenda = valoresPadrao[i] || 1;
  }
});

let moedas = parseInt(localStorage.getItem("moedas")) || 0;

function saveGame() {
  localStorage.setItem("mineClickerSave", JSON.stringify(resources));
  localStorage.setItem("moedas", moedas);
}

// ... (restante do código permanece o mesmo)
