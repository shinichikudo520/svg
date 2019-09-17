function clickBtn(clickChoose){
	console.log(clickChoose);
	//加载不同的js
	var script=document.createElement("script");
	script.type="text/javascript";
	script.src="./js/"+clickChoose+".js";
	var svgScript = document.getElementById('svgScript');
	var oldchild = svgScript.children[0];
	// console.log(oldchild);
	if(oldchild == undefined){
		svgScript.appendChild(script);
	}else{
		svgScript.replaceChild(script,oldchild);
	}
	
	//解绑svg的事件
	var svg = document.getElementById('svg_contain'); 
	// cloneSvg = svg.cloneNode(true);	
	// // var childs = cloneSvg.childNodes; 
	// // for(var i = childs .length - 1; i >= 0; i--) {
	// //   cloneSvg.removeChild(childs[i]);
	// // }
	// var content = document.getElementsByClassName('content')[0];
	// content.replaceChild(cloneSvg,content.children[0]);
	// 
	svg.onmousemove = null;
	svg.onmouseup = null;
	svg.removeEventListener('mousedown',window.svgDown,false);
	svg.removeEventListener('mousemove',window.svgMove,false);
}