(()=>{
"use strict";

const PI=3.141592653589793238;
let width=0, height=0;
const Nparticle = 1000;

let LX=width, LY=height;
let R=Math.min(LX/4,LY/4)*3/2;
const v0=700;
let theta = -PI/4;

let x=[], y=[];
let cx=[], cy=[];
let vx=[], vy=[];
let stat = [];
let ball_color = [];

const dt = 0.01;

let keycount = 0;
let particlecount = 0;

const PointTime = 750;
let LimitTime = PointTime;

function init(){
    function hsl2rgb(h, s, l){
        let max=0, min=0;
        let r=0, g=0, b=0;
        if(l<50){
            max = 2.55*(l+l*s/100);
            min = 2.55*(l-l*s/100);
        }else{
            max = 2.55*(l+(100-l)*s/100);
            min = 2.55*(l-(100-l)*s/100);
        }
        if(h<0 || 360<h){
            console.error("invalid h value");
        }else if(h<60){
            r = max;
            g = min + (max-min)*h/60;
            b = min;
        }else if(h<120){
            r = min + (max-min)*(120-h)/60;
            g = max;
            b = min;
        }else if(h<180){
            r = min;
            g = max;
            b = min + (max-min)*(h-120)/60;
        }else if(h<240){
            r = min;
            g = min + (max-min)*(240-h)/60;
            b = max;
        }else if(h<300){
            r = min + (max-min)*(h-240)/60;
            g = min;
            b = max;
        }else{
            r = max;
            g = min;
            b = min + (max-min)*(360-h)/60;
        }
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        return `rgb(${r},${g},${b})`;
    }

    x=[];
    y=[];
    cx=[];
    cy=[];
    vx = Array(Nparticle).fill(0); /* for文とどっちがはやいんだろう */
    vy = Array(Nparticle).fill(0);
    stat = Array(Nparticle).fill(1);;
    ball_color = [];
    theta = -PI/4;
    keycount = 0;
    particlecount = 0;
    LimitTime = PointTime;
    keyCode = 0;
    for (let i=0;i<Nparticle;i++){
        x.push(-R+i/Nparticle);
        y.push(R);
        ball_color.push(hsl2rgb(i*360/Nparticle, 50, 50));
    }
}

window.setup = ()=>{
    const container = document.body;
    const shape = container.getBoundingClientRect();
    const size = Math.min(shape.width, shape.height);
    LX = width = LY = height = size;
    R = size*3/8;
    const canvas = createCanvas(width, height);
    canvas.parent(container);
    background(255);
    textFont('Optima');
    init();
};

window.draw = ()=>{
    if (keycount === 1 && LimitTime > 0) {
        LimitTime -= 1;
    }
    translate(width/2,height/2);
    background(255);
    stroke(100);
    strokeWeight(10);
    line(LX / 2, LY / 2, LX / 2, -LY / 2);
    line(LX / 2, -LY / 2, -LX / 2, -LY / 2);
    line(-LX / 2, -LY / 2, -LX / 2, LY / 2);
    line(-LX / 2, LY / 2, LX / 2, LY / 2);
    strokeWeight(5);
    stroke(color(255, 0, 0));
    line(R, -R, R, -LY/2);
    line(R, -R, LX/2, -R);
    line(R, -LY/2, LX/2, -LY/2);
    line(LX/2, -R, LX/2, -LY/2);
    fill(200);
    strokeWeight(0)
    ellipse(0, 0, R * 2, R * 2);
    fill(0);
    textSize(32);
    text('Score: ' + particlecount, -130, -30);
    text('Time Limit: ' + Math.max(LimitTime,0), -130, 30);
    for (let i=0; i<Nparticle; i++){
        let hold=[];
        x[i] += vx[i]*dt;
        y[i] += vy[i] * dt;
        if (x[i] > R && y[i] < -R) {
            vx[i] = -(x[i] - R * 7 / 6) ^ 2;
            vy[i] = -(y[i] + R * 7 / 6) ^ 2;
            if (LimitTime>0) {
                particlecount += 1*stat[i];
            }
            stat[i] = 0;
        }
        if (x[i]<-LX/2){
            x[i]=-LX-x[i];
            vx[i]=-vx[i];
        }else if(x[i]>LX/2){
            x[i]=LX-x[i];
            vx[i]=-vx[i];
        }
        if (y[i]<-LY/2){
            y[i]=-LY-y[i];
            vy[i]=-vy[i];
        }else if(y[i]>LY/2){
            y[i]=LY-y[i];
            vy[i]=-vy[i];
        }
        if (x[i]*x[i]+y[i]*y[i]<R*R){
            const T=optimaltime(x[i],y[i],vx[i],vy[i],R);
            cx[i]=x[i]-vx[i]*T;
            cy[i]=y[i]-vy[i]*T;
            hold=mirror(x[i],y[i],cx[i],cy[i],vx[i],vy[i],T);
            x[i]=hold[0];
            y[i]=hold[1];
            vx[i]=(x[i]-cx[i])/sqrt((x[i]-cx[i])*(x[i]-cx[i])+(y[i]-cy[i])*(y[i]-cy[i]))*v0;
            vy[i]=(y[i]-cy[i])/sqrt((x[i]-cx[i])*(x[i]-cx[i])+(y[i]-cy[i])*(y[i]-cy[i]))*v0;
        }
        stroke(ball_color[i]);
        strokeWeight(4);
        point(x[i],y[i]);
    }
    if (keycount === 0) {
        stroke(0);
        strokeWeight(1);
        line(-R,R,-R+20*cos(theta),R+20*sin(theta));
    }
    if (keyIsDown(UP_ARROW)){
        theta-=PI/360;
    }else if(keyIsDown(DOWN_ARROW)){
        theta+=PI/360;
    }
    if(keyCode===ENTER&&keycount===0){
        for (let i=0; i<Nparticle; i++){
            vx[i]=v0*Math.cos(theta);
            vy[i]=v0*Math.sin(theta);
        }
        keycount=1;
    }
    if (particlecount === 1000) {
        textSize(100);
        strokeWeight(0);
        fill('yellow');
        text('PERFECT!', -200, 200);
        end();
    }
    if (LimitTime <= 0) {
        for (let i = 0; i < Nparticle; i++) {
            vx[i] = 0;
            vy[i] = 0;
        }
        if (particlecount > 750) {
            textSize(100);
            strokeWeight(0);
            fill('red');
            text('Miracle!', -200, 200);
        } else if (particlecount > 500) {
            textSize(100);
            strokeWeight(0);
            fill('orange');
            text('Great Shot!', -250, 200);
        } else if (particlecount > 250) {
            textSize(100);
            strokeWeight(0);
            fill('green');
            text('Good!', -150, 200);
        } else if (particlecount > 100) {
            textSize(100);
            strokeWeight(0);
            fill('blue');
            text('Not Bad!', -200, 200);
        } else {
            textSize(100);
            strokeWeight(0);
            fill('black');
            text('Try Again!', -200, 200);
        }
        end();
    }
};

function end(){
    const canvas = document.getElementById("defaultCanvas0");
    textSize(50);
    fill("red");
    text("Retry", -50, -100);
    fill(0, 1);
    strokeWeight(2);
    rect(-55, -150, 120, 70);

    function onclick(evt){
        const x = evt.offsetX, y = evt.offsetY;
        console.log(x,y);
        console.log(width, height);
        console.log(width/2-55, height/2-150);
        if(width/2-55 <= x && x <= width/2-55+120 && height/2-150 <= y && y<= height/2-150+70){
            canvas.removeEventListener("click", onclick);
            console.log("clicked");
            init();
            loop();
        }
    }
    canvas.addEventListener("click", onclick);
    noLoop();
}

function optimaltime(x,y,vx,vy,R){
    const V2=vx*vx+vy+vy;
    const RV=x*vx+y*vy;
    const T=(RV+sqrt(RV*RV+V2*(R*R-x*x-y*y)))/V2;
    return T;
}

function mirror(x,y,cx,cy,vx,vy,t){
    const theta=findtheta(cx,cy);
    const phi=findtheta(x-cx,y-cy);
    const ret=[];
    ret.push(cx+(-Math.cos(2*(theta-phi))*vx+Math.sin(2*(theta-phi))*vy)*t);
    ret.push(cy+(-Math.sin(2*(theta-phi))*vx-Math.cos(2*(theta-phi))*vy)*t);
    return ret;
}


function findtheta(x, y) {
    let theta = 0;
    if (y > 0) {
        theta = Math.acos(x / sqrt(x * x + y * y));
    } else if (y < 0) {
        theta = PI + Math.acos(-x / sqrt(x * x + y * y));
    }
    return theta;
}

})();