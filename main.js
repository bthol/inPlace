// PARAMETERS
const cols = 8;
const rows = 14;
const trays = 3;
const bags = 2;
const emptyRows = [
  // [column, row]
  // Col #1
  [1, 4],
  [1, 8],
  
  // Col #2
  
  // Col #3
  [3, 5],
  [3, 11],
  [3, 12],
  
  // Col #4
  [4, 8],
  
  // Col #5
  [5, 3],
  [5, 8],
  
  // Col #6
  [6, 8],
  
  // Col #7
  [7, 5],
  [7, 10],
  
  // Col #8
  
];

// SYSTEM SETUP
const storage = document.body.querySelector('#storage-container');

function generateID() {
  let id = "";
  for (let i = 0; i < 10; i++) {
    id += `${Math.floor(Math.random() * 11)}`;
  }
  return id;
};

function createTray() {
  const tray = document.createElement('div');
  tray.classList.add("tray");
  for (let i = 0; i < bags; i++) {
    const bag = document.createElement('div');
    bag.classList.add("bag");
    bag.classList.add("bag-empty");
    bag.setAttribute("id", generateID());
    bag.innerText = "0";
    tray.appendChild(bag);
  }
  return tray;
};

function createRow() {
  const row = document.createElement('div');
  row.classList.add("row");
  for (let i = 0; i < trays; i++) {
    const tray = createTray();
    row.appendChild(tray);
  }
  return row;
};

function createColumn(number) {
  const container = document.createElement('div');
  
  const colNum = document.createElement('h3');
  colNum.innerText = number;
  colNum.style.marginBottom = 0;
  
  const colData = document.createElement('div');
  colData.classList.add("col-data");
    
  const col = document.createElement('div');
  col.classList.add("column");

  container.appendChild(colNum);
  container.appendChild(col);

  return container;
};

function generateStorage() {
  for (let i = 0; i < cols; i++) {
    const container = createColumn(`Column #${i + 1} `);
    const col = container.querySelector('div');
    for (let j = 0; j < rows; j++) {
      const row = createRow();
      col.appendChild(row);
    }
    storage.appendChild(container);
  }
};
generateStorage();

// SYSTEM OPERATION
function emptyRow(col, row) {
  try {
    storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].classList.add("empty-row");
    
    storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].querySelectorAll('.tray').forEach((r) => {
      r.style.visibility = "hidden";
    });
    for (let i = 0; i < trays; i++) {
      for (let j = 0; j < bags; j++) {
        storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].querySelectorAll('.tray')[i].querySelectorAll('.bag')[j].classList.remove("bag-empty");
      }
    }
    
  } catch (error) {
    console.log({"operation": "emptyRow", "error": error});
  }
};

emptyRow(0, 3);

function emptyRowsAll(x) {
  for (let i = 0; i < x.length; i++) {
    emptyRow(x[i][0], x[i][1]);
  }
};

// emptyRowsAll(emptyRows);

function addBags(col, row, tray) {
  try {
    if (!storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].classList.contains('empty-row')) {
      const bags = storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].querySelectorAll('.tray')[tray].querySelectorAll('.bag');
      for (let i = 0; i < bags.length; i++) {
        bags[i].classList.remove("bag-empty");
        bags[i].classList.add("bag-full");
        bags[i].innerText = "1";
      }
    }
  } catch (error) {
    console.log({"operation": "addBags", "error": error});
  }
};
// addBags(0, 3, 0);
// addBags(0, 3, 1);
// addBags(0, 3, 2);

function addBagsColumn(col) {
  for (let i = 0; i < rows; i++) {
    addBags(col, i, 0);
    addBags(col, i, 1);
    addBags(col, i, 2);
  }
};

addBagsColumn(0);

function addBagsColumnsAll(cols) {
  for (let i = 0; i < cols; i++) {
    addBagsColumn(i);
  }
};

// addBagsColumnsAll(cols);

// Column Data
// function addColumnData(col) {
  
// };

// System Model Settings
const settings = document.body.querySelector('#system-model-settings');
settings.save.addEventListener("click", () => {
    // Model Display Rescaling
    if (settings.scale.value === "small") {
        document.body.style.setProperty("--scale", ".42vmin");
        document.body.style.setProperty("--wrapping", "wrap");
    } else if (settings.scale.value === "medium") {
        document.body.style.setProperty("--scale", "1.5vmin");
        document.body.style.setProperty("--wrapping", "wrap");
    } else if (settings.scale.value === "large") {
        document.body.style.setProperty("--scale", "3vmin");
        document.body.style.setProperty("--wrapping", "no-wrap");
    }
});