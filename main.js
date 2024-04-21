// The Programic Process
// I.       user interacts with forms in interface to establish defintions of space in spaceDef structure.
// II.      definitions are used to generate spatial models in a separate spatialModels structure.
// III.     Interactions with each model are made possible by getPoint, openPoint and closePoint functions.

// Defintion of Spatial Models
let spaceDef = [];
let lastModelID = -1;
function defineSpatialModel(name, x, y, z, integer, octant) {
    let model = {};
    model.id = lastModelID + 1;
    lastModelID += 1;
    model.instances = 0;
    model.integer = integer;
    model.name = name;
    model.obstruct = [];
    model.x = x;
    model.y = y;
    model.z = z;
    if (x === y && y === z) {
        model.cubic = true;
    } else {
        model.cubic = false;
    }
    model.octant = octant;
    model.volume = x * y * z;
    spaceDef.push(model);
};

defineSpatialModel("space-1", 10, 10, 10, true, true);
defineSpatialModel("space-2", 8, 6, 4, false, false);
defineSpatialModel("space-2", 2, 2, 2, false, false);

// Live Spatial Models
function generateSpace(id) {
    // generate a single instance of a model given its id
    const mod = spaceDef[id];
    let space = [];
    if (mod.integer === false) {

        if (mod.octant === false) {

            // positive coordinate field
            for (let x = 0; x < mod.x; x++) {
                for (let y = 0; y < mod.y; y++) {
                    for (let z = 0; z < mod.z; z++) {
                        // each coordinate point
                        space.push({space: mod.name, coor: [x, y, z], open: true});
                    }
                }
            }

        } else {

            // positive octant coordinate field
            const xMedian = Math.floor(mod.x / 2);
            const yMedian = Math.floor(mod.y / 2);
            const zMedian = Math.floor(mod.z / 2);

            for (let x = 0; x < mod.x; x++) {
                for (let y = 0; y < mod.y; y++) {
                    for (let z = 0; z < mod.z; z++) {
                        // each coordinate point
                        if (x < xMedian && y >= 0 && z < 0) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 1});
                        } else if (x >= xMedian && y >= yMedian && z < zMedian) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 2});
                        } else if (x >= xMedian && y < yMedian && z < zMedian) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 3});
                        } else if (x < xMedian && y < yMedian && z < zMedian) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 4});
                        } else if (x < xMedian && y >= yMedian && z >= zMedian) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 5});
                        } else if (x >= xMedian && y >= yMedian && z >= zMedian) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 6});
                        } else if (x >= xMedian && y < yMedian && z >= zMedian) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 7});
                        } else if (x < xMedian && y < yMedian && z >= zMedian) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 8});
                        }
                    }
                }
            }
        
        }
    } else {
        if (mod.octant === false) {

            // integer coordinate field
            for (let x = -(Math.ceil(mod.x / 2)) + 1; x < Math.floor(mod.x / 2) + 1; x++) {
                for (let y = -(Math.ceil(mod.y / 2)) + 1; y < Math.floor(mod.y / 2) + 1; y++) {
                    for (let z = -(Math.ceil(mod.z / 2)) + 1; z < Math.floor(mod.z / 2) + 1; z++) {
                        // each coordinate point
                        space.push({space: mod.name, coor: [x, y, z], open: true});
                    }
                }
            }

        } else {

            // integer octant coordinate field
            for (let x = -(Math.ceil(mod.x / 2)) + 1; x < Math.floor(mod.x / 2) + 1; x++) {
                for (let y = -(Math.ceil(mod.y / 2)) + 1; y < Math.floor(mod.y / 2) + 1; y++) {
                    for (let z = -(Math.ceil(mod.z / 2)) + 1; z < Math.floor(mod.z / 2) + 1; z++) {
                        // each coordinate point
                        if (x < 0 && y >= 0 && z < 0) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 1});
                        } else if (x >= 0 && y >= 0 && z < 0) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 2});
                        } else if (x >= 0 && y < 0 && z < 0) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 3});
                        } else if (x < 0 && y < 0 && z < 0) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 4});
                        } else if (x < 0 && y >= 0 && z >= 0) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 5});
                        } else if (x >= 0 && y >= 0 && z >= 0) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 6});
                        } else if (x >= 0 && y < 0 && z >= 0) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 7});
                        } else if (x < 0 && y < 0 && z >= 0) {
                            space.push({space: mod.name, coor: [x, y, z], open: true, octant: 8});
                        }
                    }
                }
            }

        }
    }
    mod.instances += 1;
    return {space: space, model: mod.name, modelID: mod.id};
};

function deleteModel(id) {

};

