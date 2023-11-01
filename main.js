// PARAMETERS
let cols = 2;
let rows = 2;
let containers = 2;
let slots = 2;
let emptyRows = [
  // [column, row]
  // Col #1
//   [1-1, 4],
//   [1-1, 8],
  
  // Col #2
//   [2-1, 8],
  
  // Col #3
//   [3-1, 5],
//   [3-1, 11],
//   [3-1, 12],
  
  // Col #4
//   [4-1, 8],
  
  // Col #5
//   [5-1, 3],
//   [5-1, 8],
  
  // Col #6
//   [6-1, 8],
  
  // Col #7
//   [7-1, 5],
//   [7-1, 10],
  
  // Col #8
  
];

// SYSTEM SETUP
const storage = document.body.querySelector('#storage-content');

function generateID() {
    let id = "";
    for (let i = 0; i < 10; i++) {
        id += `${Math.floor(Math.random() * 11)}`;
    }
    return id;
};

function createContainer() {
    const container = document.createElement('div');
    container.classList.add("container");
    for (let i = 0; i < slots; i++) {
        const slot = document.createElement('div');
        slot.classList.add("slot");
        slot.classList.add("slot-empty");
        slot.setAttribute("id", generateID());
        slot.innerText = "0";
        container.appendChild(slot);
    }
    return container;
};

function createRow() {
    const row = document.createElement('div');
    row.classList.add("row");
    for (let i = 0; i < containers; i++) {
        const container = createContainer();
        row.appendChild(container);
    }
    return row;
};

function createColumn(number) {
    const container = document.createElement('div');

    const colNum = document.createElement('h3');
    colNum.innerText = number;
    colNum.style.marginBottom = 0;

    const colData = document.createElement('p');
    colData.classList.add("col-data");

    const col = document.createElement('div');
    col.classList.add("column");

    container.appendChild(colNum);
    container.appendChild(colData);
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
        storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].querySelectorAll('.container').forEach((r) => {
            r.style.visibility = "hidden";
        });
        for (let i = 0; i < containers; i++) {
            for (let j = 0; j < slots; j++) {
                storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].querySelectorAll('.container')[i].querySelectorAll('.slot')[j].classList.remove("slot-empty");
            }
        }
    } catch (error) {
        console.log({"operation": "emptyRow", "error": error});
    }
};

function emptyRowsAll(x) {
    for (let i = 0; i < x.length; i++) {
        emptyRow(x[i][0], x[i][1]);
    }
};

function addSlots(col, row, container) {
    try {
        if (!storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].classList.contains('empty-row')) {
            const slots = storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].querySelectorAll('.container')[container].querySelectorAll('.slot');
            for (let i = 0; i < slots.length; i++) {
                slots[i].classList.remove("slot-empty");
                slots[i].classList.add("slot-full");
                slots[i].innerText = "1";
            }
        }
    } catch (error) {
        console.log({"operation": "addSlots", "error": error});
    }
};

function addSlotsColumn(col) {
    for (let i = 0; i < rows; i++) {
        addSlots(col, i, 0);
        addSlots(col, i, 1);
        addSlots(col, i, 2);
    }
};

function addSlotsColumnsAll(cols) {
    for (let i = 0; i < cols; i++) {
        addSlotsColumn(i);
    }
};

// Data
function addColumnData(col) {
    // select display
    const display = storage.querySelectorAll('.col-data')[col];
    // get data
    const full = storage.querySelectorAll('.column')[col].querySelectorAll('.slot-full').length;
    const empty = storage.querySelectorAll('.column')[col].querySelectorAll('.slot-empty').length;
    // display data
    const fullSlots = document.createElement('div');
    fullSlots.innerText = `${full} : Slots Full`;

    const emptySlots = document.createElement('div');
    emptySlots.innerText = `${empty} : Slots Empty`;

    const fullRows = document.createElement('div');
    fullRows.innerText = `${full / (slots * containers)} : Rows Full`;

    const emptyRows = document.createElement('div');
    emptyRows.innerText = `${empty / (slots * containers)} : Rows Empty`;

    display.appendChild(fullSlots);
    display.appendChild(emptySlots);
    display.appendChild(fullRows);
    display.appendChild(emptyRows);
};

function addColumnDataAll(cols) {
    for (let i = 0; i < cols; i++) {
        addColumnData(i);
    }
};

function updateModelDisplay() {
    emptyRowsAll(emptyRows);
    addSlotsColumnsAll(cols);
    addColumnDataAll(cols);
};
updateModelDisplay();

// System Model Settings
const settings = document.body.querySelector('#system-model-settings');
settings.save.addEventListener("click", () => {
    // Update Model Features
    cols = settings.columns.value;
    rows = settings.rows.value;
    containers = settings.containers.value;
    slots = settings.slots.value;

    // Regenerate Model
    storage.innerHTML = '';
    generateStorage();
    updateModelDisplay();

    // Model Display Rescaling
    if (settings.scale.value === "small") {
        document.body.style.setProperty("--scale", ".42vmin");
    } else if (settings.scale.value === "medium") {
        document.body.style.setProperty("--scale", "1.5vmin");
    } else if (settings.scale.value === "large") {
        document.body.style.setProperty("--scale", "3vmin");
    }
});

settings.default.addEventListener("click", () => {
    // Update Model Features
    cols = 2;
    rows = 2;
    containers = 2;
    slots = 2;

    // Regenerate Model
    storage.innerHTML = '';
    generateStorage();
    updateModelDisplay();

    // Model Display Rescaling
    document.body.style.setProperty("--scale", ".42vmin");
});

// resolution slider display
const resolution = document.body.querySelector('#data-resolution');
const resVal = document.body.querySelector('#data-resolution-val');

resVal.textContent = `0${resolution.value}`;

resolution.addEventListener('dblclick', () => {
    resolution.value = 50;
    resVal.textContent = `0${resolution.value}`;
});

resolution.addEventListener('input', () => {
    if (resolution.value.length === 3) {
        resVal.textContent = resolution.value;
    } else if (resolution.value.length === 2) {
        resVal.textContent = `0${resolution.value}`;
    } else {
        resVal.textContent = `00${resolution.value}`;
    }
});