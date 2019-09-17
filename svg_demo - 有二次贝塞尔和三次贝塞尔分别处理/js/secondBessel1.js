console.log('secondBessel绘制');
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
// //是否进行循环，连续绘制平滑的曲线
// var continuousDrawing = true;
//svg点击次数
var clickFirst = 1;
//二次贝塞尔曲线
var newpath;
//path的命令集合
var d;
//M命令
var M;
//记录上一条曲线的控制点作为下一条曲线的起点
var previousM;
//Q命令
var Q;
var QParam1;
//记录上一条曲线的终点作为下一条曲线的控制点
var previousQ1;
var QParam2;
//T命令
var T = ' T';
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
// svg左键点击事件
function svgClickLeft(clickFirst,x,y){
	// debugger
	//左键点击
	console.log(clickFirst,x,y)
	//第一次点击
	if(clickFirst == 1){
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		// M = 'M'+ x + ' ' + y;
		if(previousM == undefined){
			M = 'M'+ x + ' ' + y;
		}else{
			M = 'M'+ previousM;
		}
		d = M;
		console.log('d',d);
		path.setAttribute('d',d);
		path.setAttribute('fill','none');
		path.setAttribute('stroke','red');
		
		// path.onmousedown = function(e){
		// 	console.log('拖动',path);
		// 	var pathPoints = path.getAttribute('points');
		// 	console.log('坐标集',pathPoints);
		// 	isMove = true;
		// 	console.log('move');
		// 	var pointsArr = pathPoints.split(" ");
		// 	console.log('移动前坐标集数组',pointsArr);
		// 	var moveBefore = getCoordinates(e);
		// 	console.log('拖动前坐标',moveBefore);
		// 	svg.onmousemove = function(e){
		// 		coordinatesMove = getCoordinates(e);
		// 		console.log('拖动时坐标',coordinatesMove);
		// 		var moveX = Number(coordinatesMove.x - moveBefore.x);
		// 		var moveY = Number(coordinatesMove.y - moveBefore.y);
		// 		console.log('移动的距离',moveX,moveY);	
		// 		var tempArr = [];
		// 		for(var i = 0;i < pointsArr.length;i++){
		// 			pointNum = parseFloat(pointsArr[i]);
		// 			// console.log('pointNum',pointNum);
		// 			if(!isNaN(pointNum)){
		// 				if(i % 2 == 0){//x坐标
		// 					tempArr[i] = pointNum + moveX;
		// 				}else{//y坐标
		// 					tempArr[i] = pointNum + moveY;
		// 				}
		// 			}else{
		// 				tempArr[i] = '';
		// 			}
		// 		}
		// 		console.log('移动后坐标集数组',tempArr);
		// 		pathPoints = tempArr.join(' ');
		// 		console.log('移动后坐标集',pathPoints);
		// 		path.setAttribute('points',pathPoints);
		// 	}		
		// 	svg.onmouseup = function(e){
		// 			console.log('up');
		// 			svg.onmousemove = null;
		// 			isMove = false;
		// 	}
		// 	if(clickFirst){
		// 		//阻止冒泡
		// 		e.stopPropagation();
		// 	}
		// }
		if(!isMove){
			svg.appendChild(path);
			newpath = path;
		}
		// clickFirst += 1;
		
	}
	//第二次点击
	else if(clickFirst == 2){
		if(previousQ1 == undefined){
			QParam1 = x + ' ' + y;
			QParam2 = QParam1;
			Q = (' Q'+QParam1 + ','+ QParam2 );
			console.log('Q',Q);
			d= M + Q;
			newpath.setAttribute('d',d);
			//记录上一条曲线的控制点作为下一条曲线的起点
		}else{
			QParam1 = previousQ1;
		}
		previousM = QParam1;
		// clickFirst += 1;
	}
	//第三次点击
	else if(clickFirst == 3 ){
		QParam2 = x + ' ' + y;
		Q = (' Q'+QParam1 + ','+ QParam2 );
		console.log('Q',Q);
		d= M + Q;
		newpath.setAttribute('d',d);
		
		//记录上一条曲线的终点作为下一条曲线的控制点
		previousQ1 = QParam2;
		// clickFirst = 1;
	}
	// 三次以上点击，一个点确定连续的二次贝塞尔曲线
	else{
		// var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		// d = 'M' + previousM + ' Q' + previousQ1 + ',' + x + ' ' + y;
		// console.log('d',d);
		// path.setAttribute('d',d);
		// path.setAttribute('fill','none');
		// path.setAttribute('stroke','red');
		// if(!isMove){
		// 	svg.appendChild(path);
		// 	newpath = path;
		// }
		svgClickLeft(1,x,y);
		svgClickLeft(2,x,y);
		svgClickLeft(3,x,y);
	}
	
	// clickFirst += 1;
}
//svg点击
svg.addEventListener('mousedown',function(e){
	console.log('svg点击...');
	//获取坐标
	var coordinates = getCoordinates(e);
	var x = coordinates.x;
	var y = coordinates.y;
	//右键单击
	if(e.which == 3){
		// if(!clickFirst){
		// 	console.log('右键单击');
		// 	//将点添加到坐标集中
		// 	addPoint(coordinates);
		// 	newpath.setAttribute('points',points);
		// 	
		// 	clickFirst = true;
		// 	points = '';
		// 	//阻止右键菜单弹出
		// 	document.oncontextmenu = function(){return false};
		// }
		// return
	}
	svgClickLeft(clickFirst,x,y);
	clickFirst += 1;
	
})
svg.addEventListener('mousemove',function(e){
	// if(!clickFirst){
	// 	//获取移动时坐标对象
	// 	var coordinatesMove = getCoordinates(e);
	// 	//临时坐标集
	// 	var pointsTemp = points + (coordinatesMove.x + ' ' + coordinatesMove.y + ' ');
	// 	
	// 	newpath.setAttribute('points',pointsTemp);
	// }

});
console.log('secondBessel.js加载结束...');