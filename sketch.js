let achtergronden = [];
let huidigeAchtergrond = 0;
let gestart = false;
let knop;
let kamerKnop;
let WoonKnop;
let SlaapKnop;
let opstaKnop;
let minigameKnop;
let terugKnop;
let character;
let mouth;
let verhongerd;
let appelAfbeelding;
let BadkamerwasDing;
let slaapend;
let wapen;
let mySound;
let gunBreedte = 200;
let gunHoogte = 120;
let honger = 100;
let energieCount = 100;
let gezondheidCount = 100;
let schoonheidCount = 100;
let alienY = 100;
let alienGrondY = 190;
let appelX = 650;
let appelY = 225;
let appelDiameter = 75;
let appelWordtGesleept = false;
let appelOffsetX = 0;
let appelOffsetY = 0;
let gegeten = false;
let gegetenFrame = 0;
let helen = false;
let wasStartX = 40;
let wasStartY = 190;
let wasX = 40;
let wasY = 190;
let wasDiameter = 80;
let wasWordtGesleept = false;
let wasOffsetX = 0;
let wasOffsetY = 0;
let slaapt = false;
let bedX = 150;
let bedY = 200;
let bedBreedte = 300;
let bedHoogte = 150;
let doodFrame = 0;
let minigameActief = false;
let minigameScore = 0;
let ballen = [];
let gridX = 200;
let gridY = 50;
let ballAfstand = 100;
let ballDiameter = 70;


//alle media
function preload() {
  let achtergrondBestanden = ["Woonkamer.webp", "badkamer.avif", "Slaapkamer.avif"];
  for (let i = 0; i < achtergrondBestanden.length; i++) {
    achtergronden[i] = loadImage(achtergrondBestanden[i]);
  }

  character = loadImage("C2.png");
  mouth = loadImage("Mouth.gif");
  verhongerd = loadImage("HungryC.png");
  appelAfbeelding = loadImage("Appel.png");
  BadkamerwasDing = loadImage("Alien.Badkamer.Schrob-removebg-preview.png");
  slaapend = loadImage("slaapende.alien.jpg");
  wapen = loadImage("aliennn-removebg-preview.png");
  mySound = loadSound("Raygun.mp3.mp3");
}

function setup() {
  createCanvas(700, 400);

  //startknop
  knop = createButton("Press to bring him to life");
  knop.position(175, 300);
  knop.size(350, 75);
  knop.style("font-size", "24px");
  knop.mousePressed(function () {
    gestart = true;
    knop.hide();
    kamerKnop.show();
    WoonKnop.show();
    SlaapKnop.show();
    opslaan();
  });

  //knop naar badkamer
  kamerKnop = createButton("Badkamer");
  kamerKnop.position(580, 25);
  kamerKnop.size(100, 50);
  kamerKnop.style("font-size", "18px");
  kamerKnop.hide();
  kamerKnop.mousePressed(function () {
    huidigeAchtergrond = 1;
  });

  //knop naar woonkamer
  WoonKnop = createButton("Woonkamer");
  WoonKnop.position(580, 85);
  WoonKnop.size(100, 50);
  WoonKnop.style("font-size", "16px");
  WoonKnop.hide();
  WoonKnop.mousePressed(function () {
    huidigeAchtergrond = 0;
  });

  //knop naar slaapkamer
  SlaapKnop = createButton("Slaapkamer");
  SlaapKnop.position(580, 145);
  SlaapKnop.size(100, 50);
  SlaapKnop.style("font-size", "16px");
  SlaapKnop.hide();
  SlaapKnop.mousePressed(function () {
    huidigeAchtergrond = 2;
  });

  //opnieuw beginnen knop
  opstaKnop = createButton("Restart game");
  opstaKnop.position(250, 260);
  opstaKnop.size(200, 60);
  opstaKnop.style("font-size", "24px");
  opstaKnop.hide();
  opstaKnop.mousePressed(resetSpel);

  //minigame knop
  minigameKnop = createButton("Minigame");
  minigameKnop.position(20, 340);
  minigameKnop.size(130, 45);
  minigameKnop.style("font-size", "18px");
  minigameKnop.hide();
  minigameKnop.mousePressed(startMinigame);

  //terug knop
  terugKnop = createButton("Back");
  terugKnop.position(580, 25);
  terugKnop.size(100, 50);
  terugKnop.style("font-size", "18px");
  terugKnop.hide();
  terugKnop.mousePressed(function () {
    minigameActief = false;
  });

  laden();
  window.addEventListener("beforeunload", opslaan);
}

