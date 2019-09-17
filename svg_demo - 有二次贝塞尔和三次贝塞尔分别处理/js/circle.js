console.log('circle绘制');
//判断是否移动
var isMove = false;
var svg = document.getElementById('svg_contain');

svg.addEventListener('mousedown',function(e){
	// console.log('点击事件',e);
	
	
	
	
	//生成半径
	var r = Math.round(Math.random()*100);
	// console.log('半径',r);
	//获取x,y坐标:相对于文档
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	//获取svg距离顶部的距离
	var svgT = document.getElementsByClassName('content')[0].offsetTop;
	//获取svg距离左侧的距离
	var svgL = document.getElementsByClassName('content')[0].offsetLeft;
	console.log(svgT,'svgH');
	var x =( e.pageX || e.clientX + scrollX) - svgL;
	var y = (e.pageY || e.clienty + scrollY) - svgT;
	console.log('坐标：',x,y);
	var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
	circle.setAttribute('cx',x);
	circle.setAttribute('cy',y);
	circle.setAttribute('r',r);
	circle.setAttribute('fill','red');
	circle.setAttribute('stroke','black');
	circle.addEventListener('mousedown',function(e){
		console.log('拖动',circle);
		isMove = true;
		svg.onmousemove = function(e){
				console.log('move');
				x = ( e.pageX || e.clientX + scrollX) - svgL;
				y = (e.pageY || e.clienty + scrollY) - svgT;
				console.log('拖动后新坐标',x,y)
				circle.setAttribute('cx',x);
				circle.setAttribute('cy',y);	
		}
		svg.onmouseup = function(e){
				console.log('up');
				svg.onmousemove = null;
				isMove = false;
		}
		//阻止冒泡
		e.stopPropagation();
	})
	if(!isMove){
		svg.appendChild(circle);
	}
	
})
