// Game canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let score = 0;
let lives = 3;
let gameOver = false;
let gameWon = false;

// Player object
const player = {
    x: 50,
    y: 400,
    width: 32,
    height: 32,
    velocityY: 0,
    velocityX: 0,
    speed: 5,
    jumpPower: 12,
    gravity: 0.5,
    isJumping: false,
    onGround: false
};

// Keyboard state
const keys = {};

// Platforms
const platforms = [
    { x: 0, y: 550, width: 800, height: 50 }, // Ground
    { x: 200, y: 450, width: 150, height: 20 },
    { x: 400, y: 350, width: 150, height: 20 },
    { x: 100, y: 250, width: 150, height: 20 },
    { x: 600, y: 450, width: 150, height: 20 },
    { x: 500, y: 200, width: 150, height: 20 }
];

// Enemies
const enemies = [
    { x: 250, y: 418, width: 32, height: 32, velocityX: 2, minX: 200, maxX: 330 },
    { x: 450, y: 318, width: 32, height: 32, velocityX: 2, minX: 400, maxX: 530 },
    { x: 650, y: 418, width: 32, height: 32, velocityX: 2, minX: 600, maxX: 730 }
];

// Goal
const goal = { x: 550, y: 155, width: 40, height: 40 };

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' && !player.isJumping && player.onGround) {
        player.velocityY = -player.jumpPower;
        player.isJumping = true;
        player.onGround = false;
    }
    if (e.key === 'r' || e.key === 'R') {
        resetGame();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update player
function updatePlayer() {
    // Horizontal movement
    player.velocityX = 0;
    if (keys['ArrowLeft']) {
        player.velocityX = -player.speed;
    }
    if (keys['ArrowRight']) {
        player.velocityX = player.speed;
    }

    // Apply gravity
    player.velocityY += player.gravity;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Keep player within canvas bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    // Check if player fell off the map
    if (player.y > canvas.height) {
        loseLife();
    }

    player.onGround = false;
}

// Collision detection
function checkCollisions() {
    // Platform collision
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height &&
            player.velocityY > 0) {
            
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
            player.onGround = true;
        }
    });

    // Enemy collision
    enemies.forEach(enemy => {
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            
            // Check if player jumped on enemy
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= enemy.y) {
                enemy.x = -100; // Remove enemy
                player.velocityY = -8; // Bounce
                score += 100;
                updateScore();
            } else {
                loseLife();
            }
        }
    });

    // Goal collision
    if (player.x < goal.x + goal.width &&
        player.x + player.width > goal.x &&
        player.y < goal.y + goal.height &&
        player.y + player.height > goal.y) {
        winGame();
    }
}

// Update enemies
function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.velocityX;
        
        if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
            enemy.velocityX *= -1;
        }
    });
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Hat
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(player.x + 8, player.y, 16, 8);
}

// Draw platforms
function drawPlatforms() {
    ctx.fillStyle = '#8B4513';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Add some texture
        ctx.fillStyle = '#654321';
        for (let i = 0; i < platform.width; i += 20) {
            ctx.fillRect(platform.x + i, platform.y, 2, platform.height);
        }
        ctx.fillStyle = '#8B4513';
    });
}

// Draw enemies
function drawEnemies() {
    enemies.forEach(enemy => {
        if (enemy.x > 0) { // Only draw if not defeated
            ctx.fillStyle = '#00aa00';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // Eyes
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(enemy.x + 8, enemy.y + 10, 6, 6);
            ctx.fillRect(enemy.x + 18, enemy.y + 10, 6, 6);
            ctx.fillStyle = '#000000';
            ctx.fillRect(enemy.x + 10, enemy.y + 12, 3, 3);
            ctx.fillRect(enemy.x + 20, enemy.y + 12, 3, 3);
        }
    });
}

// Draw goal
function drawGoal() {
    ctx.fillStyle = '#ffdd00';
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
    
    // Star pattern
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.moveTo(goal.x + 20, goal.y + 5);
    ctx.lineTo(goal.x + 25, goal.y + 15);
    ctx.lineTo(goal.x + 35, goal.y + 15);
    ctx.lineTo(goal.x + 27, goal.y + 22);
    ctx.lineTo(goal.x + 30, goal.y + 35);
    ctx.lineTo(goal.x + 20, goal.y + 27);
    ctx.lineTo(goal.x + 10, goal.y + 35);
    ctx.lineTo(goal.x + 13, goal.y + 22);
    ctx.lineTo(goal.x + 5, goal.y + 15);
    ctx.lineTo(goal.x + 15, goal.y + 15);
    ctx.closePath();
    ctx.fill();
}

// Update UI
function updateScore() {
    document.getElementById('score').textContent = score;
}

function updateLives() {
    document.getElementById('lives').textContent = lives;
}

// Lose life
function loseLife() {
    lives--;
    updateLives();
    
    if (lives <= 0) {
        gameOver = true;
    } else {
        // Reset player position
        player.x = 50;
        player.y = 400;
        player.velocityY = 0;
        player.velocityX = 0;
    }
}

// Win game
function winGame() {
    gameWon = true;
    score += 1000;
    updateScore();
}

// Reset game
function resetGame() {
    score = 0;
    lives = 3;
    gameOver = false;
    gameWon = false;
    player.x = 50;
    player.y = 400;
    player.velocityY = 0;
    player.velocityX = 0;
    
    // Reset enemies
    enemies[0].x = 250;
    enemies[1].x = 450;
    enemies[2].x = 650;
    
    updateScore();
    updateLives();
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#5c94fc');
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (!gameOver && !gameWon) {
        updatePlayer();
        updateEnemies();
        checkCollisions();
    }
    
    drawPlatforms();
    drawGoal();
    drawEnemies();
    drawPlayer();
    
    // Draw game over or win message
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 50);
    }
    
    if (gameWon) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffdd00';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 90);
    }
    
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
