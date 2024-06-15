// The Programic Process
// I.       Data within forms in interface is used to establish spatial and object defintions in respective structures.
// II.      Definitions are used to generate model instances with which interactions are possible.
// III.     Interactions with a model represent the model object(s) moving through model space(s).
// IV.      Simulations are procedures for how model objects move through model spaces.

// Programic Organization
// I.   Model
// II.  process
// III. Display

/////////////////// DOM ///////////////////
const panel = document.body.querySelector('#control-panel');
const formModel = panel.querySelector('#model-parameters');
const formControls = panel.querySelector('#playback-controls');
const formVisual = panel.querySelector('#visualization-parameters');
const spaceFormContainer = formModel.querySelector('#space-form-container');
const objectFormContainer = formModel.querySelector('#object-form-container');

// onload buttons
const addSpaceBTN = panel.querySelector('#btn-add-space');
const addObstructBTN = spaceFormContainer.querySelector('.btn-add-obstruct');
const addObjectBTN = panel.querySelector('#btn-add-object');

/////////////////// MODEL ///////////////////
// System of Identification
let spaceIDstructure = [0];
let objectIDstructure = [0];

let modelIDstructure = [0];

let spaceFormIDstructure = [0];
let obstructFormIDstructure = [0];
let objectFormIDstructure = [0];

const characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0" ];

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

function getID(structure) {
    let id = "";
    for (let i = 0; i < structure.length; i++) {
        id += characters[structure[i]];
    }
    return id;
};

// Data Structures
let spaceDef = [];
let objectDef = [];
let models = [];

