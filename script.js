// Estrutura base de recurso com upgrades, auto produção, conquistas, salvamento, sistema de vendas e rebirth melhorado
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
let moedas = parseInt(localStorage.getItem("moedas")) || 0;
let rebirths = parseInt(localStorage.getItem("rebirths")) || 0;

function saveGame() {
  localStorage.setItem("mineClickerSave", JSON.stringify(resources));
  localStorage.setItem("moedas", moedas);
  localStorage.setItem("rebirths", rebirths);
}

// ... [mantém todo o restante igual até o botão de rebirth]

// Botão de rebirth
const prestigeBtn = document.getElementById("prestigeButton");
prestigeBtn.textContent = `Prestígio (Rebirths: ${rebirths})`;
prestigeBtn.onclick = () => {
  if (confirm("Deseja fazer prestígio? Você perderá seus recursos e upgrades, mas receberá bônus futuros!")) {
    rebirths++;
    resources.forEach(res => {
      res.quantidade = 0;
      res.porClick = 1 + rebirths; // Bônus por rebirth
      res.porSegundo = 0;
      res.tempoAuto = 20;
      res.tempoAtual = 0;
      res.desbloqueado = res.desbloqueioRecurso === null;
      res.upgrades.forEach((upg, i) => {
        upg.nivel = 0;
        upg.custo = baseResources.find(b => b.id === res.id).upgrades[i].custo;
      });
    });
    moedas = 0;
    saveGame();
    renderResources();
  }
};
