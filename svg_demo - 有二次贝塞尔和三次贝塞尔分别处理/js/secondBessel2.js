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
// //记录上一条曲线的控制点作为下一条曲线的起点
// var previousM;
//Q命令
var Q;
var QParam1;
var QParam2;
// //记录上一条曲线的终点作为下一条曲线的控制点
// var previousQ1;
//T命令
var T;
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
//svg点击
svg.addEventListener('mousedown',function(e){
	console.log('svg点击...');
	//获取坐标
	var coordinates = getCoordinates(e);
	var x = coordinates.x;
	var y = coordinates.y;
	//右键单击
	if(e.which == 3){
		if(clickFirst > 1){
			console.log('右键单击');
			if(clickFirst == 2){
				QParam2 = QParam1 = x + ' ' + y;
				Q = (' Q'+QParam1 + ','+ QParam2 );
				console.log('Q',Q);
				d= M + Q;
				newpath.setAttribute('d',d);
			}else if(clickFirst == 3){
				QParam2 = x + ' ' + y;
				Q = (' Q'+QParam1 + ','+ QParam2 );
				console.log('Q',Q);
				d= M + Q;
				newpath.setAttribute('d',d);
			}
			else{
				d += T;
				console.log(d);
			}
			newpath.setAttribute('d',d);
			
			//清空初始量
			clickFirst = 1;
			//阻止右键菜单弹出
			document.oncontextmenu = function(){return false};
		}
		return
	}
	//左键点击
	//第一次点击
	if(clickFirst == 1){
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		M = 'M'+ x + ' ' + y;
		d = M;
		console.log('d',d);
		path.setAttribute('d',d);
		path.setAttribute('fill','none');
		path.setAttribute('stroke','red');
		
		path.onmousedown = function(e){
			console.log('拖动',path);
			isMove = true;
			console.log('move');
			var moveBefore = getCoordinates(e);
			console.log('拖动前坐标',moveBefore);
			svg.onmousemove = function(e){
				coordinatesMove = getCoordinates(e);
				console.log('拖动时坐标',coordinatesMove);
				var moveX = Number(coordinatesMove.x - moveBefore.x);
				var moveY = Number(coordinatesMove.y - moveBefore.y);
				console.log('移动的距离',moveX,moveY);	
				// var tempArr = [];
				// for(var i = 0;i < pointsArr.length;i++){
				// 	pointNum = parseFloat(pointsArr[i]);
				// 	// console.log('pointNum',pointNum);
				// 	if(!isNaN(pointNum)){
				// 		if(i % 2 == 0){//x坐标
				// 			tempArr[i] = pointNum + moveX;
				// 		}else{//y坐标
				// 			tempArr[i] = pointNum + moveY;
				// 		}
				// 	}else{
				// 		tempArr[i] = '';
				// 	}
				// }
				// console.log('移动后坐标集数组',tempArr);
				// pathPoints = tempArr.join(' ');
				// console.log('移动后坐标集',pathPoints);
				// path.setAttribute('points',pathPoints);
			}		
			svg.onmouseup = function(e){
					console.log('up');
					svg.onmousemove = null;
					isMove = false;
			}
			// if(clickFirst > 1){
			// 	//阻止冒泡
			// 	e.stopPropagation();
			// }
		}
		if(!isMove){
			svg.appendChild(path);
			newpath = path;
		}
		
	}
	//第二次点击
	else if(clickFirst == 2){
		d= M + Q;
		newpath.setAttribute('d',d);
	}
	//第三次点击
	else if(clickFirst == 3 ){
		d= M + Q;
		newpath.setAttribute('d',d);
	}
	// 三次以上点击，一个点确定连续的二次贝塞尔曲线,使用T命令
	else{
		console.log(d)
		d += T;
		console.log(d);
		newpath.setAttribute('d',d);
	}
	
	clickFirst += 1;
	
})
svg.addEventListener('mousemove',function(e){
	//获取移动时坐标对象
	var coordinatesMove = getCoordinates(e);
	var x = coordinatesMove.x;
	var y = coordinatesMove.y;
	var tempD;
	if(clickFirst > 1){
		if(clickFirst == 2){
			QParam2 = QParam1 = x + ' ' + y;
			Q = (' Q'+QParam1 + ','+ QParam2 );
			console.log('Q',Q);
			tempD= M + Q;
			newpath.setAttribute('d',tempD);
		}
		else if(clickFirst == 3){
			QParam2 = x + ' ' + y;
			Q = (' Q'+QParam1 + ','+ QParam2 );
			console.log('Q',Q);
			tempD= M + Q;
			newpath.setAttribute('d',tempD);
		}
		else{
			T = ' T' + (x + ' ' + y);
			console.log(d)
			tempD = d + T;
			console.log(tempD);
			newpath.setAttribute('d',tempD);
		}
	}

});
console.log('secondBessel.js加载结束...');