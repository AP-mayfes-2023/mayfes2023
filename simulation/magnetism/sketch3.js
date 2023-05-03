;(()=>{
"use strict";
const Skip = 50;
const J = 1;
const h = 0;
var Temp = 0.001;
const unit = 20;
const PI = Math.PI;

let NX = 0, NY= 0;
let f;

window.type3 = {init, draw};

function init(width, height) {
    NX = Math.ceil(width/unit);
    NY = Math.ceil(height /unit);
    fill(0);
    background(255);
    strokeWeight(2);
    f = new Field(NX, NY);
    colorMode(HSB,360,100,100,100);
    for (let ix = 0; ix < NX; ix++) {
        for (let iy = 0; iy < NY; iy++) {
            stroke(f.field[ix][iy][1]*360/(2*PI),100,100,100* Math.abs(Math.sin(f.field[ix][iy][0])));
            line(ix * unit, iy * unit, (ix+ Math.sin(f.field[ix][iy][0])*Math.cos(f.field[ix][iy][1])*2/3)*unit, (iy + Math.sin(f.field[ix][iy][0])*Math.sin(f.field[ix][iy][1])*2/3)*unit );
        }
    }
}

function draw() {
    background(0);
    for (let iskip = 0; iskip < Skip; iskip++) {
        for (let ir = 0; ir < Math.round(Math.random() * NX * NY); ir++) {
            let ix = Math.floor(Math.random() * NX);
            let iy = Math.floor(Math.random() * NY);
            let th = randomGaussian();
            let ph = randomGaussian();
            let prob = f.prob(ix, iy, J, h, th,ph);
            if (Math.random()<Math.min(1,prob)) {
                f.field[ix][iy][0] += th;
                f.field[ix][iy][1] += ph;
            }
        }
    }
    for (let ix = 0; ix < NX; ix++) {
        for (let iy = 0; iy < NY; iy++) {
            stroke(mod(f.field[ix][iy][1]*360/(2*PI),360),100,100,100* Math.abs(Math.sin(f.field[ix][iy][0])));
            line(ix * unit, iy * unit, (ix + Math.sin(f.field[ix][iy][0]) * Math.cos(f.field[ix][iy][1]) * 2 / 3) * unit, (iy + Math.sin(f.field[ix][iy][0]) * Math.sin(f.field[ix][iy][1]) * 2 / 3) * unit);
        }
    }
    if (keyIsDown(DOWN_ARROW)) {
        if (Temp > 0) {
            Temp -= 0.05;
        }
    }
    if (keyIsDown(UP_ARROW)) {
        if (Temp < 1) {
            Temp += 0.05;
        }
    }
    if (Temp <= 0) {
        Temp = 0.001;
    }
}

class Field {
    constructor(NX, NY) {
        this.NX = NX;
        this.NY = NY;
        this.field = [];
        for (let ix = 0; ix < NX; ix++) {
            this.field[ix]=[];
            for (let iy = 0; iy < NY; iy++) {
                this.field[ix][iy] = [];
                this.field[ix][iy][0] = Math.random() * PI;
                this.field[ix][iy][1] = Math.random() * 2 * PI;
            }
        }
    }
    prob(ix,iy,J,h,th,ph) {
        var energy1 = (
            Math.sin(th + this.field[ix][iy][0]) * (
                Math.sin(this.field[ix][mod(iy - 1, this.NY)][0]) * Math.cos(ph + this.field[ix][iy][1] - this.field[ix][mod(iy - 1, this.NY)][1]) + Math.cos(th + this.field[ix][iy][0]) * Math.cos(this.field[ix][mod(iy - 1, this.NY)][0])
            ) + (
                Math.sin(this.field[ix][(iy + 1) % this.NY][0]) * Math.cos(ph + this.field[ix][iy][1] - this.field[ix][(iy + 1) % this.NY][1]) + Math.cos(th + this.field[ix][iy][0]) * Math.cos(this.field[ix][(iy + 1) % this.NY][0])
            ) + (
                Math.sin(this.field[(ix + 1) % this.NX][iy][0]) * Math.cos(ph + this.field[ix][iy][1] - this.field[(ix + 1) % this.NX][iy][1]) + Math.cos(th + this.field[ix][iy][0]) * Math.cos(this.field[(ix + 1) % this.NX][iy][0])
            ) + (
                Math.sin(this.field[mod(ix - 1, this.NX)][iy][0]) * Math.cos(ph + this.field[ix][iy][1] - this.field[mod(ix - 1, this.NX)][iy][1]) + Math.cos(th + this.field[ix][iy][0]) * Math.cos(this.field[mod(ix - 1, this.NX)][iy][0])
            )
        ) - (
            Math.sin(this.field[ix][iy][0]) * (
                Math.sin(this.field[ix][mod(iy - 1, this.NY)][0]) * Math.cos(this.field[ix][iy][1] - this.field[ix][mod(iy - 1, this.NY)][1]) + Math.cos(this.field[ix][iy][0]) * Math.cos(this.field[ix][mod(iy - 1, this.NY)][0])
            ) + (
                Math.sin(this.field[ix][(iy + 1) % this.NY][0]) * Math.cos(this.field[ix][iy][1] - this.field[ix][(iy + 1) % this.NY][1]) + Math.cos(this.field[ix][iy][0]) * Math.cos(this.field[ix][(iy + 1) % this.NY][0])
            ) + (
                Math.sin(this.field[(ix + 1) % this.NX][iy][0]) * Math.cos(this.field[ix][iy][1] - this.field[(ix + 1) % this.NX][iy][1]) + Math.cos(this.field[ix][iy][0]) * Math.cos(this.field[(ix + 1) % this.NX][iy][0])
            ) + (
                Math.sin(this.field[mod(ix - 1, this.NX)][iy][0]) * Math.cos(this.field[ix][iy][1] - this.field[mod(ix - 1, this.NX)][iy][1]) + Math.cos(this.field[ix][iy][0]) * Math.cos(this.field[mod(ix - 1, this.NX)][iy][0])
            )
        );
        var energy2 = Math.cos(this.field[ix][iy][0] + th) - Math.cos(this.field[ix][iy][0]);
        return Math.exp((J * energy1 + h * energy2) / Temp);
    }
}

function signal(f) {
    return Math.round((f + 1) / 2 * 255);
}

function mod(i, j) {
    return (i % j) < 0 ? (i % j) + 0 + (j < 0 ? -j : j) : (i % j + 0);
}

})();