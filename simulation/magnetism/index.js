;(()=>{
"use strict";

let width = 0;
let height = 0;

window.setup = ()=>{
	const form = document.forms[0];
	const max_width = innerWidth - form.getBoundingClientRect().width;
	const size = innerHeight>max_width ? max_width : innerHeight;
	width = size;
	height = size;
	const canvas = createCanvas(width, height);
	canvas.parent("canvas_container");
	background(0);
	window.type1.init(width, height);  // はじめはtype1を表示
	window.draw = window.type1.draw;
};

for(const input_elem of document.getElementsByClassName("type_selector")){
	input_elem.addEventListener("change", ()=>onChecked(input_elem.value));
}

function onChecked(type){
	noLoop();
	const {init, draw} = window[type];
	init(width, height);
	window.draw = draw;
	loop();
}
})();