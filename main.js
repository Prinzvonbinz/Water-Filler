let totalLiters = 0;
let coins = 0;

let glasses = [];
let glassCost = 50;

let isFilling = false;
let fillRate = 0.002;
let hoseLevel = 0;
let hoseCost = 10;

let collectorLevel = 0;
let collectorCost = 100;

let changerLevel = 0;
let changerCost = 200;

let waterTypes = [
  { name: "Klar", multiplier: 1 },
  { name: "Mineralisch", multiplier: 1.5 },
  { name: "Zitrone", multiplier: 2.5 },
];
let waterLevel = 0;
let waterCost = 150;

const glassContainer = document.getElementById("glassContainer");
const fillButton = document.getElementById("fillButton");

// Anzeige-Update
function updateUI() {
  document.getElementById("totalLiters").textContent = totalLiters.toFixed(2);
  document.getElementById("coins").textContent = Math.floor(coins);

  document.getElementById("hoseLevel").textContent = hoseLevel;
  document.getElementById("hoseCost").textContent = hoseCost;

  document.getElementById("glassCost").textContent = glassCost;

  document.getElementById("collectorLevel").textContent = collectorLevel;
  document.getElementById("collectorCost").textContent = collectorCost;

  document.getElementById("changerLevel").textContent = changerLevel;
  document.getElementById("changerCost").textContent = changerCost;

  document.getElementById("waterType").textContent = waterTypes[waterLevel].name;
  document.getElementById("waterCost").textContent = waterCost;
}

// Glas-Objekt erzeugen
function createGlass() {
  const glass = {
    level: 0,
    element: document.createElement("div"),
    fill: document.createElement("div"),
    filled: 0,
  };
  glass.element.classList.add("glass");
  glass.fill.classList.add("fill");
  glass.fill.style.height = "0%";
  glass.element.appendChild(glass.fill);
  glassContainer.appendChild(glass.element);
  glasses.push(glass);
}

// Upgrade Wasserhahn
function buyHose() {
  if (coins >= hoseCost) {
    coins -= hoseCost;
    hoseLevel++;
    hoseCost = Math.floor(hoseCost * 1.8);
    updateUI();
  }
}

// Neues Glas kaufen
function buyGlass() {
  if (coins >= glassCost) {
    coins -= glassCost;
    glassCost = Math.floor(glassCost * 1.6);
    createGlass();
    updateUI();
  }
}

// Automatischer Sammler
function buyCollector() {
  if (coins >= collectorCost) {
    coins -= collectorCost;
    collectorLevel++;
    collectorCost = Math.floor(collectorCost * 2);
    updateUI();
  }
}

// Automatischer Glaswechsler
function buyChanger() {
  if (coins >= changerCost) {
    coins -= changerCost;
    changerLevel++;
    changerCost = Math.floor(changerCost * 2);
    updateUI();
  }
}

// Wasserqualität verbessern
function upgradeWater() {
  if (waterLevel < waterTypes.length - 1 && coins >= waterCost) {
    coins -= waterCost;
    waterLevel++;
    waterCost = Math.floor(waterCost * 2.5);
    updateUI();
  }
}

// Gedrückt halten zum manuellen Füllen
fillButton.addEventListener("pointerdown", () => {
  isFilling = true;
});

fillButton.addEventListener("pointerup", () => {
  isFilling = false;
});

fillButton.addEventListener("pointerleave", () => {
  isFilling = false;
});

// Aktualisiert die Füllhöhe eines Glases
function fillGlass(glass, amount) {
  glass.filled += amount;

  if (glass.filled >= 1) {
    earn(glass);
    glass.filled = 0; // Immer leeren, egal ob Changer da ist
  }

  glass.fill.style.height = `${glass.filled * 100}%`;
}

// Belohnung bei vollem Glas
function earn(glass) {
  const bonus = waterTypes[waterLevel].multiplier;
  coins += 1 * bonus;
  totalLiters += 1 * bonus;
}

// Automatisches Füllen durch Wasserhahn
function autoFill() {
  glasses.forEach(glass => {
    if (hoseLevel > 0 && glass.filled < 1) {
      fillGlass(glass, 0.001 * hoseLevel);
    }
  });
}

// Automatisches Einsammeln durch Sammler (mit Bonus-Münzen)
function autoCollect() {
  glasses.forEach(glass => {
    if (glass.filled >= 1 && collectorLevel > 0) {
      // Bonus-Münzen pro Sammler-Level
      const bonusCoins = collectorLevel * 0.5;
      const bonusMultiplier = waterTypes[waterLevel].multiplier;
      coins += 1 * bonusMultiplier + bonusCoins;

      if (changerLevel > 0) {
        glass.filled = 0;
        glass.fill.style.height = "0%";
      }
    }
  });
}

// Game Loop
function gameLoop() {
  // Glaswechsler: Füge Gläser hinzu bis changerLevel erreicht ist
  while (glasses.length < changerLevel) {
    createGlass();
  }

  if (isFilling) {
    glasses.forEach(glass => {
      if (glass.filled < 1) {
        fillGlass(glass, fillRate);
      }
    });
  }

  autoFill();
  autoCollect();
  updateUI();
  requestAnimationFrame(gameLoop);
}

// Start
createGlass(); // Start mit einem Glas
updateUI();
gameLoop();
