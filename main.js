// The Programic Process
// I.       user interacts with forms in interface to establish defintions of space in spaceDef structure.
// II.      definitions are used to generate spatial models in a separate spatialModels structure.
// III.     Interactions with each model are made possible by getPoint, openPoint and closePoint functions.

/////////////////// DOM ///////////////////
const panel = document.body.querySelector('#control-panel');
const formModel = panel.querySelector('#model-parameters');
const spaceFormContainer = formModel.querySelector('#space-form-container');
const objectContainer = formModel.querySelector('#object-form-container');
const formControls = panel.querySelector('#playback-controls');
const addSpaceBTN = document.body.querySelector('#btn-add-space');

/////////////////// MODEL ///////////////////
// System of Identification
let modelIDstructure = [0];
let obstructIDstructure = [0];
let spaceIDstructure = [0];
let objectIDstructure = [0];
let spaceFormIDstructure = [1];

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

function getIDfromStructure(structure) {
    let id = "";
    for (let i = 0; i < structure.length; i++) {
        id += characters[structure[i]];
    }
    return id;
};

// Defintion of Spatial Models
let spaceDef = [];

function defineSpatialModel(name, x, y, z, integer = false, octant = false, obstruct) {
    let model = {};
    model.modelID = generateID(modelIDstructure);
    model.instances = 0;
    model.integer = integer;
    model.modelName = name;
    model.obstruct = obstruct;
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

// defineSpatialModel("space-1", 10, 10, 10, true, true, []);
// defineSpatialModel("space-2", 8, 6, 4, []);

function generateSpatialModels() {
    // run defineSpatialModel for every space form
    spaceFormContainer.querySelectorAll('.space-form').forEach((form) => {
        // get information from form
        const name = form.querySelector('.nameSpace').value;
        const x = form.querySelector('.Xdimension').value;
        const y = form.querySelector('.Ydimension').value;
        const z = form.querySelector('.Zdimension').value;
        let integer;
        form.querySelectorAll('.integer').forEach((option) => {
            if (option.checked === true) {
                if (option.value === "true") {
                    integer = true;
                } else {
                    integer = false;
                }
            }
        });
        let octant;
        form.querySelectorAll('.octant').forEach((option) => {
            if (option.checked === true) {
                if (option.value === "true") {
                    octant = true;
                } else {
                    octant = false;
                }
            }
        });
        // obstructions
        let obstruct = [];
        form.querySelectorAll('.obstruction').forEach((o) => {
            const x = o.querySelector('.Xdimension').value;
            const y = o.querySelector('.Ydimension').value;
            const z = o.querySelector('.Zdimension').value;
            obstruct.push([x, y, z]);
        });
        // pass info as arguments into defineSpatialModels function
        defineSpatialModel(name, x, y, z, integer, octant, obstruct);
    });
};
generateSpatialModels();

// Live Spaces
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

// generateSpace(spaceDef[0].modelID);
generateSpacePerModel();
console.log(spaceDef);
console.log(spaces);

// Spatial Model Operations
function getPointIndex(spaceID, coordinate, spaceIndex = getSpaceIndex(spaceID)) {
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
    return spaces[spaceIndex].space[getPointIndex(spaceID, coordinate, spaceIndex)];
};

function openPoint(spaceID, coordinate) {
    const spaceIndex = getSpaceIndex(spaceID);
    spaces[spaceIndex].space[getPointIndex(spaceID, coordinate, spaceIndex)].open = true;
};

function closePoint(spaceID, coordinate) {
    const spaceIndex = getSpaceIndex(spaceID);
    spaces[spaceIndex].space[getPointIndex(spaceID, coordinate, spaceIndex)].open = false;
};

// closePoint("a", [1, 2, -3]);
// console.log(readPoint("a", [1, 2, -3]));
// openPoint("a", [1, 2, -3]);
// console.log(readPoint("a", [1, 2, -3]));

// Defintion of object models
let objectDef = [];

function defineObjectModel(name, x, y, z, quantity) {
    let mod = {};
    mod.x = x;
    mod.y = y;
    mod.z = z;
    mod.objectName = name;
    mod.objectID = generateID(objectIDstructure);
    mod.quantity = quantity;
    objectDef.push(mod);
};

// defineObjectModel("object-1", 1, 1, 1, 2);
// defineObjectModel("object-2", 2, 5, 3, 1);
// console.log(objectDef);

/////////////////// DISPLAY ///////////////////
function removeForm(e) {
    e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
};

function addObstructForm(e) {
    // build a new obstruction
    const obstruct = document.createElement('div');
    obstruct.setAttribute('class', 'obstruction form-layout-block');
    obstruct.setAttribute('id', `obstruct-${generateID(obstructIDstructure)}`);
    
    // create components
    const labelX = document.createElement('label');
    labelX.setAttribute('for', 'Xdimension');
    labelX.innerText = "X dimension";

    const x = document.createElement('input');
    x.setAttribute('name', 'Xdimension');
    x.setAttribute('class', 'Xdimension');
    x.setAttribute('type', 'number');
    x.setAttribute('min', '1');
    x.setAttribute('placeholder', "Quantity of X dimension");
    x.setAttribute('required', true);

    const labelY = document.createElement('label');
    labelY.setAttribute('for', 'Ydimension');
    labelY.innerText = "Y dimension";

    const y = document.createElement('input');
    y.setAttribute('name', 'Ydimension');
    y.setAttribute('class', 'Ydimension');
    y.setAttribute('type', 'number');
    y.setAttribute('min', '1');
    y.setAttribute('placeholder', "Quantity of Y dimension");
    y.setAttribute('required', true);

    const labelZ = document.createElement('label');
    labelZ.setAttribute('for', 'Zdimension');
    labelZ.innerText = "Z dimension";

    const z = document.createElement('input');
    z.setAttribute('name', 'Zdimension');
    z.setAttribute('class', 'Zdimension');
    z.setAttribute('type', 'number');
    z.setAttribute('min', '1');
    z.setAttribute('placeholder', "Quantity of Z dimension");
    z.setAttribute('required', true);

    const container = document.createElement('div');
    container.setAttribute('class', 'center-flex');

    const removeBTN = document.createElement('button');
    removeBTN.setAttribute('class', 'button-style-1 removeBTN-layout');
    removeBTN.setAttribute('type', 'button');
    removeBTN.innerText = "remove";
    removeBTN.addEventListener('click', (e) => removeForm(e));
    
    // assemble components
    obstruct.appendChild(labelX);
    obstruct.appendChild(x);
    obstruct.appendChild(labelY);
    obstruct.appendChild(y);
    obstruct.appendChild(labelZ);
    obstruct.appendChild(z);
    container.appendChild(removeBTN);
    obstruct.appendChild(container);

    // append built obstruction to the space form containing the selected button
    e.target.parentNode.parentNode.querySelector('.obstructions').appendChild(obstruct);
};

function addSpaceForm() {
    // build new space form
    const form = document.createElement('div');
    form.setAttribute('class', 'space-form content-highlight2');

    // component functions
    function addBreak() {
        return document.createElement('br');
    };

    function titleComponent(text) {
        // title component
        const title = document.createElement('div');
        title.setAttribute('class', 'center-flex');

        const titleDiv = document.createElement('div');

        const titleText = document.createElement('u');
        titleText.innerText = `${text}`;
        
        // assemble title component
        titleDiv.appendChild(titleText);
        title.appendChild(titleDiv);

        return title;
    };

    // create components
    // dimensions component
    const dimensions = document.createElement('div');
    dimensions.setAttribute('class', 'form-layout-block');

    const labelName = document.createElement('label');
    labelName.setAttribute('for', 'nameSpace');
    labelName.innerText = 'Name';

    const nameSpace = document.createElement('input');
    nameSpace.setAttribute('name', 'nameSpace');
    nameSpace.setAttribute('class', 'nameSpace');
    nameSpace.setAttribute('type', 'text');
    nameSpace.setAttribute('min', '1');
    nameSpace.setAttribute('placeholder', 'Name of space');
    nameSpace.setAttribute('required', true);

    const labelX = document.createElement('label');
    labelX.setAttribute('for', 'Xdimension');
    labelX.innerText = 'X dimension';

    const x = document.createElement('input');
    x.setAttribute('name', 'Xdimension');
    x.setAttribute('class', 'Xdimension');
    x.setAttribute('type', 'number');
    x.setAttribute('min', '1');
    x.setAttribute('placeholder', 'points of X dimension');
    x.setAttribute('required', true);

    const labelY = document.createElement('label');
    labelY.setAttribute('for', 'Ydimension');
    labelY.innerText = 'Y dimension';

    const y = document.createElement('input');
    y.setAttribute('name', 'Ydimension');
    y.setAttribute('class', 'Ydimension');
    y.setAttribute('type', 'number');
    y.setAttribute('min', '1');
    y.setAttribute('placeholder', 'points of Y dimension');
    y.setAttribute('required', true);

    const labelZ = document.createElement('label');
    labelZ.setAttribute('for', 'Ydimension');
    labelZ.innerText = 'Z dimension';

    const z = document.createElement('input');
    z.setAttribute('name', 'Zdimension');
    z.setAttribute('class', 'Zdimension');
    z.setAttribute('type', 'number');
    z.setAttribute('min', '1');
    z.setAttribute('placeholder', 'points of Z dimension');
    z.setAttribute('required', true);

    // assemble dimensions component
    dimensions.appendChild(labelName);
    dimensions.appendChild(nameSpace);
    dimensions.appendChild(labelX);
    dimensions.appendChild(x);
    dimensions.appendChild(labelY);
    dimensions.appendChild(y);
    dimensions.appendChild(labelZ);
    dimensions.appendChild(z);

    // integer component
    const integer = document.createElement('fieldset');
    integer.setAttribute('class', 'center-flex');

    const integerLegend = document.createElement('legend');
    integerLegend.innerText = 'Select number kind';

    const integerOptions = document.createElement('div');

    const labelInt = document.createElement('label');
    labelInt.innerText = 'Integer';

    const optionInt = document.createElement('input');
    optionInt.setAttribute('type', 'radio');
    optionInt.setAttribute('name', 'integer');
    optionInt.setAttribute('class', 'integer cursor-pointer');
    optionInt.setAttribute('value', 'true');
    optionInt.setAttribute('required', true);
    
    const labelPos = document.createElement('label');
    labelPos.innerText = 'Positive';

    const optionPos = document.createElement('input');
    optionPos.setAttribute('type', 'radio');
    optionPos.setAttribute('name', 'integer');
    optionPos.setAttribute('class', 'integer cursor-pointer');
    optionPos.setAttribute('value', 'false');
    optionPos.setAttribute('required', true);

    // integer component assemble
    integer.appendChild(integerLegend);
    integerOptions.appendChild(labelInt);
    integerOptions.appendChild(optionInt);
    integerOptions.appendChild(optionPos);
    integerOptions.appendChild(labelPos);
    integer.appendChild(integerOptions);
    
    // octant component
    const octant = document.createElement('fieldset');
    octant.setAttribute('class', 'center-flex');

    const octantLegend = document.createElement('legend');
    octantLegend.innerText = 'Section into octants';

    const octantOptions = document.createElement('div');

    const labelTrue = document.createElement('label');
    labelTrue.innerText = 'True';

    const optionTrue = document.createElement('input');
    optionTrue.setAttribute('type', 'radio');
    optionTrue.setAttribute('name', 'octant');
    optionTrue.setAttribute('class', 'octant cursor-pointer');
    optionTrue.setAttribute('value', 'true');
    optionTrue.setAttribute('required', true);
    
    const labelFalse = document.createElement('label');
    labelFalse.innerText = 'False';

    const optionFalse = document.createElement('input');
    optionFalse.setAttribute('type', 'radio');
    optionFalse.setAttribute('name', 'octant');
    optionFalse.setAttribute('class', 'octant cursor-pointer');
    optionFalse.setAttribute('value', 'false');
    optionFalse.setAttribute('required', true);

    // assemble octant component
    octant.appendChild(octantLegend);
    octantOptions.appendChild(labelTrue);
    octantOptions.appendChild(optionTrue);
    octantOptions.appendChild(optionFalse);
    octantOptions.appendChild(labelFalse);
    octant.appendChild(octantOptions);

    // Obstructions component
    const obstructions = document.createElement('div');
    obstructions.setAttribute('class', 'obstructions form-layout-block-spaced center-flex');

    // addObstruct button component
    const ObstructBTNcontainer = document.createElement('div');
    ObstructBTNcontainer.setAttribute('class', 'center-flex');

    const obstructBTN = document.createElement('button');
    obstructBTN.setAttribute('class', 'button-style-1 btn-add-obstruct');
    obstructBTN.setAttribute('type', 'button');
    obstructBTN.innerText = 'add obstruction';
    obstructBTN.addEventListener("click", (e) => {addObstructForm(e)});

    // assemble addObstruct button component
    ObstructBTNcontainer.appendChild(obstructBTN);

    // remove button component
    const deleteSpaceBTNcontainer = document.createElement('div');
    deleteSpaceBTNcontainer.setAttribute('class', 'center-flex');

    const removeBTN = document.createElement('button');
    removeBTN.setAttribute('class', 'button-style-1 removeBTN-layout');
    removeBTN.setAttribute('type', 'button');
    removeBTN.innerText = "delete space";
    removeBTN.addEventListener('click', (e) => removeForm(e));

    // assemble delete space button component
    deleteSpaceBTNcontainer.appendChild(removeBTN);

    // assemble components into form
    form.appendChild(titleComponent(`Space ${generateID(spaceFormIDstructure)}`));
    form.appendChild(addBreak());
    form.appendChild(dimensions);
    form.appendChild(addBreak());
    form.appendChild(integer);
    form.appendChild(addBreak());
    form.appendChild(octant);
    form.appendChild(addBreak());
    form.appendChild(titleComponent('Obstructions'));
    form.appendChild(addBreak());
    form.appendChild(obstructions);
    form.appendChild(addBreak());
    form.appendChild(ObstructBTNcontainer);
    form.appendChild(addBreak());
    form.appendChild(deleteSpaceBTNcontainer);

    // append to space form container
    spaceFormContainer.appendChild(form);
};

// attach listener on call of addSpaceForm
spaceFormContainer.querySelectorAll('.btn-add-obstruct').forEach((btn) => {
    btn.addEventListener("click", (e) => {addObstructForm(e)});
});


addSpaceBTN.addEventListener('click', addSpaceForm);


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

