let gramas = 0;
let gramasPorSegundo = 0;

const counter = document.getElementById("counter");
const grassBlock = document.getElementById("grassBlock");
const upgradesDiv = document.getElementById("upgrades");

// Clique principal
grassBlock.addEventListener("click", () => {
  gramas++;
  updateCounter();
});

// Atualiza o contador
function updateCounter() {
  counter.textContent = `Gramas: ${gramas}`;
}

// Upgrades
const upgrades = [
  { nome: "Pá automática", custo: 10, valor: 1 },
  { nome: "Aldeão Mineiro", custo: 50, valor: 5 },
  { nome: "Cortador de Grama", custo: 200, valor: 20 }
];

upgrades.forEach((upgrade) => {
  const btn = document.createElement("button");
  btn.textContent = `${upgrade.nome} (${upgrade.custo})`;
  btn.onclick = () => {
    if (gramas >= upgrade.custo) {
      gramas -= upgrade.custo;
      gramasPorSegundo += upgrade.valor;
      upgrade.custo = Math.floor(upgrade.custo * 1.5);
      btn.textContent = `${upgrade.nome} (${upgrade.custo})`;
      updateCounter();
    }
  };
  upgradesDiv.appendChild(btn);
});

// Loop automático
setInterval(() => {
  gramas += gramasPorSegundo;
  updateCounter();
}, 1000);
const achievements = [
  { gramas: 10, texto: "Primeiras 10 gramas 🌿" },
  { gramas: 100, texto: "100 gramas colhidas! 🌾" },
  { gramas: 500, texto: "Você é um fazendeiro nato! 🧑‍🌾" }
];

const unlocked = [];

function checkAchievements() {
  achievements.forEach((a) => {
    if (gramas >= a.gramas && !unlocked.includes(a.texto)) {
      unlocked.push(a.texto);
      const div = document.createElement("div");
      div.textContent = `🏆 ${a.texto}`;
      document.getElementById("achievements").appendChild(div);
    }
  });
}
