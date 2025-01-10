

window.onload = function () {
    let canvas, ctx;
    let blockSize = 30; 
    let widthInBlocks, heightInBlocks;
    let snakee, applee;
    let score = 0;
    let delay = 100;
    let timeout;
    let idleTime = 0; 
    // Fonction pour réinitialiser le timer d'inactivité
    function resetIdleTimer() {
      idleTime = 0; // Réinitialiser le timer d'inactivité
      if (!gameStarted) {
        startIdleTimer(); 
      }
    }
  
    // Fonction pour démarrer le jeu
    function startGame() {
      gameStarted = true;
      canvas.style.display = "block"; 
      snakee = new Snake(
        [
          [6, 4],
          [5, 4],
          [4, 4],
        ],
        "right"
      );
      applee = new Apple([10, 10]);
      score = 0;
      delay = 100;
      clearTimeout(timeout);
      refreshCanvas();
    }
  
    // Fonction de minuterie d'inactivité
    function startIdleTimer() {
      setInterval(() => {
        idleTime++; // Incrémente le temps d'inactivité chaque seconde
        if (idleTime >= 60) { // Si l'utilisateur est inactif pendant 60 secondes (1 minute)
          startGame(); // Démarre le jeu
        }
      }, 1000); // Vérifie l'inactivité chaque seconde
    }
  
    function init() {
      canvas = document.createElement("canvas");
      ctx = canvas.getContext("2d");
  
      canvas.style.border = "2px solid black";
      canvas.style.display = "none"; 
      canvas.style.margin = "50px auto";
  
      document.body.appendChild(canvas);
  
      updateCanvasSize(); // Définit la taille
      window.addEventListener("resize", updateCanvasSize); // Redimensionne si nécessaire
  
      startIdleTimer(); // Commence le timer d'inactivité
    }
  
    function updateCanvasSize() {
      canvas.width = window.innerWidth * 0.8; // 80% de la largeur de la fenêtre
      canvas.height = window.innerHeight * 0.6; // 60% de la hauteur de la fenêtre
      widthInBlocks = Math.floor(canvas.width / blockSize);
      heightInBlocks = Math.floor(canvas.height / blockSize);
    }
  
    function launch() {
      snakee = new Snake(
        [
          [6, 4],
          [5, 4],
          [4, 4],
        ],
        "right"
      );
      applee = new Apple([10, 10]);
      score = 0;
      delay = 100;
      clearTimeout(timeout);
      refreshCanvas();
    }
  
    function refreshCanvas() {
      snakee.advance();
      if (snakee.checkCollision()) {
        gameOver();
      } else {
        if (snakee.isEatingApple(applee)) {
          score++;
          snakee.ateApple = true;
  
          do {
            applee.setNewPosition();
          } while (applee.isOnSnake(snakee));
  
          if (score % 5 === 0) {
            speedUp();
          }
        }
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScore();
        snakee.draw();
        applee.draw();
        timeout = setTimeout(refreshCanvas, delay);
      }
    }
  
    function gameOver() {
      ctx.save();
      ctx.font = "bold 70px sans-serif";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
      ctx.font = "bold 30px sans-serif";
      ctx.fillText(
        "press space to start",
        canvas.width / 2,
        canvas.height / 2 + 50
      );
      ctx.restore();
    }
  
    function drawScore() {
      ctx.save();
      ctx.font = "bold 30px sans-serif";
      ctx.fillStyle = "black";
      ctx.fillText("Score: " + score, 10, 30);
      ctx.restore();
    }
  
    function speedUp() {
      delay /= 1.1;
    }
  
    function drawBlock(ctx, position) {
      const x = position[0] * blockSize;
      const y = position[1] * blockSize;
      ctx.fillRect(x, y, blockSize, blockSize);
    }
  
    function Snake(body, direction) {
      this.body = body;
      this.direction = direction;
      this.ateApple = false;
  
      this.draw = function () {
        ctx.save();
        ctx.fillStyle = "black";
        this.body.forEach((block) => drawBlock(ctx, block));
        ctx.restore();
      };
  
      this.advance = function () {
        const nextPosition = this.body[0].slice();
        switch (this.direction) {
          case "left":
            nextPosition[0]--;
            break;
          case "right":
            nextPosition[0]++;
            break;
          case "down":
            nextPosition[1]++;
            break;
          case "up":
            nextPosition[1]--;
            break;
          default:
            throw "Invalid direction";
        }
        this.body.unshift(nextPosition);
        if (!this.ateApple) {
          this.body.pop();
        } else {
          this.ateApple = false;
        }
      };
  
      this.setDirection = function (newDirection) {
        const allowedDirections =
          this.direction === "left" || this.direction === "right"
            ? ["up", "down"]
            : ["left", "right"];
        if (allowedDirections.includes(newDirection)) {
          this.direction = newDirection;
        }
      };
  
      this.checkCollision = function () {
        const head = this.body[0];
        const rest = this.body.slice(1);
        const [snakeX, snakeY] = head;
  
        const wallCollision =
          snakeX < 0 ||
          snakeX >= widthInBlocks ||
          snakeY < 0 ||
          snakeY >= heightInBlocks;
  
        const snakeCollision = rest.some(
          ([x, y]) => x === snakeX && y === snakeY
        );
  
        return wallCollision || snakeCollision;
      };
  
      this.isEatingApple = function (appleToEat) {
        const [snakeX, snakeY] = this.body[0];
        return snakeX === appleToEat.position[0] && snakeY === appleToEat.position[1];
      };
    }
  
    function Apple(position) {
      this.position = position;
  
      this.draw = function () {
        const radius = blockSize / 2;
        const x = this.position[0] * blockSize + radius;
        const y = this.position[1] * blockSize + radius;
  
        ctx.save();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
      };
  
      this.setNewPosition = function () {
        this.position = [
          Math.floor(Math.random() * widthInBlocks),
          Math.floor(Math.random() * heightInBlocks),
        ];
      };
  
      this.isOnSnake = function (snakeToCheck) {
        return snakeToCheck.body.some(
          ([x, y]) => x === this.position[0] && y === this.position[1]
        );
      };
    }
  
    // Ajouter des événements pour réinitialiser le timer d'inactivité lors des actions de l'utilisateur
    window.addEventListener("mousemove", resetIdleTimer); // Surveille le mouvement de la souris
    window.addEventListener("keydown", resetIdleTimer); // Surveille la pression des touches
    window.addEventListener("click", resetIdleTimer); // Surveille les clics
  
    // Ajouter un événement pour redémarrer le jeu lorsque l'utilisateur appuie sur Espace
    document.addEventListener("keydown", (e) => {
      const directions = {
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        32: "restart",
      };
  
      if (e.keyCode === 32) {
        startGame(); // Redémarre le jeu
      } else if (directions[e.keyCode]) {
        snakee.setDirection(directions[e.keyCode]);
      }
    });
  
    init(); // Initialisation du jeu
  };
  