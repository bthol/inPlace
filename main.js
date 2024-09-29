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

/////////////////// OPERATIONS ///////////////////
function round(x) {
    if (x % 1 < 0.5) {
        return Math.floor(x); // round down
    } else {
        return Math.ceil(x); // round up
    }
};

/////////////////// MODEL ///////////////////
// System of Identification
let spaceDefIDstructure = [0]; // spaceDefID
let objectDefIDstructure = [0]; // objectDefID

let objectIDstructure = [0]; // objectID
let modelIDstructure = [0]; // modelID

// unique form id and info 
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
let objectQueue = [];
let models = [];

// Structural Access Functionality
function getSpaceDefIndex(spaceDefID) {
    // search for space index by spaceDefID
    let spaceIndex = undefined;
    for (let i = 0; i < spaceDef.length; i++) {
        if (spaceDef[i].spaceDefID === spaceDefID) {
            spaceIndex = i;
            break;
        }
    }
    if (spaceIndex === undefined) {
        return console.log(`No such space by the spaceDefID "${spaceDefID}"!`);
    } else {
        return spaceIndex;
    }
};

function getObjectDefIndex(objectDefID) {
    // search for object index by objectDefID
    let objectIndex = undefined;
    for (let i = 0; i < objectDef.length; i++) {
        if (objectDef[i].objectDefID === objectDefID) {
            objectIndex = i;
            break;
        }
    }
    if (objectIndex === undefined) {
        console.log(`No such object by the objectDefID "${objectDefID}"!`);
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
function defineSpace(name, x, y, z, integer = false, sectors = 1, obstruct = []) {
    // build spatial defintion
    let def = {};
    def.spaceDefID = generateID(spaceDefIDstructure);
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
    def.sectors = Number(sectors);
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
        let sectors = form.querySelector(`#sectors-${form.id.slice(11)}`).value;
        // obstructions
        let obstruct = [];
        form.querySelectorAll('.obstruction').forEach((o) => {
            const x = o.querySelector('.Xdimension').value;
            const y = o.querySelector('.Ydimension').value;
            const z = o.querySelector('.Zdimension').value;
            obstruct.push([x, y, z]);
        });
        // pass info as arguments into defineSpaces function
        defineSpace(name, x, y, z, integer, sectors, obstruct);
    });
};

