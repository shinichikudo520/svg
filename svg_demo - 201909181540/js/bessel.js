console.log('bessel绘制');
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
//C命令
var C;
var CParam1;
var CParam2;
var CParam3;
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
	newpath = '';
}
//svgDown事件
function svgDown(e){
	console.log('svg点击...');
	console.log('clickFirst',clickFirst);
	//获取坐标
	var coordinates = getCoordinates(e);
	var x = coordinates.x;
	var y = coordinates.y;
	switch(e.which){
		//左键点击
		case 1:
			switch(clickFirst){
				//第一次点击
				case 1:
					createSvgPath(x,y);
					break;
				//第二次点击 或者 第三次点击
				case 2:
				case 3:
					if(Q != undefined && Q != ''){
						d= M + Q;
						newpath.setAttribute('d',d);
					}else{
						d = M;
						newpath.setAttribute('d',d);
						clickFirst = 1;
					}
					break;
				//第四次点击
				case 4:
					console.log('C',C);
					//防止第四次点击和第三次点击是双击行为
					//即第四点的坐标与第三点一致，看做同一点，不构成三次贝塞尔曲线
					if(C != undefined && C != '' ){
						d= M + C;
						newpath.setAttribute('d',d);
							
						//开始处理下一条曲线
						//清空初始量和命令集合
						clickFirst = 1;
						clearCommand();
						createSvgPath(x,y);
					}else{
						d= M + Q;
						newpath.setAttribute('d',d);
						clickFirst = 3;
					}
					break;
			}
			console.log('d',d);
			console.log('path',newpath);
			clickFirst += 1;
			break;
		//右键点击
		case 3:
			if(clickFirst > 1){
				switch(clickFirst){
					case 2:
					case 3:
						d= M + Q;
						break;
					case 4:
						//防止第四次点击和第三次点击是双击行为
						//即第四点的坐标与第三点一致，看做同一点，不构成三次贝塞尔曲线
						if(C != undefined && C != '' ){
							d= M + C;
						}else{
							d= M + Q;
						}
						break;
				}
				newpath.setAttribute('d',d);				
				//清空初始量和命令集合
				clickFirst = 1;
				clearCommand();
				//阻止右键菜单弹出
				document.oncontextmenu = function(){return false};
			}
			break;
		
	}
}
function svgMove(e){
	//获取移动时坐标对象
	var coordinatesMove = getCoordinates(e);
	var x = coordinatesMove.x;
	var y = coordinatesMove.y;
	//临时的d命令集合
	var tempD;
	if(clickFirst > 1){
		switch(clickFirst){
			case 2:
				QParam2 = QParam1 = x + ' ' + y;
				Q = (' Q'+QParam1 + ','+ QParam2 );
				//console.log('Q',Q);
				tempD= M + Q;
				break;
			case 3:
				QParam2 = x + ' ' + y;
				Q = (' Q'+QParam1 + ','+ QParam2 );
				//console.log('Q',Q);
				tempD= M + Q;
				break;
			case 4:
				CParam1 = QParam1;
				CParam2 = QParam2;
				CParam3 = x + ' ' + y;
				C = (' C'+CParam1 + ','+ CParam2 + ',' +  CParam3);
				//console.log('C',C);
				tempD= M + C;
				break;
		}
		newpath.setAttribute('d',tempD);
	}

}
//svg点击
svg.addEventListener('mousedown',svgDown)
svg.addEventListener('mousemove',svgMove);
console.log('bessel.js加载结束...');
