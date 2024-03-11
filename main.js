let spaces = [
    {
        name: "space-1",
        x: 10,
        y: 10,
        z: 10,
        obstruct : [],
    }
    // {
    //     name: "space_1",
    //     x: 10,
    //     y: 10,
    //     z: 3,
    //     obstruct: [
    //         {
    //             xi: 9,
    //             xf: 10,
    //             yi: 9,
    //             yf: 10,
    //             zi: 1,
    //             zf: 2,
    //         },
    //     ],
    // },
    // {
    //     name: "space_2",
    //     x: 10,
    //     y: 10,
    //     z: 3,
    //     obstruct: [
    //         {
    //             xi: 9,
    //             xf: 10,
    //             yi: 9,
    //             yf: 10,
    //             zi: 1,
    //             zf: 2,
    //         },
    //     ],
    // },
];

let objects = [
    {
        x: 1,
        y: 1,
        z: 1,
        name: "object_1",
        quantity: 2,
    },
    {
        x: 5,
        y: 5,
        z: 5,
        name: "object_2",
        quantity: 1,
    },
];

// Document Object Model selections
const panel = document.body.querySelector('#control-panel');

// Model Parameters
const formModel = panel.querySelector('#model-parameters');

const spaceFormContainer = formModel.querySelector('#space-form-container');
const obstructContainer = formModel.querySelector('#obstructions');

const objectContainer = formModel.querySelector('#object-form-container');





// //////////// ADDDDD OBstructioninoinoinoinoin!!!!




let obstructID = 0;
function addObstruct(spaceFormID) {
    console.log(spaceFormID);
    const form = document.createElement('form');
    form.setAttribute('action', './');
    form.setAttribute('method', 'POST');
    form.setAttribute('name', 'obstruct-form');
    form.setAttribute('class', `obstruct-form`);
    form.setAttribute('id', `obstruct-form-${obstructID}`);
    const formID = `obstruct-form-${obstructID}`;
    
    const formLabel = document.createElement('label');
    formLabel.setAttribute('for', 'obstruct-form');
    formLabel.innerText = "Obstruction ";
    
    const xMax = spaceFormContainer.querySelector(`#space-form-${spaceFormID}`);
    console.log(xMax);
    
    const inputX = document.createElement('input');
    inputX.setAttribute('name', 'inputX');
    inputX.setAttribute('class', 'inputX');
    inputX.setAttribute('type', 'number');
    inputX.setAttribute('placeholder', 'quantity of X dimension');
    inputX.setAttribute('min', '1');
    inputX.setAttribute('max', `${parameters.columns.value}`);
    inputX.style.width = "50px";
    
    const deleteFormButton = document.createElement('button');
    deleteFormButton.setAttribute('type', 'button');
    deleteFormButton.setAttribute('name', "deleteFormButton");
    deleteFormButton.innerText = "remove";
    listenRemoveForm(deleteFormButton, formID);
    
    form.appendChild(formLabel);
    form.appendChild(inputX);
    form.appendChild(deleteFormButton);
    obstructContainer.appendChild(form);

    obstructID += 1;
};

// use at end of function for add space
let spaceFormID = 0;
spaceFormContainer.querySelector(`#space-form-${spaceFormID}`).querySelector('.btn-add-obstruct').addEventListener("click", (spaceFormID) => {addObstruct(spaceFormID)});
spaceFormID += 1;

// Visualization
const formVisual = panel.querySelector('#visualization-parameters');
// Slider Logic
function sliderInitPercent(sliderID, outputID) {
    // select from Document Object Model
    const slider = document.body.querySelector("#"+ sliderID);
    const output = document.body.querySelector("#"+ outputID);
    // display initial value
    const sliderVal = slider.value;
    if (sliderVal.length === 3) {
        output.textContent = `${sliderVal}%`;
    } else if (sliderVal.length === 2) {
        output.textContent = `0${sliderVal}%`;
    } else {
        output.textContent = `00${sliderVal}%`;
    }
    // update on change
    slider.addEventListener('input', () => {
        const sliderVal = slider.value;
        if (sliderVal.length === 3) {
            output.textContent = `${sliderVal}%`;
        } else if (sliderVal.length === 2) {
            output.textContent = `0${sliderVal}%`;
        } else {
            output.textContent = `00${sliderVal}%`;
        }
    });
    // center slider on double click
    slider.addEventListener('dblclick', () => {
        slider.value = 50;
        output.textContent = `0${slider.value}%`;
    })
};

