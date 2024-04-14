// The Programic Process
// I.       user interacts with forms in interface to establish defintions of space in spaceDef structure
// II.      definitions are used to generate spatial models in a separate spatialModels structure
// III.     Interactions with each model are made possible by getPoint, openPoint and closePoint functions.

//  SPACE
let spaceDef = [
    {
        id: "space-1",
        x: 8,
        y: 6,
        z: 4,
        integer: true,
        octant: false,
        obstruct : [
            {
                xi: 2,
                xf: 4,
                yi: 0,
                yf: 2,
                zi: 2,
                zf: 4,
            }
        ],
    },
    
    // {
    //     id: "space-2",
    //     x: 5,
    //     y: 5,
    //     z: 5,
    //     integer: true,
    //     octant: true,
    //     obstruct : [],
    // },
];

function generateModels(spaceDef) {
    let spaces = [];
    for ( let i = 0; i < spaceDef.length; i++ ) {

        // for every spatial model
        let space = [];
        if (spaceDef[i].integer === false) {

            if (spaceDef[i].octant === false) {

                // positive coordinate field
                for (let x = 0; x < spaceDef[i].x; x++) {
                    for (let y = 0; y < spaceDef[i].y; y++) {
                        for (let z = 0; z < spaceDef[i].z; z++) {
                            // each coordinate point
                            space.push({space: spaceDef[i].id, coor: [x, y, z], open: true});
                        }
                    }
                }

            } else {

                // positive octant coordinate field
                const xMedian = math.floor(spaceDef[i].x / 2);
                const yMedian = math.floor(spaceDef[i].y / 2);
                const zMedian = math.floor(spaceDef[i].z / 2);

                for (let x = 0; x < spaceDef[i].x; x++) {
                    for (let y = 0; y < spaceDef[i].y; y++) {
                        for (let z = 0; z < spaceDef[i].z; z++) {
                            // each coordinate point
                            if (x < xMedian && y >= 0 && z < 0) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 1});
                            } else if (x >= xMedian && y >= yMedian && z < zMedian) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 2});
                            } else if (x >= xMedian && y < yMedian && z < zMedian) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 3});
                            } else if (x < xMedian && y < yMedian && z < zMedian) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 4});
                            } else if (x < xMedian && y >= yMedian && z >= zMedian) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 5});
                            } else if (x >= xMedian && y >= yMedian && z >= zMedian) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 6});
                            } else if (x >= xMedian && y < yMedian && z >= zMedian) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 7});
                            } else if (x < xMedian && y < yMedian && z >= zMedian) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 8});
                            }
                        }
                    }
                }
            
            }
        } else {
            if (spaceDef[i].octant === false) {

                // integer coordinate field
                for (let x = -(Math.ceil(spaceDef[i].x / 2)) + 1; x < Math.floor(spaceDef[i].x / 2) + 1; x++) {
                    for (let y = -(Math.ceil(spaceDef[i].y / 2)) + 1; y < Math.floor(spaceDef[i].y / 2) + 1; y++) {
                        for (let z = -(Math.ceil(spaceDef[i].z / 2)) + 1; z < Math.floor(spaceDef[i].z / 2) + 1; z++) {
                            // each coordinate point
                            space.push({space: spaceDef[i].id, coor: [x, y, z], open: true});
                        }
                    }
                }

            } else {

                // integer octant coordinate field
                for (let x = -(Math.ceil(spaceDef[i].x / 2)) + 1; x < Math.floor(spaceDef[i].x / 2) + 1; x++) {
                    for (let y = -(Math.ceil(spaceDef[i].y / 2)) + 1; y < Math.floor(spaceDef[i].y / 2) + 1; y++) {
                        for (let z = -(Math.ceil(spaceDef[i].z / 2)) + 1; z < Math.floor(spaceDef[i].z / 2) + 1; z++) {
                            // each coordinate point
                            if (x < 0 && y >= 0 && z < 0) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 1});
                            } else if (x >= 0 && y >= 0 && z < 0) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 2});
                            } else if (x >= 0 && y < 0 && z < 0) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 3});
                            } else if (x < 0 && y < 0 && z < 0) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 4});
                            } else if (x < 0 && y >= 0 && z >= 0) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 5});
                            } else if (x >= 0 && y >= 0 && z >= 0) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 6});
                            } else if (x >= 0 && y < 0 && z >= 0) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 7});
                            } else if (x < 0 && y < 0 && z >= 0) {
                                space.push({space: spaceDef[i].id, coor: [x, y, z], open: true, octant: 8});
                            }
                        }
                    }
                }

            }
        }
        spaces.push(space);
    }
    return spaces;
};

function getPoint(model, coordinate) {
    if (spatialModels[model].integer === false) {
        // variableNameStoringModels[ index of spatial model ][ index of object in that model ];
        return spatialModels[model][ (coordinate[0] * spaceDef[model].y * spaceDef[model].z) + (coordinate[1] * spaceDef[model].z) + coordinate[2] ];
    } else {
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
            if (spatialModels[model][i * xRate].coor[0] === xCoor) {
                // store number of multiples
                xMult = i;
                break;
            }
        }
        
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
            if (spatialModels[model][ (xMult * xRate) + (i * yRate) ].coor[1] === yCoor) {
                // store number of multiples
                yMult = i;
                break;
            }
        }
        
        // coordinate to be found
        const zCoor = coordinate[2];
        // number of changes per y iteration
        const zRange = spaceDef[model].z;
        // rate of change in model list = 1 and zMult * 1 = zMult so a variable for zRate is unnecessary
        // number of multiples until match
        let zMult = 0;
        // iterate for the number of changes
        for (let i = 0; i < zRange; i++) {
            if (spatialModels[model][ (xMult * xRate) + (yMult * yRate) + i ].coor[2] === zCoor) {
                zMult = i;
            }
        }
        
        return spatialModels[model][ (xMult * xRate) + (yMult * yRate) + (zMult) ];
    }
};

function openPoint(model, coordinate) {
    spatialModels[model][(coordinate[0] * spaceDef[model].y * spaceDef[model].z) + (coordinate[1] * spaceDef[model].z) + coordinate[2]].open = true;
};

function closePoint(model, coordinate) {
    spatialModels[model][(coordinate[0] * spaceDef[model].y * spaceDef[model].z) + (coordinate[1] * spaceDef[model].z) + coordinate[2]].open = false;
};

let spatialModels = generateModels(spaceDef);
console.log(spatialModels);
console.log(getPoint(0, [3, 2, 0]));

// OBJECT
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
