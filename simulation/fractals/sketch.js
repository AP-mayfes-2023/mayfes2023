;(()=>{
"use strict";
let x = 0.5
let y = 0
let nx = 0
let ny = 0
let scale = 800
const Boost = 10

let width = 0, height = 0;

window.setup = ()=>{
    const size = windowWidth > windowHeight ? windowHeight : windowWidth;
    width = size;
    height = size;
    scale = size;
    createCanvas(width, height);
    background(50);  // 黒っぽい背景のほうが見やすい？？どうだろう
    frameRate(120);
}

window.draw = ()=>{
    translate(width / 2, height);
    stroke(150+40*randomGaussian(), 255+10*randomGaussian(), 200+40*randomGaussian(),200);
    strokeWeight(5);
    for (let s = 0; s < Boost; s++) {
        const r = random(1);
        if (r < 0.02) {
            nx = 0.5;
            ny = 0.27 * y;
        } else if (r <= 0.17) {
            nx = -0.139 * x + 0.263 * y + 0.57;
            ny = 0.246 * x + 0.224 * y - 0.036;
        } else if (r <= 0.3) {
            nx = 0.17 * x - 0.215 * y + 0.408;
            ny = 0.222 * x + 0.176 * y + 0.0893;
        } else {
            nx = 0.781 * x + 0.034 * y + 0.1075;
            ny = -0.032 * x + 0.739 * y + 0.27;
        }
        point((x - 0.5) * scale, -y * scale);
        x = nx;
        y = ny;
    }
}
})();