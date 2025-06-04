let grassImage;
let counter = 0;

function preload() {
  // Você pode usar um bloco real de grama se tiver a imagem
  grassImage = loadImage("https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/02/Grass_Block_JE4_BE4.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
}

function draw() {
  background('#d0f0c0');
  
  // Desenha o bloco de grama no centro da tela
  let size = min(width, height) * 0.5;
  image(grassImage, width / 2, height / 2, size, size);
}

function mousePressed() {
  let size = min(width, height) * 0.5;
  let d = dist(mouseX, mouseY, width / 2, height / 2);
  
  if (d < size / 2) {
    counter++;
    document.getElementById("counter").textContent = counter;
    
    // Efeito sonoro, partícula, ou vibração aqui (futuramente)
  }
}