function sliderInitRatio(sliderID, outputID) {
    const divisor = 50;
    // select from Document Object Model
    const slider = document.body.querySelector("#"+ sliderID);
    const output = document.body.querySelector("#"+ outputID);
    // display initial value
    const sliderVal = slider.value;
    const y = parseFloat(sliderVal / divisor).toFixed(2);
    output.textContent = `${y}`;
    // update on change
    slider.addEventListener('input', () => {
        const sliderVal = slider.value;
        const y = parseFloat(sliderVal / divisor).toFixed(2);
        output.textContent = `${y}`;
    });
    // center slider on double click
    slider.addEventListener('dblclick', () => {
        slider.value = divisor;
        const sliderVal = slider.value;
        const y = parseFloat(sliderVal / divisor).toFixed(2);
        output.textContent = `${y}`;
    })
};

sliderInitPercent("graph-resolution", "graph-resolution-val");
sliderInitRatio("playback-multiplier", "playback-multiplier-val");

// Runtime Controls
const formControls = panel.querySelector('#playback-controls');

// OLD STUFF
// // PARAMETERS
// let cols = 2;
// let rows = 2;
// let containers = 2;
// let slots = 2;
// let emptyRows = [];

// // SYSTEM SETUP
// const storage = document.body.querySelector('#storage-content');

// function generateID() {
//     let id = "";
//     for (let i = 0; i < 10; i++) {
//         id += `${Math.floor(Math.random() * 11)}`;
//     }
//     return id;
// };

// function createContainer() {
//     const container = document.createElement('div');
//     container.classList.add("container");
//     for (let i = 0; i < slots; i++) {
//         const slot = document.createElement('div');
//         slot.classList.add("slot");
//         slot.classList.add("slot-empty");
//         slot.setAttribute("id", generateID());
//         slot.innerText = "0";
//         container.appendChild(slot);
//     }
//     return container;
// };

// function createRow() {
//     const row = document.createElement('div');
//     row.classList.add("row");
//     for (let i = 0; i < containers; i++) {
//         const container = createContainer();
//         row.appendChild(container);
//     }
//     return row;
// };

// function createColumn(number) {
//     const container = document.createElement('div');

//     const colNum = document.createElement('h3');
//     colNum.innerText = number;
//     colNum.style.marginBottom = 0;

//     const colData = document.createElement('p');
//     colData.classList.add("col-data");

//     const col = document.createElement('div');
//     col.classList.add("column");

//     container.appendChild(colNum);
//     container.appendChild(colData);
//     container.appendChild(col);

//     return container;
// };

// function generateStorage() {
//     for (let i = 0; i < cols; i++) {
//         const container = createColumn(`Column #${i + 1} `);
//         const col = container.querySelector('div');
//         for (let j = 0; j < rows; j++) {
//             const row = createRow();
//             col.appendChild(row);
//         }
//         storage.appendChild(container);
//     }
// };
// generateStorage();

// // MODEL OPERATION
// function emptyRow(col, row) {
//     try {
//         storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].classList.add("empty-row");
//         storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].querySelectorAll('.container').forEach((r) => {
//             r.style.visibility = "hidden";
//         });
//         for (let i = 0; i < containers; i++) {
//             for (let j = 0; j < slots; j++) {
//                 storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].querySelectorAll('.container')[i].querySelectorAll('.slot')[j].classList.remove("slot-empty");
//             }
//         }
//     } catch (error) {
//         console.log({"operation": "emptyRow", "error": error});
//     }
// };

// function emptyRowsAll(x) {
//     for (let i = 0; i < x.length; i++) {
//         emptyRow(x[i][0], x[i][1]);
//     }
// };

// function addSlots(col, row, container) {
//     try {
//         if (!storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].classList.contains('empty-row')) {
//             const slots = storage.querySelectorAll('.column')[col].querySelectorAll('.row')[row].querySelectorAll('.container')[container].querySelectorAll('.slot');
//             for (let i = 0; i < slots.length; i++) {
//                 slots[i].classList.remove("slot-empty");
//                 slots[i].classList.add("slot-full");
//                 slots[i].innerText = "1";
//             }
//         }
//     } catch (error) {
//         console.log({"operation": "addSlots", "error": error});
//     }
// };

// function addSlotsColumn(col) {
//     for (let i = 0; i < rows; i++) {
//         for (let j = 0; j < containers; j++) {
//             addSlots(col, i, j);
//         }
//     }
// };

// function addSlotsColumnsAll(cols) {
//     for (let i = 0; i < cols; i++) {
//         addSlotsColumn(i);
//     }
// };