function draw() {
  //begin scherm
  if (gestart === false) {
    startScherm();
    return;
  }

  knoppenBijwerken();

  //minigame laten zien
  if (minigameActief === true) {
    minigameScherm();
    return;
  }

  cursor();
  slaapen();

  //elke 30 frames opslaan
  if (frameCount % 30 === 0) {
    opslaan();
  }

  //ligt hij in bed?
  let slaapendInBed = huidigeAchtergrond === 2 && slaapt === true;

  //achtergrond tekenen
  if (slaapendInBed === true) {
    image(slaapend, 0, 0, width, height);
  } else {
    image(achtergronden[huidigeAchtergrond], 0, 0, width, height);
  }

  Honger();
  energie();
  gezondheid();
  schoonheid();
  eten();
  gezondheidhelen();

  //alien laten zakken
  alienY = lerp(alienY, alienGrondY, 0.08);

  if (slaapendInBed === false) {
    if (gezondheidCount <= 0) {
      //alien valt om als hij dood is
      let hoek = min(doodFrame * 2, 90);

      push();
      translate(width / 2, alienY + 200);
      rotate(radians(hoek));
      image(verhongerd, -60, -200, 120, 200);
      pop();
    } else {
      Alien(width / 2 - 60, alienY);
    }
  }

  schoonMaken();
  appel();
  doodScherm();
}

//spel opslaan
function opslaan() {
  let data = {
    gestart: gestart,
    huidigeAchtergrond: huidigeAchtergrond,
    honger: honger,
    energieCount: energieCount,
    gezondheidCount: gezondheidCount,
    schoonheidCount: schoonheidCount,
    slaapt: slaapt,
    doodFrame: doodFrame
  };

  try {
    localStorage.setItem("alienSpel", JSON.stringify(data));
  } catch (fout) {
    console.log("Opslaan mislukt");
  }
}

//spel laden
function laden() {
  try {
    let tekst = localStorage.getItem("alienSpel");

    //niks opgeslagen
    if (tekst === null) {
      return;
    }

    let data = JSON.parse(tekst);

    gestart = data.gestart;
    huidigeAchtergrond = data.huidigeAchtergrond;
    honger = data.honger;
    energieCount = data.energieCount;
    gezondheidCount = data.gezondheidCount;
    schoonheidCount = data.schoonheidCount;
    slaapt = data.slaapt;
    doodFrame = data.doodFrame;
  } catch (fout) {
    console.log("Laden mislukt");
  }

  //al gestart? dan startknop weg
  if (gestart === true) {
    knop.hide();
    alienY = alienGrondY;
  }
}

//beginscherm
function startScherm() {
  image(achtergronden[huidigeAchtergrond], 0, 0, width, height);

  //donker laagje
  noStroke();
  fill(0, 150);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("Alien tamagotchi", width / 2, 50);

  Alien(width / 2 - 60, alienY);
}

//alien tekenen
function Alien(x, y) {
  image(character, x, y, 120, 200);
  image(mouth, x + 44, y + 47, 40, 20);
}

//honger balk
function Honger() {
  noStroke();
  fill(225);
  rect(95, 7, 200, 16);
  fill(255, 0, 0);
  rect(95, 7, honger * 2, 16);
  stroke(0);
  strokeWeight(4);
  noFill();
  rect(95, 7, 200, 16);

  noStroke();
  fill(0);
  textSize(15);
  textAlign(LEFT, CENTER);
  text("Honger:", 30, 20);
  textAlign(RIGHT, CENTER);
  text(honger, 290, 17);

  //honger laten dalen
  if (frameCount % 45 === 0 && honger > 0) {
    honger = honger - 1;
  }
}

