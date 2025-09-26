// ---------------- Arte generativo ----------------
let squares = [];
let colors;

function setup() {
  let canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('canvas-container');
  noStroke();

  colors = ["#d2d2d0", "#565045", "#3c3634"];

  for (let i = 0; i < 180; i++) {
    let axis = random() < 0.5 ? "x" : "y";
    squares.push({
      x: random(width),
      y: random(height),
      size: random(30, 80),
      axis: axis,
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      rotSpeed: random(-0.05, 0.05),
      color: color(random(colors)),
    });
  }
}

function draw() {
  clear();

  for (let s of squares) {
    push();
    translate(s.x, s.y);
    rotate(s.angle);
    fill(s.color);
    rectMode(CENTER);
    rect(0, 0, s.size, s.size);
    pop();

    if (s.axis === "x") {
      s.x += s.speed;
      if (s.x > width + s.size) s.x = -s.size;
    } else {
      s.y += s.speed;
      if (s.y > height + s.size) s.y = -s.size;
    }
    s.angle += s.rotSpeed;
  }
}

// ---------------- Interfaz ----------------
const header = document.getElementById("main-header");
const triangle = document.getElementById("triangle");
const dropdown = document.getElementById("dropdown");

let lastScroll = 0;
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > lastScroll) {
    header.classList.add("hidden");
    triangle.classList.add("collapsed");
    dropdown.style.opacity = "0";
    setTimeout(() => (dropdown.style.display = "none"), 500);
  } else {
    header.classList.remove("hidden");
    triangle.classList.remove("collapsed");
  }
  lastScroll = currentScroll;
});

triangle.addEventListener("click", () => {
  if (dropdown.style.display === "flex") {
    dropdown.style.opacity = "0";
    setTimeout(() => (dropdown.style.display = "none"), 500);
  } else {
    dropdown.style.display = "flex";
    setTimeout(() => (dropdown.style.opacity = "1"), 50);
  }
});

document.querySelectorAll(".drop-item").forEach((item) => {
  item.addEventListener("click", () => {
    const sub = document.getElementById(item.id + "-sub");
    if (sub.style.display === "block") {
      sub.style.display = "none";
    } else {
      sub.style.display = "block";
    }
  });
});

// ---------------- Wiki y Tareas ----------------
document.querySelector(".wiki-link").addEventListener("click", () => {
  window.open("https://wiki.ead.pucv.cl/Sitio_Web_IE_-_Iv%C3%A1n_Castillo", "_blank");
});

document.querySelectorAll(".tarjeta").forEach((tarjeta) => {
  const link = tarjeta.getAttribute("data-link");
  if (link) {
    tarjeta.addEventListener("click", () => {
      window.open(link, "_blank");
    });
  }
});

// ---------------- Pong ----------------
let pongSketch = (p) => {
  let ball, player, ai, playerScore, aiScore;

  p.setup = function () {
    p.createCanvas(600, 400);
    ball = new Ball();
    player = new Paddle(true);
    ai = new Paddle(false);
    playerScore = 0;
    aiScore = 0;
  };

  p.draw = function () {
    p.background(0);
    ball.update();
    ball.show();
    player.show();
    ai.show();

    player.update();
    ai.updateAI(ball);

    if (ball.collides(player) || ball.collides(ai)) {
      ball.xspeed *= -1;
    }

    if (ball.x < 0) {
      aiScore++;
      ball.reset();
    } else if (ball.x > p.width) {
      playerScore++;
      ball.reset();
    }

    p.textSize(20);
    p.fill(255);
    p.text(playerScore, 50, 30);
    p.text(aiScore, p.width - 70, 30);
  };

  class Ball {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = p.width / 2;
      this.y = p.height / 2;
      this.xspeed = p.random([-3, 3]);
      this.yspeed = p.random(-2, 2);
      this.r = 12;
    }
    update() {
      this.x += this.xspeed;
      this.y += this.yspeed;

      if (this.y < 0 || this.y > p.height) {
        this.yspeed *= -1;
      }
    }
    show() {
      p.fill(255);
      p.noStroke();
      p.ellipse(this.x, this.y, this.r * 2);
    }
    collides(paddle) {
      return (
        this.x - this.r < paddle.x + paddle.w &&
        this.x + this.r > paddle.x &&
        this.y > paddle.y &&
        this.y < paddle.y + paddle.h
      );
    }
  }

  class Paddle {
    constructor(isPlayer) {
      this.w = 12;
      this.h = 80;
      this.y = p.height / 2 - this.h / 2;
      this.isPlayer = isPlayer;
      this.x = isPlayer ? 0 : p.width - this.w;
    }
    update() {
      this.y = p.mouseY - this.h / 2;
      this.y = p.constrain(this.y, 0, p.height - this.h);
    }
    updateAI(ball) {
      let target = ball.y - this.h / 2;
      this.y += (target - this.y) * 0.05;
      this.y = p.constrain(this.y, 0, p.height - this.h);
    }
    show() {
      p.fill(255);
      p.rect(this.x, this.y, this.w, this.h);
    }
  }
};

document.getElementById("easter-egg").addEventListener("click", () => {
  document.getElementById("pong-modal").style.display = "block";
  new p5(pongSketch, "pong-container");
});

document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("pong-modal").style.display = "none";
  document.getElementById("pong-container").innerHTML = "";
});