function generateInstancePerModel() {
    // generate single instance of each spatial model defintion
    for (let i = 0; i < spaceDef.length; i++) {
        spaces.push(generateSpace(spaceDef[i].id));
    }
};

let spaces = [];
generateInstancePerModel();
console.log(spaceDef);
console.log(spaces);

// Spatial Model Operations
function getPointIndex(model, coordinate) {
    // validate arguments
    let argValid = false;
    let integerSpace = false;
    // tests if argument for model parameter is within the valid range
    if (model >= 0 && model <= spaces.length - 1) {
        // tests for integer space
        if (spaces[model].integer === false) {
            // tests if argument for coordinate parameter is within valid range for positive space
            if (coordinate[0] >= 0 && coordinate[0] < spaceDef[model].x && coordinate[1] >= 0 && coordinate[1] < spaceDef[model].y && coordinate[2] >= 0 && coordinate[2] < spaceDef[model].z) {
                argValid = true;
            } else {
                console.log(`No such point in ${spaceDef[model].id}!`);
            }
        } else {
            integerSpace = true;
            // tests if argument for coordinate parameter is within valid range for integer space
            if (coordinate[0] >= -(Math.ceil(spaceDef[model].x / 2)) + 1 && coordinate[0] < Math.floor(spaceDef[model].x / 2) + 1 && coordinate[1] >= -(Math.ceil(spaceDef[model].y / 2)) + 1 && coordinate[1] < Math.floor(spaceDef[model].y / 2) + 1 && coordinate[2] >= -(Math.ceil(spaceDef[model].z / 2)) + 1 && coordinate[2] < Math.floor(spaceDef[model].z / 2) + 1) {
                argValid = true;
            } else {
                console.log(`No such point in ${spaceDef[model].id}!`);
            }
        }
    } else {
        // model parameter is outside valid range
        console.log("No such model by that parameter!");
    }

    if (argValid) {
        if (!integerSpace) {
            // positive space single point access
            // variableNameStoringModels[ index of spatial model ][ index of object in that model ];
            return (coordinate[0] * spaceDef[model].y * spaceDef[model].z) + (coordinate[1] * spaceDef[model].z) + coordinate[2];
        } else {
            // integer space single point access
            // coordinate to be found
            const xCoor = coordinate[0];
            // number of changes in model list
            const xRange = spaceDef[model].x;
            // rate of change in model list
            const xRate = spaceDef[model].y * spaceDef[model].z;
            // number of multiples until match
            let xMult = 0;
            // iterate for the number of changes
            for (let i = 0; i < xRange; i++) {
                // access model at rate of change
                if (spaces[model].space[i * xRate].coor[0] === xCoor) {
                    // store number of multiples
                    xMult = i;
                    break;
                }
            }
            // console.log(spaces[model][(xMult * xRate)].coor);
            
            // coordinate to be found
            const yCoor = coordinate[1];
            // number of changes per x iteration
            const yRange = spaceDef[model].y;
            // rate of change in model list
            const yRate = spaceDef[model].z;
            // number of multiples until match
            let yMult = 0;
            // iterate for the number of changes
            for (let i = 0; i < yRange; i++) {
                // access model at rate of change
                if (spaces[model].space[ (xMult * xRate) + (i * yRate) ].coor[1] === yCoor) {
                    // store number of multiples
                    yMult = i;
                    break;
                }
            }
            // console.log(spaces[model].space[(xMult * xRate) + (yMult * yRate)].coor);
            
            // coordinate to be found
            const zCoor = coordinate[2];
            // number of changes per y iteration
            const zRange = spaceDef[model].z;
            // rate of change in model list = 1 and zMult * 1 = zMult so a variable for zRate is unnecessary
            // number of multiples until match
            let zMult = 0;
            // iterate for the number of changes
            for (let i = 0; i < zRange; i++) {
                if (spaces[model].space[ (xMult * xRate) + (yMult * yRate) + i ].coor[2] === zCoor) {
                    zMult = i;
                }
            }
            // console.log(spaces[model].space[ (xMult * xRate) + (yMult * yRate) + (zMult) ].coor);
            return (xMult * xRate) + (yMult * yRate) + (zMult);
        }
    }
};

function readPoint(model, coordinate) {
    return spaces[model].space[getPointIndex(model, coordinate)];
};

function openPoint(model, coordinate) {
    spaces[model].space[getPointIndex(model, coordinate)].open = true;
};

function closePoint(model, coordinate) {
    spaces[model].space[getPointIndex(model, coordinate)].open = false;
};

closePoint(0, [1, 0, -1]);
console.log(readPoint(0, [1, 0, -1]));
// openPoint(1, [1, 0, -1]);
// console.log(readPoint(1, [1, 0, -1]));

let objectDef = [
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

function modelObjects(objectDef) {

};

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
