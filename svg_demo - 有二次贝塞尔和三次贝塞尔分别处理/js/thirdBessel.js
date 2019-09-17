console.log('thirdBessel绘制');
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

//svg点击次数
var clickFirst = 1;
//三次贝塞尔曲线
var newpath;
//path的命令集合
var d;
//M命令
var M;
//C命令
var C;
var CParam1;
var CParam2;
var CParam3;
//S命令
var S;
var SParam1;
var SParam2;
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
			if(clickFirst == 4){
				d= M + C;
				// newpath.setAttribute('d',d);
			}else if(clickFirst > 4){
				d += S;
				console.log(d);
			}
			// else{
			// 	d += T;
			// 	console.log(d);
			// }
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
		
		// path.onmousedown = function(e){
		// 	console.log('拖动',path);
		// 	isMove = true;
		// 	console.log('move');
		// 	var moveBefore = getCoordinates(e);
		// 	console.log('拖动前坐标',moveBefore);
		// 	svg.onmousemove = function(e){
		// 		coordinatesMove = getCoordinates(e);
		// 		console.log('拖动时坐标',coordinatesMove);
		// 		var moveX = Number(coordinatesMove.x - moveBefore.x);
		// 		var moveY = Number(coordinatesMove.y - moveBefore.y);
		// 		console.log('移动的距离',moveX,moveY);	
		// 		// var tempArr = [];
		// 		// for(var i = 0;i < pointsArr.length;i++){
		// 		// 	pointNum = parseFloat(pointsArr[i]);
		// 		// 	// console.log('pointNum',pointNum);
		// 		// 	if(!isNaN(pointNum)){
		// 		// 		if(i % 2 == 0){//x坐标
		// 		// 			tempArr[i] = pointNum + moveX;
		// 		// 		}else{//y坐标
		// 		// 			tempArr[i] = pointNum + moveY;
		// 		// 		}
		// 		// 	}else{
		// 		// 		tempArr[i] = '';
		// 		// 	}
		// 		// }
		// 		// console.log('移动后坐标集数组',tempArr);
		// 		// pathPoints = tempArr.join(' ');
		// 		// console.log('移动后坐标集',pathPoints);
		// 		// path.setAttribute('points',pathPoints);
		// 	}		
		// 	svg.onmouseup = function(e){
		// 			console.log('up');
		// 			svg.onmousemove = null;
		// 			isMove = false;
		// 	}
		// 	// if(clickFirst > 1){
		// 	// 	//阻止冒泡
		// 	// 	e.stopPropagation();
		// 	// }
		// }
		if(!isMove){
			svg.appendChild(path);
			newpath = path;
		}
		
	}
	//第二次点击
	else if(clickFirst == 2){
		d= M + C;
		newpath.setAttribute('d',d);
	}
	//第三次点击
	else if(clickFirst == 3 ){
		d= M + C;
		newpath.setAttribute('d',d);
	}
	//第四次点击
	else if(clickFirst == 4 ){
		d= M + C;
		newpath.setAttribute('d',d);
	}
	// // 四次以上点击，一个点确定连续的三次贝塞尔曲线,使用T命令
	else{
		// debugger
		
		if((clickFirst - 4) % 2 == 1){
			console.log('第五次S',S);
		}else{
			console.log('第六次S',S);
			console.log(d);
			d += S;
			console.log(d);
			newpath.setAttribute('d',d);
		}
		
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
			CParam3 = CParam2 = CParam1 = x + ' ' + y;
			C = (' C'+CParam1 + ','+ CParam2 + ',' +  CParam3);
			console.log('C',C);
			tempD= M + C;
			newpath.setAttribute('d',tempD);
		}
		else if(clickFirst == 3){
			CParam3 = CParam2 = x + ' ' + y;
			C = (' C'+CParam1 + ','+ CParam2 + ',' +  CParam3);
			console.log('C',C);
			tempD= M + C;
			newpath.setAttribute('d',tempD);
		}
		else if(clickFirst == 4){
			CParam3 = x + ' ' + y;
			C = (' C'+CParam1 + ','+ CParam2 + ',' +  CParam3);
			console.log('C',C);
			tempD= M + C;
			newpath.setAttribute('d',tempD);
		}
		else{
			console.log('clickFirst',clickFirst);
			//5
			if((clickFirst - 4) % 2 == 1){
				SParam2 = SParam1 = x + ' ' + y;	
			}
			//6
			else{//(clickFirst - 4) % 2 == 2
				SParam2 =  x + ' ' + y;
			}
			S = (' S' + SParam1 + ',' + SParam2);
			console.log(d)
			tempD = d + S;
			console.log(tempD);
			newpath.setAttribute('d',tempD);
		}
	}

});
console.log('thirdBessel.js加载结束...');