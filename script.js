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