//energie balk
function energie() {
  noStroke();
  fill(225);
  rect(95, 37, 200, 16);
  fill(255, 0, 0);
  rect(95, 37, energieCount * 2, 15);
  stroke(0);
  strokeWeight(4);
  noFill();
  rect(95, 37, 200, 16);

  noStroke();
  fill(0);
  textSize(15);
  textAlign(LEFT, CENTER);
  text("energie:", 30, 50);
  textAlign(RIGHT, CENTER);
  text(energieCount, 290, 47);

  //energie laten dalen
  if (frameCount % 120 === 0 && energieCount > 0 && slaapt === false) {
    energieCount = energieCount - 1;
  }
}

//gezondheid balk
function gezondheid() {
  noStroke();
  fill(225);
  rect(95, 67, 200, 16);
  fill(255, 0, 0);
  rect(95, 67, gezondheidCount * 2, 16);
  stroke(0);
  strokeWeight(4);
  noFill();
  rect(95, 67, 200, 16);

  noStroke();
  fill(0);
  textSize(15);
  textAlign(LEFT, CENTER);
  text("gezondheid:", 10, 80);
  textAlign(RIGHT, CENTER);
  text(gezondheidCount, 290, 77);

  //gezondheid daalt als iets op 0 staat
  if (honger === 0 && frameCount % 3 === 0 && gezondheidCount > 0) {
    gezondheidCount = gezondheidCount - 1;
  }
  if (energieCount === 0 && frameCount % 7 === 0 && gezondheidCount > 0) {
    gezondheidCount = gezondheidCount - 1;
  }
  if (schoonheidCount === 0 && frameCount % 12 === 0 && gezondheidCount > 0) {
    gezondheidCount = gezondheidCount - 1;
  }
}

//schoonheid balk
function schoonheid() {
  noStroke();
  fill(225);
  rect(95, 97, 200, 16);
  fill(255, 0, 0);
  rect(95, 97, schoonheidCount * 2, 16);
  stroke(0);
  strokeWeight(4);
  noFill();
  rect(95, 97, 200, 16);

  noStroke();
  fill(0);
  textSize(15);
  textAlign(LEFT, CENTER);
  text("schoonheid:", 10, 110);
  textAlign(RIGHT, CENTER);
  text(schoonheidCount, 290, 107);

  //schoonheid laten dalen
  if (frameCount % 90 === 0 && schoonheidCount > 0) {
    schoonheidCount = schoonheidCount - 1;
  }
}

//appel tekenen en slepen
function appel() {
  //alleen in de woonkamer
  if (huidigeAchtergrond !== 0) {
    return;
  }

  //na het eten komt er na een tijdje een nieuwe
  if (gegeten === true) {
    if (frameCount - gegetenFrame > 60) {
      gegeten = false;
      appelX = 650;
      appelY = 225;
    }
    return;
  }

  //appel volgt de muis
  if (appelWordtGesleept === true) {
    appelX = mouseX + appelOffsetX;
    appelY = mouseY + appelOffsetY;
  }

  image(appelAfbeelding, appelX - appelDiameter / 2, appelY - appelDiameter / 2, appelDiameter, appelDiameter);
}

function mousePressed() {
  //in de minigame is klikken schieten
  if (minigameActief === true) {
    minigameKlik();
    return;
  }

  //op de appel geklikt
  if (gestart === true && huidigeAchtergrond === 0 && gegeten === false && dist(mouseX, mouseY, appelX, appelY) < appelDiameter / 2) {
    appelWordtGesleept = true;
    appelOffsetX = appelX - mouseX;
    appelOffsetY = appelY - mouseY;
  }

  //op het schrobding geklikt
  if (gestart === true && huidigeAchtergrond === 1 && dist(mouseX, mouseY, wasX, wasY) < wasDiameter / 2) {
    wasWordtGesleept = true;
    wasOffsetX = wasX - mouseX;
    wasOffsetY = wasY - mouseY;
  }

  //op het bed geklikt: slapen aan of uit
  if (gestart === true && huidigeAchtergrond === 2 && gezondheidCount > 0) {
    let opBed = mouseX > bedX && mouseX < bedX + bedBreedte && mouseY > bedY && mouseY < bedY + bedHoogte;

    if (opBed === true) {
      if (slaapt === true) {
        slaapt = false;
      } else {
        slaapt = true;
      }
    }
  }
}

