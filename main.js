// user interacts with forms in interface to establish defintions of space in spaceDef structure
// definitions are used to generate spatial models in a separate spatialModels structure
// Interactions with each model are made possible by getPoint, openPoint and closePoint functions.

//  SPACE
let spaceDef = [
    {
        id: "space-1",
        x: 9,
        y: 11,
        z: 10,
        integer: false,
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
    
    {
        id: "space-2",
        x: 5,
        y: 5,
        z: 5,
        integer: true,
        octant: true,
        obstruct : [],
    },
];

function modelSpaces(spaceDef) {
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
                for (let x = 0; x < spaceDef[i].x; x++) {
                    for (let y = 0; y < spaceDef[i].y; y++) {
                        for (let z = 0; z < spaceDef[i].z; z++) {
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
    // Each spatial model is an organized list of objects, where each object represents a point in the space modelled.
    // Their method of generation is three levels of nested iteration (cubic complexity; O(n^3)).
    
    // Because a nested iterator must complete all of its iterations before changing the iteration for the superiterator,
    // higher levels of iterator nesting cause higher frequencies of iterator operation.

    // In model generation, level of iterator nesting ordered from least to most is x, y, z.
    
    // To calculate the rate of change for a coordinate, one must divide the number of objects in the list by the number of changes to that coordinate in the list.
    
    // Becuase z has the highest level of nesting and thus the highest rate of change, z values change for every object in the list A.K.A. the number of objects in the list.
    // Therefore,
    // the rate of change for z in the list is the number of objects in the list / the number of objects in the list or just 1.
    
    // y, being the superiterator of z, only changes after every iteration of z has been completed.
    // Therefore,
    // the rate of change for y in the list is z.
    
    // The number of objects in the spatial model is equal to the number of points in the space modelled (maximum structural efficiency).
    // The number of points in 3D space can be calculated by x * y * z
    // Therefore,
    // The rate of change for x in the list is the number of objects in the list / x  A.K.A.  x * y * z / x = y * z

    // The rates of change for a coordinate can be multiplied by their respective coordinates values to determine the minimum ammount into the list that the coordinate triple with that coordinate value must be.
    // The minimums for each coordinate value can be summed to produce the index in the list at which there exists that coordinate triple
    
    // x coordinate value * rate of change of x in list + y coordinate value * rate of change of y in list + z coordinate value * rate of change of z in list
    // rate of change for z in list = 1
    // rate of change for y in list = z
    // rate of change for x in list = y * z
    // Therefore,
    // the index in the list for the coordinate triple with given coordinate values = x coordinate value * y * z + y coordinate value * z + z coordinate value

    // That index can be calculated at constant complexity; O(c).

    // The idex can be used to find the object representing the point with a given coordinate triple in a given spatial model (which space? which point?).
    return spatialModels[model][(coordinate[0] * spaceDef[model].y * spaceDef[model].z) + (coordinate[1] * spaceDef[model].z) + coordinate[2]];
};

function openPoint(model, coordinate) {
    spatialModels[model][(coordinate[0] * spaceDef[model].y * spaceDef[model].z) + (coordinate[1] * spaceDef[model].z) + coordinate[2]].open = true;
};

function closePoint(model, coordinate) {
    spatialModels[model][(coordinate[0] * spaceDef[model].y * spaceDef[model].z) + (coordinate[1] * spaceDef[model].z) + coordinate[2]].open = false;
};

let spatialModels = modelSpaces(spaceDef);
console.log(spatialModels);
closePoint(1, [3, 2, 1]);
let coor1 = getPoint(1, [3, 2, 1]);
console.log(coor1);

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