// Defintion of Objects
function defineObject(name, x, y, z, quantity) {
    let mod = {};
    mod.x = x;
    mod.y = y;
    mod.z = z;
    mod.volume = x * y * z;
    mod.objectName = name;
    mod.objectDefID = generateID(objectDefIDstructure);
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

// Object Generation
function generateObject(objectDefIndex) {
    // generate object and store in queue structure
    const OD = objectDef[objectDefIndex];
    let object = {
        objectID: `${OD.objectDefID}-${generateID(objectIDstructure)}`,
        x: OD.x,
        y: OD.y,
        z: OD.z,
        volume: OD.volume,
    };
    let coordinates = [];
    for (let x = 0; x < object.x; x++) {
        for (let y = 0; y < object.y; y++) {
            for (let z = 0; z < object.z; z++) {
                coordinates.push([x, y, z]);
            }
        }
    }
    object.coors = coordinates;
    objectQueue.push(object);
};

function generateObjects() {
    // generate single instance of each object defintion
    for (let i = 0; i < objectDef.length; i++) {
        generateObject(i);
    }
};

// Model Generation
function generateModel(spaceDefIndex) {
    const SD = spaceDef[spaceDefIndex];
    // generate coordinates with correct number type 
    let space = [];
    if (SD.integer === true) {
        // integer coordinate field 
        for (let x = -(Math.ceil(SD.x / 2)) + 1; x < Math.floor(SD.x / 2) + 1; x++) {
            for (let y = -(Math.ceil(SD.y / 2)) + 1; y < Math.floor(SD.y / 2) + 1; y++) {
                for (let z = -(Math.ceil(SD.z / 2)) + 1; z < Math.floor(SD.z / 2) + 1; z++) {
                    // each coordinate point 
                    space.push({coor: [x, y, z], objectID: "", open: true});
                }
            }
        }
    } else {
        // positive coordinate field 
        for (let x = 0; x < SD.x; x++) {
            for (let y = 0; y < SD.y; y++) {
                for (let z = 0; z < SD.z; z++) {
                    space.push({coor: [x, y, z], objectID: "", open: true});
                }
            }
        }
    }
    // add spatial index data to points 
    for (let i = 0; i < space.length; i++) {
        space[i].spaceIndex = i;
    }
    // add sector data to points 
    if (SD.sectors > 1) {
        const sections = SD.sectors;
        const sectionVolume = Math.floor(SD.volume / sections);
        let sect = 0;
        for (let i = 0; i < space.length; i++) {
            if (i / sectionVolume % 1 === 0 && i / sectionVolume !== sections) {
                sect += 1;
            }
            space[i].sector = sect;
        }
    }
    // add model to models structure
    SD.instances += 1;
    models.push({
        modelID: generateID(modelIDstructure),
        spaceDefID: SD.spaceDefID,
        space: space,
        instance: SD.instances,
        x: SD.x,
        y: SD.y,
        z: SD.z,
        volume: SD.volume,
        integer: SD.integer,
    });
};

function generateModels() {
    // generate single instance of each spatial model defintion
    for (let i = 0; i < spaceDef.length; i++) {
        generateModel(i);
    }
};

// Model Tests
function checkVolume() {
    // checks if total volume of objects is less than total volume of space
    // accumulate sum volume for objects
    let objectVol = 0;
    for (let i = 0; i < objectQueue.length; i++) {
        objectVol += objectQueue[i].volume;
    }
    // accumulate sum volume for spaces
    let spaceVol = 0;
    for (let i = 0; i < spaceDef.length; i++) {
        spaceVol += spaceDef[i].volume;
    }
    // compare size of accumlated sums
    if (objectVol < spaceVol) {
        return true; // fits
    } else {
        return false; // insufficient space for objects
    }
};

// Lower-Order Model Operations 
function validCoor(modelIndex, x, y, z) {
    // tests for whether the coordinate exists in the space at spaceDefID
    const model = models[modelIndex];
    if (model.integer === true) {
        // integer space
        if (x >= -(Math.ceil(model.x / 2)) + 1 && x < Math.floor(model.x / 2) + 1 && y >= -(Math.ceil(model.y / 2)) + 1 && y < Math.floor(model.y / 2) + 1 && z >= -(Math.ceil(model.z / 2)) + 1 && z < Math.floor(model.z / 2) + 1) {
            // if each coordinate value satasfies the range for that dimension in the model
            return true;
        } else {
            console.log(`No {${x}, ${y}, ${z}} coordinate in ${model.name}!`);
            return false;
        }
    } else {
        // positive space
        if (x >= 0 && x < model.x && y >= 0 && y < model.y && z >= 0 && z < model.z) {
            // if each coordinate value satasfies the range for that dimension in the model
            return true;
        } else {
            console.log(`No {${x}, ${y}, ${z}} coordinate in ${model.name}!`);
            return false;
        }
    }
};

function validateSpace(modelIndex, min, max) {
    const xRange = max[0] - min[0];
    const yRange = max[1] - min[1];
    const zRange = max[2] - min[2];

    let xStart, xEnd, yStart, yEnd, zStart, zEnd;

    if (xRange === 0) { // for no difference 
        xRange = 1;
    } else if (xRange > 0) { // for positive difference 
        xStart = min[0];
        xEnd = max[0];
    } else { // for negative difference 
        xStart = max[0];
        xEnd = min[0];
    }

    if (yRange === 0) { // for no change 
        yRange = 1;
    } else if (yRange > 0) { // for positive difference 
        yStart = min[1];
        yEnd = max[1];
    } else { // for negative difference 
        yStart = max[1];
        yEnd = min[1];
    }

    if (zRange === 0) { // for no change 
        zRange = 1;
    } else if (zRange > 0) { // for positive difference 
        zStart = min[2];
        zEnd = max[2];
    } else { // for negative difference 
        zStart = max[2];
        zEnd = min[2];
    }

    for (let x = xStart; x < xEnd; x++) {
        for (let y = yStart; y < yEnd; y++) {
            for (let z = zStart; z< zEnd; z++) {
                if (!validCoor(modelIndex, x, y, z)) {
                    return false;
                }
            }
        }
    }

    return true && {start: [xStart, yStart, zStart], end: [xEnd, yEnd, zEnd]};
};

function getPointIndex(modelIndex, x, y, z) {
    if (validCoor(modelIndex, x, y, z)) {
        // get space definition
        const defS = models[modelIndex];

        if (!defS.integer) {

            // positive/non-integer space single point access

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
    } else {
        return false;
    }
};

function getObjectDef(objectID) {
    // returns object definition associated with objectID
    let ID = "";
    for (let i = 0; i < objectID.length; i++) {
        const char = objectID.slice(i, i + 1);
        if (char !== "-") {
            ID += char;
        } else {
            break;
        }
    }
    return objectDef[getObjectDefIndex(ID)];
};

// Higher-Order Model Operations

// Single Point Access 
function spa(modelIndex, x, y, z) {
    // returns a single point object
    const pointIndex = getPointIndex(modelIndex, x, y, z);
    if (pointIndex !== false) {
        return models[modelIndex].space[pointIndex];
    } else {
        return false;
    }
};

// Full Model Scanning 
function getScanFull(modelIndex, test, id) {
    // gets a portion of a space by testing the properties of all points
    const space = models[modelIndex].space;
    let result = [];
    for (let i = 0; i < space.length; i++) {
        const point = space[i];
        if (test(point, id)) {
            result.push(point);
        }
    }
    return result;
};

function fullScan(modelIndex, test, id) {
    // scans every point in a model's space for a point property
    const space = models[modelIndex].space;
    for (let i = 0; i < space.length; i++) {
        const point = space[i];
        if (test(point, id)) {
            return true;
        }
    }
    return false;
};

// Partial Model Scanning 
function getScanFocus(modelIndex, minCoor, maxCoor, test, id) {
    // uses single point access to test if any point in a specified region bear a specific point property
    // validate space
    const validSpace = validateSpace(models[modelIndex], minCoor, maxCoor);
    if (validSpace !== false) {
        // search within ranges with spa 
        let result = [];
        for (let x = validSpace.start[0]; x < validSpace.end[0]; x++) {
            for (let y = validSpace.start[1]; y < validSpace.end[1]; y++) {
                for (let z = validSpace.start[2]; z < validSpace.end[2]; z++) {
                    // use single point access to test each point 
                    const point = spa(modelIndex, x, y, z);
                    if (point !== false && test(point, id)) {
                        result.push(point);
                    }
                }
            }
        }
        return result;
    } else {
        return false;
    }
};

function focusScan(modelIndex, minCoor, maxCoor, test, id) {
    // uses single point access to test if any point in a specified region bear a specific point property
        // validate space
        const validSpace = validateSpace(models[modelIndex], minCoor, maxCoor);
        if (validSpace !== false) {
            // search within ranges with spa 
            for (let x = validSpace.start[0]; x < validSpace.end[0]; x++) {
                for (let y = validSpace.start[1]; y < validSpace.end[1]; y++) {
                    for (let z = validSpace.start[2]; z < validSpace.end[2]; z++) {
                        // use single point access to test each point 
                        const point = spa(modelIndex, x, y, z);
                        if (point !== false && test(point, id)) {
                            return true; // return true on any pass
                        }
                    }
                }
            }
        } else {
            return false;
        }
};
    
// Tests for Scanning
function sector(point, number) {
    if (point.sector === number) {
        return true;
    } else {
        return false;
    }
};

function identifyObject(point, objectID) {
    if (point.objectID === objectID) {
        return true;
    } else {
        return false;
    }
};

function identifyObjectDef(point, objectDefID) {
    if (point.objectID.length > 0) {
        const id = point.objectID;
        let compile = "";
        for (let i = 0; i < id.length; i++) {
            const char = id.slice(i, i + 1);
            if (char !== "-") {
                compile += char;
            } else {
                break;
            }
        }
        if (compile === objectDefID) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

function openPoint(point, open) {
    if (point.open === open) {
        return true;
    } else {
        return false;
    }
};

// Object Manipulation
function addObject(modelIndex, x, y, z) {
    // adds last object in objectQueue to model starting at x, y, z
    if (objectQueue.length > 0) {
        const object = objectQueue[objectQueue.length - 1];
        if (validateSpace(modelIndex, [x, y, z], [Number(object.x) + x, Number(object.y) + y, Number(object.z) + z])) {
            for (let i = 0; i < object.coors.length; i++) {
                const c = object.coors[i];
                spa(modelIndex, c[0] + x, c[1] + y, c[2] + z).open = false;
                spa(modelIndex, c[0] + x, c[1] + y, c[2] + z).objectID = object.objectID;
            }
        }
    } else {
        console.log("No more objects in objectQueue!");
    }
};

function transpose(modelIndex, objectID, x, y, z) {
    // tranpose object in model from where it is found to x, y, z
    const object = objectDef[getObjectDefIndex(objectID)];
    if (validateSpace(modelIndex, [x, y, z], [Number(object.x) + x, Number(object.y) + y, Number(object.z) + z])) {

    }
};

/////////////////// PROCESS ///////////////////

defineSpaces();
console.log(spaceDef);

defineObjects();
console.log(objectDef);

generateModels();
console.log(models);

generateObjects();
console.log(objectQueue);

addObject(0, 1, 2, 1);

console.log(getScanFull(0, identifyObjectDef, objectDef[0].objectDefID));


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
    const formID = getID(spaceFormIDstructure);
    const form = document.createElement('div');
    form.setAttribute('class', 'space-form content-highlight2');
    form.setAttribute('id', `space-form-${formID}`);

    // create components 

    // integer component 
    const integer = document.createElement('fieldset');
    integer.setAttribute('class', 'center-flex');

    const integerLegend = document.createElement('legend');
    integerLegend.innerText = 'Number Type';

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
    
    // sector component 
    const sector = document.createElement('fieldset');
    sector.setAttribute('class', 'center-flex');

    const sectorLegend = document.createElement('legend');
    sectorLegend.innerText = 'Sectors';

    const select = document.createElement('select');
    select.setAttribute('id', `${formID}`);

    const option1 = document.createElement('option');
    option1.setAttribute('value', '1');
    option1.innerText = '(0) None';
    
    const option2 = document.createElement('option');
    option2.setAttribute('value', '2');
    option2.innerText = '(2) Semisector';
    
    const option3 = document.createElement('option');
    option3.setAttribute('value', '4');
    option3.innerText = '(4) Quadrant';
    
    const option4 = document.createElement('option');
    option4.setAttribute('value', '6');
    option4.innerText = '(6) Sextant';

    const option5 = document.createElement('option');
    option5.setAttribute('value', '8');
    option5.innerText = '(8) Octant';

    // assemble sector component 
    sector.appendChild(sectorLegend);
    select.appendChild(option1);
    select.appendChild(option2);
    select.appendChild(option3);
    select.appendChild(option4);
    select.appendChild(option5);
    sector.appendChild(select);

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
    form.appendChild(titleComponent(`Space ${formID}`));
    form.appendChild(addBreak());
    form.appendChild(dimensionsComponent("space"));
    form.appendChild(addBreak());
    form.appendChild(integer);
    form.appendChild(addBreak());
    form.appendChild(sector);
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