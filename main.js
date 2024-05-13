// The Programic Process
// I.       user interacts with forms in interface to establish defintions of space in spaceDef structure.
// II.      definitions are used to generate spatial models in a separate spatialModels structure.
// III.     Interactions with each model are made possible by getPoint, openPoint and closePoint functions.

// Organizaztional Note: Each section is titled, and under under each title is a subsection for resources and below that a subsection for the process that uses those resources.

// System of Identification
let modelIDstructure = [0];
let spaceIDstructure = [0];
let objectIDstructure = [0];
// 27 letters + 10 numbers = 37 total number of characters
const characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
function generateID(structure) {
    // algorithm uses relevant data structures to generate unique ID string with theoretically infinite variations
    // compile ID string using current state of index structure
    let id = '';
    for (let i = 0; i < structure.length; i++) {
        // next character id string
        id += characters[structure[i]];
    }
    // update state of index structure for next ID
    for (let i = 0; i < structure.length; i++) {
        // update index structure for next id
        if (structure[i] < characters.length - 1) {
            // set to next character to complete update
            structure[i] = structure[i] + 1;
            break;
        } else if (i === structure.length - 1) {
            // if at last character in characters and last iteration of string
            // reset to all values to zero
            for (let i = 0; i < structure.length; i++) {structure[i] = 0};
            // add another character to string
            structure.push(0);
            break;
        } else {
            // set to first character and iterate to next
            structure[i] = 0;
        }
    }
    
    return id;
};

// Defintion of Spatial Models
// resources
let spaceDef = [];

function defineSpatialModel(name, x, y, z, integer = false, octant = false) {
    let model = {};
    model.modelID = generateID(modelIDstructure);
    model.instances = 0;
    model.integer = integer;
    model.modelName = name;
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

function getModelIndex(modelID) {
    // search for model index by modelID
    let modelIndex = undefined;
    for (let i = 0; i < spaceDef.length; i++) {
        if (spaceDef[i].modelID === modelID) {
            modelIndex = i;
            break;
        }
    }
    if (modelIndex === undefined) {
        return console.log(`No such model by the modelID "${modelID}"!`);
    } else {
        return modelIndex;
    }
};

function validCoor(modelID, x, y, z) {
    const model = spaceDef[getModelIndex(modelID)];
    if (model.integer === false) {
        // non integer space
        if (x >= 0 && x < model.x && y >= 0 && y < model.y && z >= 0 && z < model.z) {
            // if each coordinate value satasfies the range for that dimension in the model
            return true;
        } else {
            console.log(`No such coordinate in ${model.modelName}!`);
            return false;
        }
    } else {
        // integer space
        if (x >= -(Math.ceil(model.x / 2)) + 1 && x < Math.floor(model.x / 2) + 1 && y >= -(Math.ceil(model.y / 2)) + 1 && y < Math.floor(model.y / 2) + 1 && z >= -(Math.ceil(model.z / 2)) + 1 && z < Math.floor(model.z / 2) + 1) {
            // if each coordinate value satasfies the range for that dimension in the model
            return true;
        } else {
            console.log(`No such coordinate in ${model.modelName}!`);
            return false;
        }
    }
};

function addObstruct(modelID, x, y, z) {
    if (validCoor(modelID, x, y, z)) {
        const obstruction = [x, y, z];
        spaceDef[getModelIndex(modelID)].obstruct.push(obstruction);
    }
};

// process
defineSpatialModel("space-1", 10, 10, 10, true, true);
defineSpatialModel("space-2", 8, 6, 4);

// Live Spaces
// resources
let spaces = [];

function generateSpace(modelID) {
    // get model for reference using the modelID
    const mod = spaceDef[getModelIndex(modelID)];
    // generate a space from the model
    let space = [];
    if (mod.integer === false) {

        if (mod.octant === false) {

            // positive coordinate field
            for (let x = 0; x < mod.x; x++) {
                for (let y = 0; y < mod.y; y++) {
                    for (let z = 0; z < mod.z; z++) {
                        // each coordinate point
                        space.push({coor: [x, y, z], open: true});
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
                            space.push({coor: [x, y, z], open: true, octant: 1});
                        } else if (x >= xMedian && y >= yMedian && z < zMedian) {
                            space.push({coor: [x, y, z], open: true, octant: 2});
                        } else if (x >= xMedian && y < yMedian && z < zMedian) {
                            space.push({coor: [x, y, z], open: true, octant: 3});
                        } else if (x < xMedian && y < yMedian && z < zMedian) {
                            space.push({coor: [x, y, z], open: true, octant: 4});
                        } else if (x < xMedian && y >= yMedian && z >= zMedian) {
                            space.push({coor: [x, y, z], open: true, octant: 5});
                        } else if (x >= xMedian && y >= yMedian && z >= zMedian) {
                            space.push({coor: [x, y, z], open: true, octant: 6});
                        } else if (x >= xMedian && y < yMedian && z >= zMedian) {
                            space.push({coor: [x, y, z], open: true, octant: 7});
                        } else if (x < xMedian && y < yMedian && z >= zMedian) {
                            space.push({coor: [x, y, z], open: true, octant: 8});
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
                        space.push({coor: [x, y, z], open: true});
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
                            space.push({coor: [x, y, z], open: true, octant: 1});
                        } else if (x >= 0 && y >= 0 && z < 0) {
                            space.push({coor: [x, y, z], open: true, octant: 2});
                        } else if (x >= 0 && y < 0 && z < 0) {
                            space.push({coor: [x, y, z], open: true, octant: 3});
                        } else if (x < 0 && y < 0 && z < 0) {
                            space.push({coor: [x, y, z], open: true, octant: 4});
                        } else if (x < 0 && y >= 0 && z >= 0) {
                            space.push({coor: [x, y, z], open: true, octant: 5});
                        } else if (x >= 0 && y >= 0 && z >= 0) {
                            space.push({coor: [x, y, z], open: true, octant: 6});
                        } else if (x >= 0 && y < 0 && z >= 0) {
                            space.push({coor: [x, y, z], open: true, octant: 7});
                        } else if (x < 0 && y < 0 && z >= 0) {
                            space.push({coor: [x, y, z], open: true, octant: 8});
                        }
                    }
                }
            }

        }
    }
    mod.instances += 1;
    spaces.push({space: space, modelID: mod.modelID, spaceID: generateID(spaceIDstructure)});
};