function mouseReleased() {
  //appel loslaten
  appelWordtGesleept = false;

  //schrobding loslaten
  if (wasWordtGesleept === true) {
    wasWordtGesleept = false;

    //zit hij op de alien?
    let alienX = width / 2 - 60;
    let opAlien = wasX > alienX && wasX < alienX + 120 && wasY > alienY && wasY < alienY + 200;

    //alien wordt schoner
    if (opAlien === true && gezondheidCount > 0) {
      schoonheidCount = schoonheidCount + 25;

      if (schoonheidCount > 100) {
        schoonheidCount = 100;
      }
    }

    //schrobding terug zetten
    wasX = wasStartX;
    wasY = wasStartY;
  }
}

//alien laten eten
function eten() {
  let alienX = width / 2 - 60;

  //appel op de alien?
  if (gegeten === false && appelWordtGesleept === false && gezondheidCount > 0) {
    if (appelX > alienX && appelX < alienX + 120 && appelY > alienY && appelY < alienY + 225) {
      gegeten = true;
      gegetenFrame = frameCount;
      honger = honger + 25;

      if (honger > 100) {
        honger = 100;
      }
    }
  }
}

//gezondheid laten stijgen
function gezondheidhelen() {
  //alleen als alles goed is
  if (honger > 75 && energieCount > 0 && schoonheidCount > 0) {
    helen = true;
  } else {
    helen = false;
  }

  if (helen === true) {
    if (frameCount % 10 === 0 && gezondheidCount > 0) {
      gezondheidCount = gezondheidCount + 1;
    }
  }

  if (gezondheidCount > 100) {
    gezondheidCount = 100;
  }
}

//schrobding tekenen en slepen
function schoonMaken() {
  //alleen in de badkamer
  if (huidigeAchtergrond !== 1) {
    wasWordtGesleept = false;
    wasX = wasStartX;
    wasY = wasStartY;
    return;
  }

  //schrobding volgt de muis
  if (wasWordtGesleept === true) {
    wasX = mouseX + wasOffsetX;
    wasY = mouseY + wasOffsetY;
  }

  image(BadkamerwasDing, wasX - wasDiameter / 2, wasY - wasDiameter / 2, wasDiameter, wasDiameter);
}

//slapen
function slaapen() {
  //alleen in de slaapkamer en niet als hij dood is
  if (huidigeAchtergrond !== 2 || gezondheidCount <= 0) {
    slaapt = false;
    return;
  }

  //energie erbij tijdens het slapen
  if (slaapt === true && frameCount % 10 === 0 && energieCount < 100) {
    energieCount = energieCount + 1;
  }
}

//knoppen laten zien of verstoppen
function knoppenBijwerken() {
  //dood: alles weg
  if (gezondheidCount <= 0) {
    minigameActief = false;
    minigameKnop.hide();
    terugKnop.hide();
    return;
  }

  if (minigameActief === true) {
    //in de minigame alleen terug knop
    kamerKnop.hide();
    WoonKnop.hide();
    SlaapKnop.hide();
    minigameKnop.hide();
    terugKnop.show();
  } else {
    kamerKnop.show();
    WoonKnop.show();
    SlaapKnop.show();
    terugKnop.hide();

    //minigame knop alleen in de woonkamer
    if (huidigeAchtergrond === 0) {
      minigameKnop.show();
    } else {
      minigameKnop.hide();
    }
  }
}

