console.log('polygon绘制');

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
var clickFirst = true;
//多边形
var newPolygon;
//坐标集
var points = '';
// //第一个坐标
// var coordinatesObj1;
// //第二个坐标
// var coordinatesObj2;
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

//将点坐标添加到坐标集中
function addPoint(coordinates){
	points += (coordinates.x + ' ' + coordinates.y + ' ');
}


//svg点击
svg.addEventListener('mousedown',function(e){
	console.log('svg点击...');
	//获取坐标
	var coordinates = getCoordinates(e);

	if(e.which == 3){
		if(!clickFirst){
			console.log('右键单击');
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
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		//将点添加到坐标集中
		addPoint(coordinates);
		console.log(points);
		polygon.setAttribute('points',points);
		polygon.setAttribute('fill','red');
		polygon.setAttribute('stroke','black');
		
		polygon.onmousedown = function(e){
			console.log('拖动',polygon);
			var polygonPoints = polygon.getAttribute('points');
			console.log('坐标集',polygonPoints);
			isMove = true;
			console.log('move');
			var pointsArr = polygonPoints.split(" ");
			console.log('移动前坐标集数组',pointsArr);
			var moveBefore = getCoordinates(e);
			console.log('拖动前坐标',moveBefore);
			svg.onmousemove = function(e){
				coordinatesMove = getCoordinates(e);
				console.log('拖动时坐标',coordinatesMove);
				var moveX = Number(coordinatesMove.x - moveBefore.x);
				var moveY = Number(coordinatesMove.y - moveBefore.y);
				console.log('移动的距离',moveX,moveY);	
				var tempArr = [];
				for(var i = 0;i < pointsArr.length;i++){
					pointNum = parseFloat(pointsArr[i]);
					// console.log('pointNum',pointNum);
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
				console.log('移动后坐标集数组',tempArr);
				polygonPoints = tempArr.join(' ');
				console.log('移动后坐标集',polygonPoints);
				polygon.setAttribute('points',polygonPoints);
			}		
			svg.onmouseup = function(e){
					console.log('up');
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
	
})
svg.addEventListener('mousemove',function(e){
	if(!clickFirst){
		//获取移动时坐标对象
		var coordinatesMove = getCoordinates(e);
		//临时坐标集
		var pointsTemp = points + (coordinatesMove.x + ' ' + coordinatesMove.y + ' ');
		
		newPolygon.setAttribute('points',pointsTemp);
	}

});
console.log('polygon.js加载结束...');