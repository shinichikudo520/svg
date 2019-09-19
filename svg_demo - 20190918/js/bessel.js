console.log('bessel绘制');
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
//二次贝塞尔曲线
var newpath;
//path的命令集合
var d;
//M命令
var M;
//Q命令
var Q;
var QParam1;
var QParam2;
// //T命令
// var T;
//C命令
var C;
var CParam1;
var CParam2;
var CParam3;
// //S命令
// var S;
// var SParam1;
// var SParam2;
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
//创建svgPath元素
function createSvgPath(x,y){
	var path = document.createElementNS('http://www.w3.org/2000/svg','path');
	M = 'M'+ x + ' ' + y;
	d = M;
	//console.log('d',d);
	path.setAttribute('d',d);
	path.setAttribute('fill','none');
	path.setAttribute('stroke','red');
	if(!isMove){
		svg.appendChild(path);
		newpath = path;
	}
}
//清空所有命令及上一条曲线的坐标
function clearCommand(){
	//console.log('清除所有命令集合...');
	d = '';
	M = '';
	Q = '';
	QParam1 = '';
	QParam2 = '';
	C = '';
	CParam1 = '';
	CParam2 = '';
	CParam3 = '';
}
//svgDown事件
var svgDown =  function(e){
	console.log('svg点击...');
	
	console.log('d',d);
	console.log('clickFirst',clickFirst);
	//获取坐标
	var coordinates = getCoordinates(e);
	var x = coordinates.x;
	var y = coordinates.y;
	//右键单击
	if(e.which == 3){
		if(clickFirst > 1){
			//console.log('右键单击');
			if(clickFirst == 2 || clickFirst == 3){
				d= M + Q;
			}else if(clickFirst == 4){
				d= M + C;
			}
			newpath.setAttribute('d',d);
			
			//清空初始量和命令集合
			clickFirst = 1;
			clearCommand();
			//阻止右键菜单弹出
			document.oncontextmenu = function(){return false};
			// debugger
		}
		return
	}
	//左键点击
	//第一次点击
	if(clickFirst == 1){
		createSvgPath(x,y);
	}
	//第二次点击 或者 第三次点击
	else if(clickFirst == 2 || clickFirst == 3){
		d= M + Q;
		newpath.setAttribute('d',d);
	}
	//第四次点击
	else if(clickFirst == 4 ){
		d= M + C;
		newpath.setAttribute('d',d);	
		//开始处理下一条曲线
		clickFirst = 1;
		createSvgPath(x,y);
	}
	
	clickFirst += 1;
	
}
var svgMove = function(e){
	//获取移动时坐标对象
	var coordinatesMove = getCoordinates(e);
	var x = coordinatesMove.x;
	var y = coordinatesMove.y;
	//临时的d命令集合
	var tempD;
	if(clickFirst > 1){
		if(clickFirst == 2){
			QParam2 = QParam1 = x + ' ' + y;
			Q = (' Q'+QParam1 + ','+ QParam2 );
			//console.log('Q',Q);
			tempD= M + Q;
			newpath.setAttribute('d',tempD);
		}
		else if(clickFirst == 3){
			QParam2 = x + ' ' + y;
			Q = (' Q'+QParam1 + ','+ QParam2 );
			//console.log('Q',Q);
			tempD= M + Q;
			newpath.setAttribute('d',tempD);
		}
		else if(clickFirst == 4){
			CParam1 = QParam1;
			CParam2 = QParam2;
			CParam3 = x + ' ' + y;
			C = (' C'+CParam1 + ','+ CParam2 + ',' +  CParam3);
			//console.log('C',C);
			tempD= M + C;
			newpath.setAttribute('d',tempD);	
		}
	}

}
//svg点击
svg.addEventListener('mousedown',svgDown)
svg.addEventListener('mousemove',svgMove);
console.log('bessel.js加载结束...');

//抛出事件名
window.svgDown = svgDown;
window.svgMove = svgMove;