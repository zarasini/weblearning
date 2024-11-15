let gifair, gifbawah, giflampumati, giflampunyala;

let droplets = [];
let sprayX = 50;

let button;
let isToggled = false;

let slider1, slider2;
let label1, label2, label3, label4, label5;

let boxHeight = 0;
let panjangJari = 1;

let angle = 0;
let speed = 0;

let rumus;

function setup() {
  var canvas = createCanvas(windowWidth, 950);
  canvas.parent('canvas-container');

  // air waduk
  gifair = createImg('assets/images/air.gif', 'Air Waduk');

  // lampu nyala
  giflampunyala = createImg('assets/images/lampuon.gif', 'Lampu On');
  giflampunyala.position(50, 550);
  giflampunyala.size(160, 103);
  giflampunyala.hide();

  // lampu mati
  giflampumati = createImg('assets/images/lampuoff.gif', 'Lampu Off');
  giflampumati.position(50, 550);
  giflampumati.size(160, 103);
  giflampumati.hide();

  // air buang
  gifbawah = createImg('assets/images/airbawah.gif', 'Air Buangan');
  gifbawah.position(800, 925);
  gifbawah.size(1120, 25);

  slider1 = createSlider(0, 15, 0);
  slider1.position(20, 50);
  slider1.input(updateBoxHeight);

  slider2 = createSlider(1, 10, 1);
  slider2.position(20, 100);
  slider2.input(updatePanjangJari);

  label1 = createDiv("Ketinggian Air Waduk");
  label1.position(20, 30);
  label1.style('color', 'white');

  label2 = createDiv("Panjang Baling-Baling");
  label2.position(20, 80);
  label2.style('color', 'white');

  button = createButton('START');
  button.style('background-color', color(255, 255, 255));
  button.position(20, 150);
  button.mousePressed(toggleText);
  button.size(150, 40);
}

function draw() {
  background(0, 0, 120);

  let tinggi = slider1.value();
  let jarak = slider2.value();

  gifair.position(300, (450 - (tinggi * 30)));

  rumus = rumuss(tinggi, jarak);
  speed = rumus[1];
  fill(225, 225, 220);
  text(tinggi + ' Meter', 160, 65);
  text(jarak + ' Meter', 160, 115);

  tanah();
  boxes(450 - (tinggi * 30));
  push();
  translate((830 + panjangJari * 30), 650);
  rotate(radians(angle));
  outerBlade();
  pop();

  push();
  translate((830 + panjangJari * 30), 650);
  rotate(radians(angle));
  innerBlade();
  pop();


  textSize(28);
  noFill();
  strokeWeight(4);
  stroke(255, 255, 0);
  rect(1000, 30, 500, 200);

  noStroke();
  fill(255, 255, 0);
  text("Hasil Yang Diperoleh", 1050, 100);
  text("Kecepatan (V) :", 1050, 140);
  text(nf(rumus[0], 0, 4), 1330, 140);
  text("Kecepatan Putar (ω) : ", 1050, 180);
  text(nf(rumus[1], 0, 4), 1330, 180);
  // text("Energi : ", 1050, 220);
  // text(nf(rumus[2], 0, 4), 1330, 220);
  textSize(16);
  if (isToggled) {
    angle -= speed;
    if (boxHeight != 0) {
      if (rumus[2] > 1) {
        giflampumati.hide();
        giflampunyala.show();
      } else {
        giflampunyala.hide();
        giflampumati.show();
      }
      if (frameCount % 1 === 0) {
        droplets.push(new Droplet(800, random(450 - (tinggi * 30) + 200, 450 - (tinggi * 30) + 180), panjangJari));
      }

      for (let i = droplets.length - 1; i >= 0; i--) {
        droplets[i].update();
        droplets[i].display();

        if (droplets[i].offscreen() || droplets[i].hitGround()) {
          droplets.splice(i, 1);
        }
      }
    }
  } else {
    giflampunyala.hide();
    giflampumati.show();
  }

}

function toggleText() {
  isToggled = !isToggled;
  if (isToggled) {
    button.html("STOP");
    slider1.attribute('disabled', '');
    slider2.attribute('disabled', '');
  } else {
    button.html("START");
    slider1.removeAttribute('disabled');
    slider2.removeAttribute('disabled');
  }
}

function boxes(tinggi) {
  fill(225, 225, 220);
  rect(300, tinggi, 500, 200);
}

function tanah() {
  fill(0, 0, 0);
  rect(0, 650, 800, 300);
}

function updateBoxHeight() {
  boxHeight = slider1.value();
}

function updatePanjangJari() {
  panjangJari = slider2.value();
}

function outerBlade() {
  noStroke();
  fill(255, 0, 0);
  rect(-30, -8, 60, 16);
  rect(-8, -30, 16, 60);
}

function innerBlade() {
  fill(0, 255, 0);
  rect(-30 - (panjangJari * 30), -5, 60 + (panjangJari * 60), 10);
  rect(-5, -30 - (panjangJari * 30), 10, 60 + (panjangJari * 60));
}

function rumuss(tinggi, jarak) {
  var g = 9.8;
  var V = Math.sqrt(2 * tinggi * g);
  var W = V / jarak;
  var energy = 0.5 * W * W;
  return [V, W, energy];
}

class Droplet {
  constructor(x, y, baling) {
    this.x = x;
    this.y = y;
    this.targetSize = random(2, 5);
    this.size = random(1, 10);
    this.speedX = random(0, baling);
    this.speedY = random(5, 20);
  }

  update() {
    this.size = lerp(this.size, this.targetSize, 0.05);

    this.x += this.speedX;
    this.y += this.speedY;

    this.speedY += 0.1;
  }

  display() {
    fill(255, 255, 255, 150);
    ellipse(this.x, this.y, this.size, this.size);
  }

  offscreen() {
    return this.x > width;
  }

  hitGround() {
    return this.y > height - this.size / 2;
  }
}