console.log('circle1绘制');
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
//svg是否第一次点击
var clickOddOrEven = true;
//椭圆
var newEllipse;
//第一个坐标
var coordinatesObj1;
//第二个坐标
var coordinatesObj2;
//移动时的坐标
var coordinatesMove;
//判断是否移动
var isMove = false;
//获取坐标
function getCoordinates(e){	
	var x =( e.pageX || e.clientX + scrollX) - svgL;
	var y = (e.pageY || e.clienty + scrollY) - svgT;
	return {
		x,
		y
	}
}
//svg点击
svg.addEventListener('mousedown',function(e){
	console.log('svg点击...');
	//单次点击
	if(clickOddOrEven){
		//获取坐标对象
		coordinatesObj1 = getCoordinates(e);	
		var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		ellipse.setAttribute('cx',coordinatesObj1.x);
		ellipse.setAttribute('cy',coordinatesObj1.y);
		ellipse.setAttribute('rx',0);
		ellipse.setAttribute('ry',0);
		ellipse.setAttribute('fill','red');
		ellipse.setAttribute('stroke','black');	
		ellipse.onmousedown = function(e){
			console.log('拖动',ellipse);
			isMove = true;
			console.log('move');
			svg.onmousemove = function(e){
				coordinatesMove = getCoordinates(e);
				console.log('拖动时坐标',coordinatesMove);
				ellipse.setAttribute('cx',coordinatesMove.x);
				ellipse.setAttribute('cy',coordinatesMove.y);
			}		
			svg.onmouseup = function(e){
					console.log('up');
					svg.onmousemove = null;
					isMove = false;
			}
			if(clickOddOrEven){
				//阻止冒泡
				e.stopPropagation();
			}
		}
		if(!isMove){
			svg.appendChild(ellipse);
			newEllipse = ellipse;
		}
		clickOddOrEven = false;
	}else{
		coordinatesObj1 = undefined;
		clickOddOrEven = true;
	}
})
svg.addEventListener('mousemove',function(e){
	//获取坐标对象
	coordinatesObj2 = getCoordinates(e);
	if(coordinatesObj1 != undefined){
		console.log(coordinatesObj1,coordinatesObj2);
		var x1 = coordinatesObj1.x;
		var y1 = coordinatesObj1.y;
		var x2 = coordinatesObj2.x;
		var y2 = coordinatesObj2.y;
		var cx = x2 > x1 ? (x2 - x1)/2 + x1 : (x1 - x2)/2 + x2;
		var cy = y2 > y1 ? (y2 - y1)/2 + y1 : (y1 - y2)/2 + y2;
		console.log('椭圆的圆心坐标',cx,cy);
		var rx = Math.abs(x2 - x1) / 2;
		var ry = Math.abs(y2 - y1) / 2;
		console.log('椭圆的半径',rx,ry);
		newEllipse.setAttribute('cx',cx);
		newEllipse.setAttribute('cy',cy);
		newEllipse.setAttribute('rx',rx);
		newEllipse.setAttribute('ry',ry);
	}
});
console.log('circle.js加载结束...');