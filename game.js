const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variáveis do jogo
const GRAVITY = 0.5;
const JUMP_STRENGTH = -10;
const PLAYER_SPEED = 3;

let player = {
    x: 50,
    y: canvas.height - 50,
    width: 32,
    height: 32,
    dx: 0,
    dy: 0,
    grounded: false,
    image: new Image()
};
player.image.src = 'mario.png'; // Substitua por uma imagem do Mario

let level = []; // Representação do mapa (blocos, inimigos, etc.)

// Funções do jogo
function init() {
    // Carregar recursos, criar o nível
    createLevel();
    gameLoop();
}

function createLevel() {
    // Exemplo de um nível simples (blocos do chão)
    for (let i = 0; i < canvas.width / 32; i++) {
        level.push({
            x: i * 32,
            y: canvas.height - 32,
            width: 32,
            height: 32,
            type: 'block'
        });
    }
    // Adicionar mais blocos, inimigos, etc.
    level.push({ x: 100, y: canvas.height - 96, width: 32, height: 32, type: 'block' });
    level.push({ x: 132, y: canvas.height - 96, width: 32, height: 32, type: 'block' });
}

function update() {
    // Gravidade
    player.dy += GRAVITY;
    player.y += player.dy;
    player.x += player.dx;

    // Colisão com o chão (temporário, será substituído por colisão de blocos)
    if (player.y + player.height > canvas.height - 32) {
        player.y = canvas.height - 32 - player.height;
        player.dy = 0;
        player.grounded = true;
    } else {
        player.grounded = false;
    }

    // Colisão com blocos
    level.forEach(block => {
        if (block.type === 'block') {
            // Lógica de colisão mais complexa aqui (eixo X e Y separados)
            if (player.x < block.x + block.width &&
                player.x + player.width > block.x &&
                player.y < block.y + block.height &&
                player.y + player.height > block.y) {

                // Se o player está caindo e atinge um bloco por cima
                if (player.dy > 0 && player.y + player.height - player.dy <= block.y) {
                    player.y = block.y - player.height;
                    player.dy = 0;
                    player.grounded = true;
                }
                // Se o player pula e atinge um bloco por baixo
                else if (player.dy < 0 && player.y - player.dy >= block.y + block.height) {
                    player.y = block.y + block.height;
                    player.dy = 0;
                }
                // Colisão lateral (simples por enquanto)
                else if (player.dx > 0 && player.x + player.width - player.dx <= block.x) {
                    player.x = block.x - player.width;
                    player.dx = 0;
                }
                else if (player.dx < 0 && player.x - player.dx >= block.x + block.width) {
                    player.x = block.x + block.width;
                    player.dx = 0;
                }
            }
        }
    });

    // Limitar o jogador na tela
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar a tela

    // Desenhar blocos do nível
    level.forEach(block => {
        if (block.type === 'block') {
            ctx.fillStyle = '#8B4513'; // Cor de um bloco de terra/tijolo
            ctx.fillRect(block.x, block.y, block.width, block.height);
        }
    });

    // Desenhar o player
    if (player.image.complete) {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    } else {
        ctx.fillStyle = 'red'; // Placeholder se a imagem não carregar
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop); // Loop do jogo
}

// Controle de teclado
let keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    handleInput();
});
window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    handleInput();
});

function handleInput() {
    player.dx = 0; // Resetar movimento horizontal

    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.dx = -PLAYER_SPEED;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        player.dx = PLAYER_SPEED;
    }
    if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && player.grounded) {
        player.dy = JUMP_STRENGTH;
        player.grounded = false;
    }
}

// Iniciar o jogo
player.image.onload = init; // Inicia o jogo depois que a imagem do Mario é carregada
                  