//minigame starten
function startMinigame() {
  minigameActief = true;
  minigameScore = 0;
  appelWordtGesleept = false;
  ballen = [];

  //3 ballen op willekeurige plekken
  while (ballen.length < 3) {
    let ballNummer = floor(random(9));

    if (ballen.includes(ballNummer) === false) {
      ballen.push(ballNummer);
    }
  }
}

//nieuwe plek voor een bal
function nieuweBallNummer() {
  let ballNummer = floor(random(9));

  //zoeken tot de plek vrij is
  while (ballen.includes(ballNummer) === true) {
    ballNummer = floor(random(9));
  }

  return ballNummer;
}

//midden van een bal (x)
function ballMiddenX(ballNummer) {
  return gridX + (ballNummer % 3) * ballAfstand + ballAfstand / 2;
}

//midden van een bal (y)
function ballMiddenY(ballNummer) {
  return gridY + floor(ballNummer / 3) * ballAfstand + ballAfstand / 2;
}

//schieten in de minigame
function minigameKlik() {
  mySound.play();

  //kijken of een bal geraakt is
  for (let i = 0; i < ballen.length; i++) {
    let x = ballMiddenX(ballen[i]);
    let y = ballMiddenY(ballen[i]);

    if (dist(mouseX, mouseY, x, y) < ballDiameter / 2) {
      //geraakt: punt erbij en bal naar nieuwe plek
      ballen[i] = nieuweBallNummer();
      minigameScore = minigameScore + 1;
      break;
    }
  }
}

//minigame tekenen
function minigameScherm() {
  background(255);
  noCursor();

  // 3x3 voor de ballen
  stroke(200);
  strokeWeight(2);
  noFill();
  for (let rij = 0; rij < 3; rij++) {
    for (let kolom = 0; kolom < 3; kolom++) {
      rect(gridX + kolom * ballAfstand, gridY + rij * ballAfstand, ballAfstand, ballAfstand);
    }
  }

  //ballen
  stroke(0, 170, 190);
  strokeWeight(3);
  fill(0, 255, 255);
  for (let i = 0; i < ballen.length; i++) {
    circle(ballMiddenX(ballen[i]), ballMiddenY(ballen[i]), ballDiameter);
  }

  //tekst en score
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Shoot the balls  Score: " + minigameScore, width / 2, 25);

  //wapen rechtsonder
  image(wapen, width - gunBreedte - 10, height - gunHoogte - 10, gunBreedte, gunHoogte);

  //richtkruis
  stroke(0);
  strokeWeight(2);
  noFill();
  circle(mouseX, mouseY, 30);
  line(mouseX - 20, mouseY, mouseX + 20, mouseY);
  line(mouseX, mouseY - 20, mouseX, mouseY + 20);
}

//scherm als hij dood is
function doodScherm() {
  //nog levend
  if (gezondheidCount > 0) {
    return;
  }

  doodFrame = doodFrame + 1;

  //knoppen weg
  knop.hide();
  kamerKnop.hide();
  WoonKnop.hide();
  SlaapKnop.hide();

  //scherm langzaam zwart
  let doorzichtigheid = constrain((doodFrame - 60) * 4, 0, 255);
  noStroke();
  fill(0, doorzichtigheid);
  rect(0, 0, width, height);

  //tekst na een tijdje
  if (doodFrame > 130) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("Gleep Glorp has died", width / 2, height / 2 - 40);
  }

  //restart knop als laatste
  if (doodFrame > 170) {
    opstaKnop.show();
  }
}

//alles terug naar begin
function resetSpel() {
  honger = 100;
  energieCount = 100;
  gezondheidCount = 100;
  schoonheidCount = 100;
  alienY = 100;
  doodFrame = 0;
  slaapt = false;
  gegeten = false;
  appelWordtGesleept = false;
  appelX = 650;
  appelY = 225;
  wasWordtGesleept = false;
  wasX = wasStartX;
  wasY = wasStartY;
  huidigeAchtergrond = 0;
  gestart = false;
  minigameActief = false;
  minigameScore = 0;
  minigameKnop.hide();
  terugKnop.hide();
  opstaKnop.hide();
  knop.show();
  opslaan();
}