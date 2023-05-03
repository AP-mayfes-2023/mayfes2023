(() => {
"use strict";

const Skip = 100;
const J = 1;
const h = 0;
var Temp = 2 * J / Math.log(1 + Math.sqrt(2));
const unit = 10;

let NX = 0, NY = 0;
let f;

window.type1 = { init, draw };

function init(width, height) {
    NX = Math.ceil(width / unit);
    NY = Math.ceil(height / unit);
    fill(0);
    colorMode(RGB);
    stroke(0);
    strokeWeight(0);
    f = new Field(NX, NY);
    for (let ix = 0; ix < NX; ix++) {
        for (let iy = 0; iy < NY; iy++) {
            fill(signal(f.field[ix][iy]));
            rect(ix * unit, iy * unit, unit, unit);
        }
    }
}

function draw() {
    for (let iskip = 0; iskip < Skip; iskip++) {
        for (let ir = 0; ir < Math.round(Math.random() * NX * NY); ir++) {
            const ix = Math.floor(Math.random() * NX);
            const iy = Math.floor(Math.random() * NY);
            const prob = f.prob(ix, iy, J, h);
            if (Math.random() < Math.min(1, prob)) {
                f.field[ix][iy] *= -1;
            }
        }
    }
    for (let ix = 0; ix < NX; ix++) {
        for (let iy = 0; iy < NY; iy++) {
            fill(signal(f.field[ix][iy]));
            rect(ix * unit, iy * unit, unit, unit);
        }
    }
    if (keyIsDown(DOWN_ARROW)) {
        if (Temp > 0.1) {
            Temp -= 0.1;
        }
    }
    if (keyIsDown(UP_ARROW)) {
        if (Temp < 4) {
            Temp += 0.1;
        }
    }
}

class Field {
    constructor(NX, NY) {
        this.NX = NX;
        this.NY = NY;
        this.field = [];
        for (let ix = 0; ix < NX; ix++) {
            this.field[ix] = [];
            for (let iy = 0; iy < NY; iy++) {
                this.field[ix][iy] = Math.floor(Math.random() * 2) * 2 - 1;
            }
        }
    }
    prob(ix, iy, J, h) {
        const energy1 = this.field[ix][iy] * (this.field[ix][mod(iy - 1, this.NY)] + this.field[ix][(iy + 1) % this.NY] + this.field[(ix + 1) % this.NX][iy] + this.field[mod(ix - 1, this.NX)][iy]);
        const energy2 = this.field[ix][iy];
        return Math.exp(-2 * (J * energy1 + h * energy2) / Temp);
    }
}

function signal(f) {
    return Math.round((f + 1) / 2 * 255);
}

function mod(i, j) {
    return (i % j) < 0 ? (i % j) + 0 + (j < 0 ? -j : j) : (i % j + 0);
}




})();