// Structural Access Functionality
function getSpaceIndex(spaceID) {
    // search for space index by spaceID
    let spaceIndex = undefined;
    for (let i = 0; i < spaceDef.length; i++) {
        if (spaceDef[i].spaceID === spaceID) {
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

function getObjectIndex(objectID) {
    // search for object index by objectID
    let objectIndex = undefined;
    for (let i = 0; i < objectDef.length; i++) {
        if (objectDef[i].objectID === objectID) {
            objectIndex = i;
            break;
        }
    }
    if (objectIndex === undefined) {
        console.log(`No such object by the objectID "${objectID}"!`);
        return objectIndex;
    } else {
        return objectIndex;
    }
};

function getModelIndex(modelID) {
    // search for space index by modelID
    let modelIndex = undefined;
    for (let i = 0; i < models.length; i++) {
        if (models[i].modelID === modelID) {
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

// Defintion of Spaces
function defineSpace(name, x, y, z, integer = false, octant = false, obstruct = []) {
    let def = {};
    def.spaceID = generateID(spaceIDstructure);
    def.instances = 0;
    def.integer = integer;
    def.name = name;
    def.obstruct = obstruct;
    def.x = x;
    def.y = y;
    def.z = z;
    if (x === y && y === z) {
        def.cubic = true;
    } else {
        def.cubic = false;
    }
    def.octant = octant;
    def.volume = x * y * z;
    spaceDef.push(def);
};

function defineSpaces() {
    // run defineSpace for every space form
    spaceFormContainer.querySelectorAll('.space-form').forEach((form) => {
        // get information from form
        const name = form.querySelector('.name-space').value;
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
        // pass info as arguments into defineSpaces function
        defineSpace(name, x, y, z, integer, octant, obstruct);
    });
};

// Defintion of Objects
function defineObject(name, x, y, z, quantity) {
    let mod = {};
    mod.x = x;
    mod.y = y;
    mod.z = z;
    mod.objectName = name;
    mod.objectID = generateID(objectIDstructure);
    mod.quantity = quantity;
    objectDef.push(mod);
};

function defineObjects() {
    objectFormContainer.querySelectorAll('.object-form').forEach((form) => {
        const name = form.querySelector('.name-object').value;
        const x = form.querySelector('.Xdimension').value;
        const y = form.querySelector('.Ydimension').value;
        const z = form.querySelector('.Zdimension').value;
        const quantity = form.querySelector('.quantity').value;
        defineObject(name, x, y, z, quantity);
    });
};

// Model Generation
function generateModel(spaceID) {
    // get model for reference using the spaceID
    const defS = spaceDef[getSpaceIndex(spaceID)];
    // console.log(defS);
    
    // generate a space from the model
    let space = [];
    if (defS.integer === false) {

        if (defS.octant === false) {

            // positive coordinate field
            for (let x = 0; x < defS.x; x++) {
                for (let y = 0; y < defS.y; y++) {
                    for (let z = 0; z < defS.z; z++) {
                        // each coordinate point
                        space.push({coor: [x, y, z], open: true});
                    }
                }
            }

        } else {

            // positive octant coordinate field
            const xMedian = Math.floor(defS.x / 2);
            const yMedian = Math.floor(defS.y / 2);
            const zMedian = Math.floor(defS.z / 2);

            for (let x = 0; x < defS.x; x++) {
                for (let y = 0; y < defS.y; y++) {
                    for (let z = 0; z < defS.z; z++) {
                        // each coordinate point
                        if (x < xMedian && y >= yMedian && z < zMedian) {
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
        if (defS.octant === false) {

            // integer coordinate field
            for (let x = -(Math.ceil(defS.x / 2)) + 1; x < Math.floor(defS.x / 2) + 1; x++) {
                for (let y = -(Math.ceil(defS.y / 2)) + 1; y < Math.floor(defS.y / 2) + 1; y++) {
                    for (let z = -(Math.ceil(defS.z / 2)) + 1; z < Math.floor(defS.z / 2) + 1; z++) {
                        // each coordinate point
                        space.push({coor: [x, y, z], open: true});
                    }
                }
            }

        } else {

            // integer octant coordinate field
            for (let x = -(Math.ceil(defS.x / 2)) + 1; x < Math.floor(defS.x / 2) + 1; x++) {
                for (let y = -(Math.ceil(defS.y / 2)) + 1; y < Math.floor(defS.y / 2) + 1; y++) {
                    for (let z = -(Math.ceil(defS.z / 2)) + 1; z < Math.floor(defS.z / 2) + 1; z++) {
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
    defS.instances += 1;
    models.push({space: space, spaceID: defS.spaceID, modelID: generateID(modelIDstructure), instance: defS.instancecs});
};

function generateModels() {
    // generate single instance of each spatial model defintion
    for (let i = 0; i < spaceDef.length; i++) {
        generateModel(spaceDef[i].spaceID);
    }
};

// Lower-Order Model Operations
function validCoor(spaceID, x, y, z) {
    // tests for whether the coordinate exists in the space at spaceID
    const defS = spaceDef[getSpaceIndex(spaceID)];
    if (defS.integer === false) {
        // non integer space
        if (x >= 0 && x < defS.x && y >= 0 && y < defS.y && z >= 0 && z < defS.z) {
            // if each coordinate value satasfies the range for that dimension in the model
            return true;
        } else {
            console.log(`No such coordinate in ${defS.name}!`);
            return false;
        }
    } else {
        // integer space
        if (x >= -(Math.ceil(defS.x / 2)) + 1 && x < Math.floor(defS.x / 2) + 1 && y >= -(Math.ceil(defS.y / 2)) + 1 && y < Math.floor(defS.y / 2) + 1 && z >= -(Math.ceil(defS.z / 2)) + 1 && z < Math.floor(defS.z / 2) + 1) {
            // if each coordinate value satasfies the range for that dimension in the model
            return true;
        } else {
            console.log(`No such coordinate in ${defS.name}!`);
            return false;
        }
    }
};

function getPointIndex(modelIndex, x, y, z) {
    // get space definition
    const defS = spaceDef[getModelIndex(models[modelIndex].modelID)];
    if (validCoor(defS.spaceID, x, y, z)) {
        if (!defS.integer) {
            // positive/non-integer space single point access
            // variableNameStoringModels[ index of spatial model ][ index of object in that model ];
            return (x * defS.y * defS.z) + (y * defS.z) + z;
        } else {
            // integer space single point access
            // coordinate to be found
            const xCoor = x;
            // number of changes in list
            const xRange = defS.x;
            // rate of change in list
            const xRate = defS.y * defS.z;
            // number of multiples until match
            let xMult = 0;
            // iterate for the number of changes
            for (let i = 0; i < xRange; i++) {
                // access space at rate of change
                if (models[modelIndex].space[i * xRate].coor[0] === xCoor) {
                    // store number of multiples
                    xMult = i;
                    break;
                }
            }
            // console.log(models[modelIndex].space[(xMult * xRate)].coor);
            
            // coordinate to be found
            const yCoor = y;
            // number of changes per x iteration
            const yRange = defS.y;
            // rate of change in model list
            const yRate = defS.z;
            // number of multiples until match
            let yMult = 0;
            // iterate for the number of changes
            for (let i = 0; i < yRange; i++) {
                // access model at rate of change
                if (models[modelIndex].space[ (xMult * xRate) + (i * yRate) ].coor[1] === yCoor) {
                    // store number of multiples
                    yMult = i;
                    break;
                }
            }
            // console.log(models[modelIndex].space[(xMult * xRate) + (yMult * yRate)].coor);
            
            // coordinate to be found
            const zCoor = z;
            // number of changes per y iteration
            const zRange = defS.z;
            // rate of change in model list = 1 and zMult * 1 = zMult so a variable for zRate is unnecessary
            // number of multiples until match
            let zMult = 0;
            // iterate for the number of changes
            for (let i = 0; i < zRange; i++) {
                if (models[modelIndex].space[ (xMult * xRate) + (yMult * yRate) + i ].coor[2] === zCoor) {
                    zMult = i;
                }
            }
            // console.log(models[modelIndex].space[ (xMult * xRate) + (yMult * yRate) + (zMult) ].coor);

            return (xMult * xRate) + (yMult * yRate) + (zMult);
        }
    }
};

function spa(modelID, x, y, z) {
    // single point access
    const modelIndex = getModelIndex(modelID);
    return models[modelIndex].space[getPointIndex(modelIndex, x, y, z)];
};

// Higher-Order Model Operations
function transpose(spaceID, from, to) {
    // tranpose what in where from where to where
    if (validCoor(spaceID, from[0], from[1], from[2]) && validCoor(spaceID, to[0], to[1], to[2])) {
        const i =  getObjectIndex(readPoint(spaceID, from).modelID);
        if (i !== undefined) {
            const object = objectDef[i];

        }
    }
};

/////////////////// PROCESS ///////////////////

defineSpaces();
console.log(spaceDef);

defineObjects();
console.log(objectDef);

generateModels();
console.log(models);

console.log(spa(models[0].modelID, 1, 1, 1));
spa(models[0].modelID, 1, 1, 1).open = false;
console.log(spa(models[0].modelID, 1, 1, 1));


/////////////////// DISPLAY ///////////////////
// form component functions
function removeBTNComponent(text, addClass='') {
    // create
    const removeBTNcontainer = document.createElement('div');
    removeBTNcontainer.setAttribute('class', 'center-flex');

    const removeBTN = document.createElement('button');
    removeBTN.setAttribute('class', `button-style-1 btn-add-obstruct ${addClass}`);
    removeBTN.setAttribute('type', 'button');
    removeBTN.innerText = `${text}`;
    removeBTN.addEventListener("click", (e) => {e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode)});

    // assemble
    removeBTNcontainer.appendChild(removeBTN);
    
    // return
    return removeBTNcontainer;
};

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

function dimensionsComponent(type) {
    if (type === "space") {
        // Dimensions component for space forms
        const dimensions = document.createElement('div');
        dimensions.setAttribute('class', 'form-layout-block');
        
        const labelName = document.createElement('label');
        labelName.setAttribute('for', `name-space-${getID(spaceFormIDstructure)}`);
        labelName.innerText = `Name`;
    
        const name = document.createElement('input');
        name.setAttribute('name', `name-space-${getID(spaceFormIDstructure)}`);
        name.setAttribute('type', 'text');
        name.setAttribute('min', '1');
        name.setAttribute('max', '10');
        name.setAttribute('placeholder', 'Name of space');
        name.setAttribute('required', true);
    
        const labelX = document.createElement('label');
        labelX.setAttribute('for', 'Xdimension');
        labelX.innerText = 'X dimension';
    
        const x = document.createElement('input');
        x.setAttribute('name', 'Xdimension');
        x.setAttribute('class', 'Xdimension');
        x.setAttribute('type', 'number');
        x.setAttribute('min', '2');
        x.setAttribute('placeholder', 'points of X dimension');
        x.setAttribute('required', true);
    
        const labelY = document.createElement('label');
        labelY.setAttribute('for', 'Ydimension');
        labelY.innerText = 'Y dimension';
    
        const y = document.createElement('input');
        y.setAttribute('name', 'Ydimension');
        y.setAttribute('class', 'Ydimension');
        y.setAttribute('type', 'number');
        y.setAttribute('min', '2');
        y.setAttribute('placeholder', 'points of Y dimension');
        y.setAttribute('required', true);
    
        const labelZ = document.createElement('label');
        labelZ.setAttribute('for', 'Ydimension');
        labelZ.innerText = 'Z dimension';
    
        const z = document.createElement('input');
        z.setAttribute('name', 'Zdimension');
        z.setAttribute('class', 'Zdimension');
        z.setAttribute('type', 'number');
        z.setAttribute('min', '2');
        z.setAttribute('placeholder', 'points of Z dimension');
        z.setAttribute('required', true);
    
        // assemble dimensions component
        dimensions.appendChild(labelName);
        dimensions.appendChild(name);
        dimensions.appendChild(labelX);
        dimensions.appendChild(x);
        dimensions.appendChild(labelY);
        dimensions.appendChild(y);
        dimensions.appendChild(labelZ);
        dimensions.appendChild(z);
    
        return dimensions;

    } else if (type === "object") {
        // Dimensions component for object forms
        const dimensions = document.createElement('div');
        dimensions.setAttribute('class', 'form-layout-block');
        
        const labelName = document.createElement('label');
        labelName.setAttribute('for', `name-object-${getID(objectFormIDstructure)}`);
        labelName.innerText = `Name`;
    
        const name = document.createElement('input');
        name.setAttribute('name', `name-object-${getID(objectFormIDstructure)}`);
        name.setAttribute('type', 'text');
        name.setAttribute('min', '1');
        name.setAttribute('placeholder', 'Name of object');
        name.setAttribute('required', true);
    
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
        dimensions.appendChild(name);
        dimensions.appendChild(labelX);
        dimensions.appendChild(x);
        dimensions.appendChild(labelY);
        dimensions.appendChild(y);
        dimensions.appendChild(labelZ);
        dimensions.appendChild(z);
    
        return dimensions;
    }
};

// form functions
function addObstructForm(e) {
    // build a new obstruction
    const obstruct = document.createElement('div');
    obstruct.setAttribute('class', 'obstruction form-layout-block outline');
    obstruct.setAttribute('id', `obstruct-${generateID(obstructFormIDstructure)}`);
    
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
    
    // assemble components
    obstruct.appendChild(labelX);
    obstruct.appendChild(x);
    obstruct.appendChild(labelY);
    obstruct.appendChild(y);
    obstruct.appendChild(labelZ);
    obstruct.appendChild(z);
    obstruct.appendChild(removeBTNComponent('remove', 'removeBTN-layout'));

    // append built obstruction to the space form containing the selected button
    e.target.parentNode.parentNode.querySelector('.obstructions').appendChild(obstruct);
};

function addSpaceForm() {
    // build new space form
    generateID(spaceFormIDstructure);

    const form = document.createElement('div');
    form.setAttribute('class', 'space-form content-highlight2');
    form.setAttribute('id', `space-form-${getID(spaceFormIDstructure)}`);

    // create components

    // integer component
    const integer = document.createElement('fieldset');
    integer.setAttribute('class', 'center-flex');

    const integerLegend = document.createElement('legend');
    integerLegend.innerText = 'Select number kind';

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
    integer.appendChild(labelInt);
    integer.appendChild(optionInt);
    integer.appendChild(optionPos);
    integer.appendChild(labelPos);
    
    // octant component
    const octant = document.createElement('fieldset');
    octant.setAttribute('class', 'center-flex');

    const octantLegend = document.createElement('legend');
    octantLegend.innerText = 'Section into octants';

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
    octant.appendChild(labelTrue);
    octant.appendChild(optionTrue);
    octant.appendChild(optionFalse);
    octant.appendChild(labelFalse);

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

    // assemble components into form
    form.appendChild(titleComponent(`Space ${getID(spaceFormIDstructure)}`));
    form.appendChild(addBreak());
    form.appendChild(dimensionsComponent("space"));
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
    form.appendChild(removeBTNComponent('delete space'));

    // append to space form container
    spaceFormContainer.appendChild(form);
};

function addObjectForm() {
    // build new object form
    generateID(objectFormIDstructure);
    
    const form = document.createElement('div');
    form.setAttribute('class', 'object-form content-highlight2');
    form.setAttribute('id', `object-form-${getID(objectFormIDstructure)}`);

    // create components
    // quantity component
    const quantity = document.createElement('div');
    quantity.setAttribute('class', 'form-layout-block');

    const labelQuant = document.createElement('label');
    labelQuant.setAttribute('for', 'quantity');
    labelQuant.innerText = 'Quantity';

    const inputQuant = document.createElement('input');
    inputQuant.setAttribute('name', 'quanitity');
    inputQuant.setAttribute('type', 'number');
    inputQuant.setAttribute('min', '1');
    inputQuant.setAttribute('placeholder', 'Quantity of object');
    inputQuant.setAttribute('required', true);

    // assemble quanitity component
    quantity.appendChild(labelQuant);
    quantity.appendChild(inputQuant);

    // assemble components
    form.appendChild(titleComponent(`Object ${getID(objectFormIDstructure)}`));
    form.appendChild(addBreak());
    form.appendChild(dimensionsComponent("object"));
    form.appendChild(quantity);
    form.appendChild(addBreak());
    form.appendChild(removeBTNComponent('delete object'));

    // append to object form container
    objectFormContainer.appendChild(form);
};

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

// attach listeners to onload buttons
addObstructBTN.addEventListener("click", (e) => {addObstructForm(e)});
addSpaceBTN.addEventListener('click', addSpaceForm);
addObjectBTN.addEventListener('click', addObjectForm);