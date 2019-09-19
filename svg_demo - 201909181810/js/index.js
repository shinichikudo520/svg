//svgDom元素
var svg = document.getElementById('svg_contain');
//获取坐标所需常数
//获取x,y坐标:相对于文档
var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
//获取svg距离顶部的距离
var svgT = document.getElementsByClassName('content')[0].offsetTop;
//获取svg距离左侧的距离
var svgL = document.getElementsByClassName('content')[0].offsetLeft;
//获取坐标
function getCoordinates(e){	
	var x =	(e.pageX || (e.clientX + scrollX)) - svgL;
	var y = (e.pageY || (e.clientY + scrollY)) - svgT;
	return {
		x,
		y
	}
}
function clickBtn(clickChoose){
	//加载不同的js
	var script=document.createElement("script");
	script.type="text/javascript";
	script.src="./js/"+clickChoose+".js";
	var svgScript = document.getElementById('svgScript');
	var oldchild = svgScript.children[0];
	if(oldchild == undefined){
		svgScript.appendChild(script);
	}else{
		svgScript.replaceChild(script,oldchild);
	}
	
	//解绑svg的事件
	var svg = document.getElementById('svg_contain'); 
	svg.onmousemove = null;
	svg.onmouseup = null;
	svg.removeEventListener('mousedown',window.svgDown,false);
	svg.removeEventListener('mousemove',window.svgMove,false);
}