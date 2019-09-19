//svg是否第一次点击
var clickFirst = true;
//多边形
var newPolygon;
//坐标集
var points = '';
//移动时的坐标
var coordinatesMove;
//判断是否移动
var isMove = false;
//将点坐标添加到坐标集中
function addPoint(coordinates){
	points += (coordinates.x + ' ' + coordinates.y + ' ');
}
//创建polygon元素
function creatPolygon(coordinates){
	var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
	//将点添加到坐标集中
	addPoint(coordinates);
	polygon.setAttribute('points',points);
	polygon.setAttribute('fill','red');
	polygon.setAttribute('stroke','black');
	return polygon
}

//svgDown事件
function svgDown(e){
	//获取坐标
	var coordinates = getCoordinates(e);

	if(e.which == 3){
		if(!clickFirst){
			//将点添加到坐标集中
			addPoint(coordinates);
			newPolygon.setAttribute('points',points);
			
			clickFirst = true;
			points = '';
			//阻止右键菜单弹出
			document.oncontextmenu = function(){return false};
		}
		return
	}
	//左键点击
	//第一次点击
	if(clickFirst){	
		var polygon = creatPolygon(coordinates);
		polygon.onmousedown = function(e){
			var polygonPoints = polygon.getAttribute('points');
			isMove = true;
			var pointsArr = polygonPoints.split(" ");
			var moveBefore = getCoordinates(e);
			svg.onmousemove = function(e){
				coordinatesMove = getCoordinates(e);
				var moveX = Number(coordinatesMove.x - moveBefore.x);
				var moveY = Number(coordinatesMove.y - moveBefore.y);
				var tempArr = [];
				for(var i = 0;i < pointsArr.length;i++){
					pointNum = parseFloat(pointsArr[i]);
					if(!isNaN(pointNum)){
						if(i % 2 == 0){//x坐标
							tempArr[i] = pointNum + moveX;
						}else{//y坐标
							tempArr[i] = pointNum + moveY;
						}
					}else{
						tempArr[i] = '';
					}
				}
				polygonPoints = tempArr.join(' ');
				polygon.setAttribute('points',polygonPoints);
			}		
			svg.onmouseup = function(e){
					svg.onmousemove = null;
					isMove = false;
			}
			if(clickFirst){
				//阻止冒泡
				e.stopPropagation();
			}
		}
		if(!isMove){
			svg.appendChild(polygon);
			newPolygon = polygon;
		}
		clickFirst = false;
	}
	//不是第一次点击
	else{
		//将点添加到坐标集中
		addPoint(coordinates);
		newPolygon.setAttribute('points',points);
	}
}
function svgMove(e){
	if(!clickFirst){
		//获取移动时坐标对象
		var coordinatesMove = getCoordinates(e);
		//临时坐标集
		var pointsTemp = points + (coordinatesMove.x + ' ' + coordinatesMove.y + ' ');
		
		newPolygon.setAttribute('points',pointsTemp);
	}

}
//svg点击
svg.addEventListener('mousedown',svgDown);
svg.addEventListener('mousemove',svgMove);
