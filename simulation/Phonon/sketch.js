(()=>{
"use strict";

const unit = 20;
const m = 1;
const k = 1;
const g = 0.05;
const dt = 0.1;
const Skips = 10;
const p = 0.001;
var weightx = 0;
var weighty = 0;
var Temp = 0;
var energy = 0;
var scale = Math.sqrt(2 * Temp / m);
var Nx = 0;
var Ny = 0;
var field = [];
var velocity = [];
var force = [];
var ix = 0;
var iy = 0;
var id = 0;
var skip = 0;
var theta = 0;
var Forces;

window.setup=()=>{
    size = windowWidth>windowHeight?windowHeight:windowWidth;
    Nx = Math.ceil(size / unit);
    Ny = Math.ceil(size / unit);
    createCanvas(size, size);
    frameRate(30);
    stroke(0);
    strokeWeight(0.1);
    for (ix = 0; ix < Nx; ix++) {
        field[ix] = [];
        force[ix] = [];
        velocity[ix] = [];
        for (iy = 0; iy < Ny; iy++) {
            field[ix][iy] = [];
            force[ix][iy] = [];
            velocity[ix][iy] = [];
            for (id = 0; id < 2; id++) {
                field[ix][iy][id] = 0;
                force[ix][iy][id] = 0;
                velocity[ix][iy][id] = 0;
            }
            weightx += field[ix][iy][0];
            weighty += field[ix][iy][1];
        }
    }
    // for (ix = 0; ix < Nx; ix++) {
    //     for (iy = 0; iy < Ny; iy++) {
    //         field[ix][iy][0] -= weightx;
    //         field[ix][iy][1] -= weighty;
    //     }
    // }
}

window.draw=() =>{
    scale = Math.sqrt(2 * Temp / m);
    line(0, 0, width, height);
    background(255);
    for (ix = 0; ix < Nx-1; ix++) {
        for (iy = 0; iy < Ny - 1; iy++) {
            energy=(field[ix][iy][0]-field[mod(ix + 1, Nx)][iy][0]-unit)^2+(field[ix][iy][1]-field[ix][mod(iy + 1, Ny)][1]-unit)^2+(field[ix][iy][0]-field[mod(ix - 1, Nx)][iy][0]-unit)^2+(field[ix][iy][1]-field[ix][mod(iy - 1, Ny)][1]-unit)^2;
            fill(100,255-200*Math.tanh(Math.log(energy)),255*(2-Math.tanh(Math.log(energy))+1)/2,Math.sqrt(energy+1)*50);
            line(ix * unit + field[ix][iy][0], iy * unit + field[ix][iy][1], mod(ix + 1, Nx) * unit + field[mod(ix + 1, Nx)][iy][0], iy * unit + field[mod(ix + 1, Nx)][iy][1]);
            line(ix * unit + field[ix][iy][0], iy * unit + field[ix][iy][1], ix * unit + field[ix][mod(iy + 1, Ny)][0], mod(iy + 1, Ny) * unit + field[ix][mod(iy + 1, Ny)][1]);
            ellipse(ix * unit + field[ix][iy][0], iy * unit + field[ix][iy][1], unit / 3, unit / 3);
        }
    }
    for (skip = 0; skip < Skips; skip++) {
        weightx = 0;
        weighty = 0;
        Forces = Force(field, force,velocity);
        for (ix = 0; ix < Nx; ix++) {
            for (iy = 0; iy < Ny; iy++) {
                velocity[ix][iy][0] += Forces[ix][iy][0] * dt / m;
                velocity[ix][iy][1] += Forces[ix][iy][1] * dt / m;
                field[ix][iy][0] += velocity[ix][iy][0] * dt;
                field[ix][iy][1] += velocity[ix][iy][1] * dt;
                if (Math.abs(field[ix][iy][0]) < 0.01) {
                    field[ix][iy][0] = 0;
                };
                if (Math.abs(field[ix][iy][1]) < 0.01) {
                    field[ix][iy][1] = 0;
                };
                weightx += field[ix][iy][0];
                weighty += field[ix][iy][1];
            }
        }
        // for (ix = 0; ix < Nx; ix++) {
        //     for (iy = 0; iy < Ny; iy++) {
        //         field[ix][iy][0] -= weightx;
        //         field[ix][iy][1] -= weighty;
        //     }
        // }
    }
}

function Force(field,force,velocity) {
    for (ix = 0; ix < Nx; ix++) {
        for (iy = 0; iy < Ny; iy++) {
            force[ix][iy][0] = -k * (4 * field[ix][iy][0] - field[mod(ix - 1, Nx)][iy][0] - field[mod(ix + 1, Nx)][iy][0] - field[ix][mod(iy - 1, Ny)][0] - field[ix][mod(iy + 1, Ny)][0])-g*velocity[ix][iy][0]+scale*randomGaussian()-p*(field[ix][iy][0]^4);
            force[ix][iy][1] = -k * (4 * field[ix][iy][1] - field[ix][mod(iy - 1, Ny)][1] - field[ix][mod(iy + 1, Ny)][1] - field[mod(ix - 1, Nx)][iy][1] - field[mod(ix + 1, Nx)][iy][1])-g*velocity[ix][iy][1]+scale*randomGaussian()-p*(field[ix][iy][1]^4);
        }
    }
    return force;
}

function mod(i, j) {
    return (i % j) < 0 ? (i % j) + 0 + (j < 0 ? -j : j) : (i % j + 0);
}

window.mousePressed=()=> {
    if (mouseX < width && mouseY < height) {
        ix = Math.floor(mouseX / unit);
        iy = Math.floor(mouseY / unit);
        theta = random(2 * PI);
        field[ix][iy][0] += unit * Math.cos(theta);
        field[ix][iy][1] += unit * Math.sin(theta);
    }
}

window.keyPressed=()=> {
    if (keyCode === ENTER) {
        for (ix = 0; ix < Nx; ix++) {
            for (iy = 0; iy < Ny; iy++) {
                field[ix][iy][0] += unit * randomGaussian();
                field[ix][iy][1] += unit * randomGaussian();
            }
        }
    } else if (keyCode === DOWN_ARROW) {
        if (Temp > 0.01) {
            Temp -= 0.01;
        }
    } else if (keyCode === UP_ARROW) {
        if (Temp < 0.05) {
            Temp += 0.01;
        }
    }
    // console.log(Temp);
}

})();