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
	var x = (e.pageX || e.clientX + scrollX) - svgL;
	var y = (e.pageY || e.clientY + scrollY) - svgT;
	return {
		x,
		y
	}
}
//创建ellipse元素
function creatEllipse(){
	var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
	ellipse.setAttribute('cx',coordinatesObj1.x);
	ellipse.setAttribute('cy',coordinatesObj1.y);
	ellipse.setAttribute('rx',0);
	ellipse.setAttribute('ry',0);
	ellipse.setAttribute('fill','red');
	ellipse.setAttribute('stroke','black');	
	return ellipse
}
//svgDown事件
function svgDown(e){
	//单次点击
	if(clickOddOrEven){
		//获取坐标对象
		coordinatesObj1 = getCoordinates(e);	
		var ellipse = creatEllipse();
		ellipse.onmousedown = function(e){
			isMove = true;
			svg.onmousemove = function(e){
				coordinatesMove = getCoordinates(e);
				ellipse.setAttribute('cx',coordinatesMove.x);
				ellipse.setAttribute('cy',coordinatesMove.y);
			}		
			svg.onmouseup = function(e){
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
}
//svg移动事件
function svgMove(e){
	//获取坐标对象
	coordinatesObj2 = getCoordinates(e);
	if(coordinatesObj1 != undefined){
		var x1 = coordinatesObj1.x;
		var y1 = coordinatesObj1.y;
		var x2 = coordinatesObj2.x;
		var y2 = coordinatesObj2.y;
		var cx = x2 > x1 ? (x2 - x1)/2 + x1 : (x1 - x2)/2 + x2;
		var cy = y2 > y1 ? (y2 - y1)/2 + y1 : (y1 - y2)/2 + y2;
		var rx = Math.abs(x2 - x1) / 2;
		var ry = Math.abs(y2 - y1) / 2;
		newEllipse.setAttribute('cx',cx);
		newEllipse.setAttribute('cy',cy);
		newEllipse.setAttribute('rx',rx);
		newEllipse.setAttribute('ry',ry);
	}
}
//svg点击
svg.addEventListener('mousedown',svgDown)
svg.addEventListener('mousemove',svgMove);
