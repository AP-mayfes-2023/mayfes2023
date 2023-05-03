;(()=>{
	let timeout_id = null;
	const menu_icon_container = document.getElementById("menu_icon_container");
	const main_title = document.getElementById("main_title");
	const menu_toggle_display = document.getElementById("menu_toggle_display");
	const classList = menu_icon_container.classList;

	menu_toggle_display.addEventListener("change", evt=>{
		if(window.innerWidth <= 749){
			if(menu_toggle_display.checked){
				document.body.style.height = "100%";
				document.body.style.overflow = "hidden";
			}else{
				document.body.style.height = "";
				document.body.style.overflow = "";
			}
		}
	});

	let prev_pos = 0;
	document.addEventListener("scroll", evt=>{
		if(window.innerWidth <= 749){
			if(menu_toggle_display.checked){
				evt.preventDefault();
			}
			if(window.scrollY < prev_pos){
				// if(main_title.getBoundingClientRect().bottom < 0){
					if(classList.contains("hide") || !classList.contains("show")){
						classList.add("show");
						classList.remove("hide");
					}
				// }else{
					// if(classList.contains("show") || !classList.contains("hide")){
					// 	classList.add("hide");
					// 	classList.remove("show");
					// }
				// }
			}else{
				if(classList.contains("show") || !classList.contains("hide")){
					classList.add("hide");
					classList.remove("show");
				}
				if(timeout_id !== null){
					clearTimeout(timeout_id);
				}
				// if(main_title.getBoundingClientRect().bottom < 0){
					timeout_id = setTimeout(()=>{
						if(classList.contains("hide") || !classList.contains("show")){
							classList.add("show");
							classList.remove("hide");
						}
					}, 50);
				// }
			}
			prev_pos = window.scrollY;
		}
	});
})();