function generateSpacePerModel() {
    // generate single instance of each spatial model defintion
    for (let i = 0; i < spaceDef.length; i++) {
        generateSpace(spaceDef[i].modelID);
    }
};

function getSpaceIndex(spaceID) {
    // search for space index by modelID
    let spaceIndex = undefined;
    for (let i = 0; i < spaceDef.length; i++) {
        if (spaces[i].spaceID === spaceID) {
            spaceIndex = i;
            break;
        }
    }
    if (spaceIndex === undefined) {
        return console.log(`No such space by the spaceID "${spaceID}"!`);
    } else {
        return spaceIndex;
    }
};

// process
generateSpacePerModel();
generateSpace(spaceDef[0].modelID);
console.log(spaceDef);
console.log(spaces);

// Spatial Model Operations
// resources
function getPointIndex(spaceID, spaceIndex = getSpaceIndex(spaceID), coordinate) {
    const model = spaceDef[getModelIndex(spaces[spaceIndex].modelID)];
    if (validCoor(model.modelID, coordinate[0], coordinate[1], coordinate[2])) {
        if (!model.integer) {
            // positive/non-integer space single point access
            // variableNameStoringModels[ index of spatial model ][ index of object in that model ];
            return (coordinate[0] * model.y * model.z) + (coordinate[1] * model.z) + coordinate[2];
        } else {
            // integer space single point access
            // coordinate to be found
            const xCoor = coordinate[0];
            // number of changes in list
            const xRange = model.x;
            // rate of change in list
            const xRate = model.y * model.z;
            // number of multiples until match
            let xMult = 0;
            // iterate for the number of changes
            for (let i = 0; i < xRange; i++) {
                // access model at rate of change
                if (spaces[spaceIndex].space[i * xRate].coor[0] === xCoor) {
                    // store number of multiples
                    xMult = i;
                    break;
                }
            }
            // console.log(spaces[spaceIndex].space[(xMult * xRate)].coor);
            
            // coordinate to be found
            const yCoor = coordinate[1];
            // number of changes per x iteration
            const yRange = model.y;
            // rate of change in model list
            const yRate = model.z;
            // number of multiples until match
            let yMult = 0;
            // iterate for the number of changes
            for (let i = 0; i < yRange; i++) {
                // access model at rate of change
                if (spaces[spaceIndex].space[ (xMult * xRate) + (i * yRate) ].coor[1] === yCoor) {
                    // store number of multiples
                    yMult = i;
                    break;
                }
            }
            // console.log(spaces[spaceIndex].space[(xMult * xRate) + (yMult * yRate)].coor);
            
            // coordinate to be found
            const zCoor = coordinate[2];
            // number of changes per y iteration
            const zRange = model.z;
            // rate of change in model list = 1 and zMult * 1 = zMult so a variable for zRate is unnecessary
            // number of multiples until match
            let zMult = 0;
            // iterate for the number of changes
            for (let i = 0; i < zRange; i++) {
                if (spaces[spaceIndex].space[ (xMult * xRate) + (yMult * yRate) + i ].coor[2] === zCoor) {
                    zMult = i;
                }
            }
            // console.log(spaces[spaceIndex].space[ (xMult * xRate) + (yMult * yRate) + (zMult) ].coor);

            return (xMult * xRate) + (yMult * yRate) + (zMult);
        }
    }
};

function readPoint(spaceID, coordinate) {
    // single point access
    const spaceIndex = getSpaceIndex(spaceID);
    return spaces[spaceIndex].space[getPointIndex(spaceID, spaceIndex, coordinate)];
};

function openPoint(spaceID, coordinate) {
    let spaceIndex;
    for (let i = 0; i < spaces.length; i++) {
        if (spaces[i].spaceID === spaceID) {
            spaceIndex = i;
            break;
        }
    }
    spaces[spaceIndex].space[getPointIndex(spaceID, spaceIndex, coordinate)].open = true;
};

function closePoint(spaceID, coordinate) {
    let spaceIndex;
    for (let i = 0; i < spaces.length; i++) {
        if (spaces[i].spaceID === spaceID) {
            spaceIndex = i;
            break;
        }
    }
    spaces[spaceIndex].space[getPointIndex(spaceID, spaceIndex, coordinate)].open = false;
};

// procecss
closePoint("a", [1, 2, -3]);
console.log(readPoint("a", [1, 2, -3]));
openPoint("a", [1, 2, -3]);
console.log(readPoint("a", [1, 2, -3]));

// Defintion of object models
// resources
let objectDef = [];

function defineObjectModel(name, x, y, z, quantity) {
    let mod = {};
    mod.x = x;
    mod.y = y;
    mod.z = z;
    mod.objectName = name;
    mod.quantity = quantity;
    objectDef.push(mod);
};

// process
defineObjectModel("object-1", 1, 1, 1, 2);
defineObjectModel("object-2", 5, 5, 5, 1);
console.log(objectDef);

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