// // Data
// function addColumnData(col) {
//     // select display
//     const display = storage.querySelectorAll('.col-data')[col];
//     // get data
//     const full = storage.querySelectorAll('.column')[col].querySelectorAll('.slot-full').length;
//     const empty = storage.querySelectorAll('.column')[col].querySelectorAll('.slot-empty').length;
//     // display data
//     const fullSlots = document.createElement('div');
//     fullSlots.innerText = `${full} : Slots Full`;

//     const emptySlots = document.createElement('div');
//     emptySlots.innerText = `${empty} : Slots Empty`;

//     const fullRows = document.createElement('div');
//     fullRows.innerText = `${full / (slots * containers)} : Rows Full`;

//     const emptyRows = document.createElement('div');
//     emptyRows.innerText = `${empty / (slots * containers)} : Rows Empty`;

//     display.appendChild(fullSlots);
//     display.appendChild(emptySlots);
//     display.appendChild(fullRows);
//     display.appendChild(emptyRows);
// };

// function addColumnDataAll(cols) {
//     for (let i = 0; i < cols; i++) {
//         addColumnData(i);
//     }
// };

// function updateModelDisplay() {
//     // empty
//     emptyRowsAll(emptyRows);
//     // add
//     addSlotsColumnsAll(cols);
//     addColumnDataAll(cols);
// };
// updateModelDisplay();

// // Model Parameters
// const parameters = document.body.querySelector('#system-model-parameters');
// function listenRemoveForm(button, formID) {
//     function removeForm() {
//         const form = document.querySelector(`#${formID}`);
//         form.deleteFormButton.removeEventListener("click", removeForm);
//         form.remove();
//     }
//     button.addEventListener("click", removeForm);
// };
// let emptyColFormID = 0;
// parameters.addEmptyColButton.addEventListener('click', () => {
//     const form = document.createElement('form');
//     form.setAttribute('action', './');
//     form.setAttribute('method', 'POST');
//     form.setAttribute('class', `empty-col-form`);
//     form.setAttribute('id', `empty-col-form-${emptyColFormID}`);
//     const formID = `empty-col-form-${emptyColFormID}`;
    
//     const formLabel = document.createElement('label');
//     formLabel.innerText = "Column ";
    
//     const inputColumn = document.createElement('input');
//     inputColumn.setAttribute('name', 'inputColumn');
//     inputColumn.setAttribute('class', 'input-column');
//     inputColumn.setAttribute('type', 'number');
//     inputColumn.setAttribute('value', '1');
//     inputColumn.setAttribute('min', '1');
//     inputColumn.setAttribute('max', `${parameters.columns.value}`);
//     inputColumn.style.width = "50px";
    
//     const deleteFormButton = document.createElement('button');
//     deleteFormButton.setAttribute('type', 'button');
//     deleteFormButton.setAttribute('name', "deleteFormButton");
//     deleteFormButton.innerText = "remove";
//     listenRemoveForm(deleteFormButton, formID);
    
//     form.appendChild(formLabel);
//     form.appendChild(inputColumn);
//     form.appendChild(deleteFormButton);
//     parameters.querySelector('#empty-col-form-container').appendChild(form);
//     emptyColFormID += 1;
// });
// let emptyRowFormID = 0;
// parameters.addEmptyRowButton.addEventListener('click', () => {
//     const form = document.createElement('form');
//     form.setAttribute('action', './');
//     form.setAttribute('method', 'POST');
//     form.setAttribute('class', `empty-row-form`);
//     form.setAttribute('id', `empty-row-form-${emptyRowFormID}`);
//     const formID = `empty-row-form-${emptyRowFormID}`;
    
//     const formLabel = document.createElement('label');
//     formLabel.innerText = "Column/Row ";
    
//     const inputColumn = document.createElement('input');
//     inputColumn.setAttribute('name', 'inputColumn');
//     inputColumn.setAttribute('class', 'input-column');
//     inputColumn.setAttribute('type', 'number');
//     inputColumn.setAttribute('value', '1');
//     inputColumn.setAttribute('min', '1');
//     inputColumn.setAttribute('max', `${parameters.columns.value}`);
//     inputColumn.style.width = "50px";
    
//     const inputRow = document.createElement('input');
//     inputRow.setAttribute('name', 'inputRow');
//     inputRow.setAttribute('class', 'input-row');
//     inputRow.setAttribute('type', 'number');
//     inputRow.setAttribute('value', '1');
//     inputRow.setAttribute('min', '1');
//     inputRow.setAttribute('max', `${parameters.rows.value}`);
//     inputRow.style.width = "50px";
    
