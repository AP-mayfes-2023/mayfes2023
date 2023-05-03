;(()=>{
"use strict";
const Skip = 100;
const J = 1;
const h = 0;
var Temp = 0.1;
const unit = 20;
const PI = Math.PI;

var NX = 0, NY = 0;
let f;

window.type2 = {init, draw};

function init(width, height) {
    NX = Math.ceil(width/unit);
    NY = Math.ceil(height /unit);
    fill(0);
    background(255);
    strokeWeight(3);
    colorMode(RGB);
    f = new Field(NX,NY);
    for (let ix = 0; ix < NX; ix++) {
        for (let iy = 0; iy < NY; iy++) {
            stroke(200,(Math.cos(f.field[ix][iy])+1)*255/2,(Math.sin(f.field[ix][iy])+1)*255/2);
            line(ix * unit, iy * unit, (ix+ Math.cos(f.field[ix][iy])/2)*unit, (iy + Math.sin(f.field[ix][iy]) /2)*unit );
        }
    }
}

function draw() {
    background(255);
    for (let iskip = 0; iskip < Skip; iskip++) {
        for (let ir = 0; ir < Math.round(Math.random() * NX * NY); ir++) {
            const ix = Math.floor(Math.random() * NX);
            const iy = Math.floor(Math.random() * NY);
            const th=randomGaussian();
            const prob = f.prob(ix, iy, J, h, th);
            if (Math.random()<Math.min(1,prob)) {
                f.field[ix][iy] += th;
            }
        }
    }
    for (let ix = 0; ix < NX; ix++) {
        for (let iy = 0; iy < NY; iy++) {
            stroke(200,(Math.cos(f.field[ix][iy])+1)*255/2,(Math.sin(f.field[ix][iy])+1)*255/2);
            line(ix * unit, iy * unit, (ix+ Math.cos(f.field[ix][iy])/2)*unit, (iy + Math.sin(f.field[ix][iy])/2 )*unit );
        }
    }
    if (keyIsDown(DOWN_ARROW)) {
        if (Temp > 0.01) {
            Temp -= 0.1;
        }
    }
    if (keyIsDown(UP_ARROW)) {
        if (Temp < 0.2) {
            Temp += 0.1;
        }
    }
    if (Temp <= 0) {
        Temp = 0.01;
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
                this.field[ix][iy] = Math.random()*2*PI;
            }
        }
    }
    prob(ix,iy,J,h,th) {
        var energy1 = (
            Math.cos(
                th + this.field[ix][iy] - this.field[ix][mod(iy - 1, this.NY)]
            ) + Math.cos(
                th + this.field[ix][iy] - this.field[ix][(iy + 1) % this.NY]
            ) + Math.cos(
                th + this.field[ix][iy] - this.field[(ix + 1) % this.NX][iy]
            ) + Math.cos(
                th + this.field[ix][iy] - this.field[mod(ix - 1, this.NX)][iy]
            )
        ) - (
            Math.cos(
                this.field[ix][iy] - this.field[ix][mod(iy - 1, this.NY)]
            ) + Math.cos(
                this.field[ix][iy] - this.field[ix][(iy + 1) % this.NY]
            ) + Math.cos(
                this.field[ix][iy] - this.field[(ix + 1) % this.NX][iy]
            ) + Math.cos(
                this.field[ix][iy] - this.field[mod(ix - 1, this.NX)][iy]
            )
        );
        var energy2 = Math.cos(this.field[ix][iy]+th)-Math.cos(this.field[ix][iy]);
        return Math.exp((J * energy1 + h * energy2) / Temp);
    }
}

function mod(i, j) {
    return (i % j) < 0 ? (i % j) + 0 + (j < 0 ? -j : j) : (i % j + 0);
}

window.keyPressed=()=> {
    if (keyCode === UP_ARROW) {
        if (Temp < 2) {
            Temp += 0.1;
        }
    }else if (keyCode === DOWN_ARROW) {
        if (Temp > 0.1) {
            Temp -= 0.1;
        }
    }
}
})();