//     const deleteFormButton = document.createElement('button');
//     deleteFormButton.setAttribute('type', 'button');
//     deleteFormButton.setAttribute('name', "deleteFormButton");
//     deleteFormButton.innerText = "remove";
//     listenRemoveForm(deleteFormButton, formID);
    
//     form.appendChild(formLabel);
//     form.appendChild(inputColumn);
//     form.appendChild(inputRow);
//     form.appendChild(deleteFormButton);
//     parameters.querySelector('#empty-row-form-container').appendChild(form);
//     emptyRowFormID += 1;
// });

// // dynamcially update empty row input maximums based on current column and row parameters
// parameters.columns.addEventListener("input", () => {
//     parameters.querySelectorAll('.input-column').forEach((column) => {
//         column.setAttribute('max', `${parameters.columns.value}`);
//         if (Number(column.value) > Number(parameters.columns.value)) {
//             column.value = parameters.columns.value;
//         }
//     })
// });
// parameters.rows.addEventListener("input", () => {
//     parameters.querySelectorAll('.input-row').forEach((row) => {
//         row.setAttribute('max', `${parameters.rows.value}`);
//         if (Number(row.value) > Number(parameters.rows.value)) {
//             row.value = parameters.rows.value;
//         }
//     })
// });

// // parameter form button listeners
// parameters.save.addEventListener("click", () => {
//     // Update Model Parameters
//     cols = parameters.columns.value;
//     rows = parameters.rows.value;
//     containers = parameters.containers.value;
//     slots = parameters.slots.value;

//     // intialize empty structures
//     emptyCols = [];
//     emptyRows = [];
//     emptyContainers = [];
//     emptySlots = [];

//     // reassign to empty structures
//     parameters.querySelectorAll('.empty-col-form').forEach((form) => {
//         emptyCols.push(Number(form.inputColumn.value) - 1);
//     });
//     parameters.querySelectorAll('.empty-row-form').forEach((form) => {
//         emptyRows.push([Number(form.inputColumn.value) - 1, Number(form.inputRow.value) - 1]);
//     });

//     // Regenerate Model
//     storage.innerHTML = '';
//     generateStorage();
//     updateModelDisplay();

//     // Model Display Rescaling
//     if (parameters.scale.value === "small") {
//         document.body.style.setProperty("--scale", ".42vmin");
//     } else if (parameters.scale.value === "medium") {
//         document.body.style.setProperty("--scale", "1.5vmin");
//     } else if (parameters.scale.value === "large") {
//         document.body.style.setProperty("--scale", "3vmin");
//     }
// });

// parameters.default.addEventListener("click", () => {
//     // Update Model Parameters
//     cols = 2;
//     rows = 2;
//     containers = 2;
//     slots = 2;
//     emptyRows = [];
    
//     // Regenerate Model
//     parameters.querySelector('#empty-row-form-container').innerHTML = '';
//     storage.innerHTML = '';
//     generateStorage();
//     updateModelDisplay();

//     // Model Display Rescaling
//     document.body.style.setProperty("--scale", ".42vmin");
// });

// // playback speed slider display
// const playback = document.body.querySelector('#playback-rate');
// const playVal = document.body.querySelector('#playback-rate-val');

// playVal.textContent = `0${playback.value}`;

// playback.addEventListener('dblclick', () => {
//     playback.value = 50;
//     playVal.textContent = `0${playback.value}`;
// });

// playback.addEventListener('input', () => {
//     if (playback.value.length === 3) {
//         playVal.textContent = playback.value;
//     } else if (playback.value.length === 2) {
//         playVal.textContent = `0${playback.value}`;
//     } else {
//         playVal.textContent = `00${playback.value}`;
//     }
// });

// // data resolution slider display
// const resolution = document.body.querySelector('#data-resolution');
// const resVal = document.body.querySelector('#data-resolution-val');

// resVal.textContent = `0${resolution.value}`;

// resolution.addEventListener('dblclick', () => {
//     resolution.value = 50;
//     resVal.textContent = `0${resolution.value}`;
// });

// resolution.addEventListener('input', () => {
//     if (resolution.value.length === 3) {
//         resVal.textContent = resolution.value;
//     } else if (resolution.value.length === 2) {
//         resVal.textContent = `0${resolution.value}`;
//     } else {
//         resVal.textContent = `00${resolution.value}`;
//     }
// });

// // generate graph
// const graph = document.body.querySelector('#graph-model-change-over-time');