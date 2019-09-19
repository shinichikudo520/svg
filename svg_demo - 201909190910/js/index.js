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
//svg的mouseDown的绑定事件名
var svgMouseDown;
//svg的mouseMove的绑定事件名
var svgMouseMove;
// svg画布操作获取坐标
function svgGetCoordinates(e){
	var x = e.offsetX;
	var y = e.offsetY;
	return {
		x,
		y
	}
}
//获取坐标
function getCoordinates(e){	
	var x =	(e.pageX || (e.clientX + scrollX)) - svgL;
	var y = (e.pageY || (e.clientY + scrollY)) - svgT;
	return {
		x,
		y
	}
}
//选择绘制图形的种类
function clickBtn(clickChoose){
	//解绑svg的事件
	svg.onmousemove = null;
	svg.onmouseup = null;
	svg.removeEventListener('mousedown',svgMouseDown,false);
	svg.removeEventListener('mousemove',svgMouseMove,false);
	//调用不同的函数
	switch(clickChoose){
		//绘制矩形
		case 'rect':
			drawRect();
			break;
		//绘制圆形
		case 'ellipse':
			drawEllipse();
			break;
		//绘制多边形
		case 'polygon':
			drawPolygon();
			break;
		//绘制贝塞尔曲线
		case 'bessel':
			drawBessel();
			break;
	}
	
}
//创建svg元素
function creatSvgEl(type,props){
	var type = document.createElementNS('http://www.w3.org/2000/svg',type);
	for(var key in props){
		type.setAttribute(key,props[key]);
	}
	return type
}
//创建rect元素
function creatRect(coordinatesObj1){
	var props = {
		'x':coordinatesObj1.x,
		'y':coordinatesObj1.y,
		'width':0,
		'height':0,
		'fill':'red',
		'stroke':'black'
	}
	var rect = creatSvgEl('rect',props);
	return rect
}
//创建ellipse元素
function creatEllipse(coordinatesObj1){
	var props = {
		'cx':coordinatesObj1.x,
		'cy':coordinatesObj1.y,
		'rx':0,
		'ry':0,
		'fill':'red',
		'stroke':'black'
	}
	var ellipse = creatSvgEl('ellipse',props);
	return ellipse
}
//ellipse元素：将点坐标添加到坐标集points中
function addPoint(svgEl,coordinates){
	svgEl.points += (coordinates.x + ' ' + coordinates.y + ' ');
}
//创建polygon元素
function creatPolygon(svgEl,coordinates){
	//将点添加到坐标集中
	addPoint(svgEl,coordinates);
	var props = {
		'points':svgEl.points,
		'fill':'red',
		'stroke':'black'
	}
	var polygon = creatSvgEl('polygon',props);
	return polygon
}
//创建svgPath元素
function createSvgPath(svgEl,x,y){
	svgEl.M = 'M'+ x + ' ' + y;
	svgEl.d = svgEl.M;
	var props = {
		'd':svgEl.d,
		'fill':'none',
		'stroke':'red'
	}
	var path = creatSvgEl('path',props);
	return path
}
//svgDown事件
function svgDown(e,svgEl,type){
	switch(type){
		case 'rect':
			rectDown(e,svgEl);
			break;
		case 'ellipse':
			ellipseDown(e,svgEl);
			break;
		case 'polygon':
			polygonDown(e,svgEl);
			break;
		case 'bessel':
			besselDown(e,svgEl);
			break;
	}	
}
//svg移动事件
function svgMove(e,svgEl,type){
	switch(type){
		case 'rect':
			rectMove(e,svgEl);
			break;
		case 'ellipse':
			ellipseMove(e,svgEl);
			break;
		case 'polygon':
			polygonMove(e,svgEl);
			break;
		case 'bessel':
			besselMove(e,svgEl);
			break;
	}	
}
//绘制rect时svgDown事件
function rectDown(e,svgEl){
	//单次点击
	if(svgEl.clickOddOrEven){
		//获取坐标对象
		svgEl.coordinatesObj1 = svgGetCoordinates(e);	
		var rect = creatRect(svgEl.coordinatesObj1);
		rect.onmousedown = function(e){
			svgEl.isMove = true;
			var moveBefore = getCoordinates(e);
			var moveBeforeX = rect.getAttribute('x');
			var moveBeforeY = rect.getAttribute('y');
			svg.onmousemove = function(e){
				svgEl.coordinatesMove = getCoordinates(e);
				var moveX = Number(moveBeforeX) + Number(svgEl.coordinatesMove.x - moveBefore.x);
				var moveY = Number(moveBeforeY) + Number(svgEl.coordinatesMove.y - moveBefore.y);
				rect.setAttribute('x',moveX);
				rect.setAttribute('y',moveY);
			}		
			svg.onmouseup = function(e){
					svg.onmousemove = null;
					svgEl.isMove = false;
			}
			if(svgEl.clickOddOrEven){
				//阻止冒泡
				e.stopPropagation();
			}
		}
		if(!svgEl.isMove){
			svg.appendChild(rect);
			svgEl.newrect = rect;
		}
		svgEl.clickOddOrEven = false;
	}else{
		svgEl.coordinatesObj1 = undefined;
		svgEl.clickOddOrEven = true;
	}
}
//绘制rect时svgMove事件
function rectMove(e,svgEl){
	//获取坐标对象
	svgEl.coordinatesObj2 = svgGetCoordinates(e);
	if(svgEl.coordinatesObj1 != undefined){
		var x1 = svgEl.coordinatesObj1.x;
		var y1 = svgEl.coordinatesObj1.y;
		var x2 = svgEl.coordinatesObj2.x;
		var y2 = svgEl.coordinatesObj2.y;
		var width = x2 - x1;
		var height =y2 - y1;
		//moveTo参数水平偏移量x
		var x;
		//moveTo参数垂直偏移量y
		var y;
		if(width > 0){
			x = x1;
		}else{
			x = x2;
			width = Math.abs(width);
		}
		if(height > 0){
			y = y1;
		}else{
			y = y2;
			height = Math.abs(height);
		}
		svgEl.newrect.setAttribute('x',x);
		svgEl.newrect.setAttribute('width',width);
		svgEl.newrect.setAttribute('y',y);
		svgEl.newrect.setAttribute('height',Math.abs(height));
	}
}
//绘制ellipse时的svgDown事件
function ellipseDown(e,svgEl){
	//单次点击
	if(svgEl.clickOddOrEven){
		//获取坐标对象
		svgEl.coordinatesObj1 = svgGetCoordinates(e);	
		var ellipse = creatEllipse(svgEl.coordinatesObj1);
		ellipse.onmousedown = function(e){
			svgEl.isMove = true;
			svg.onmousemove = function(e){
				svgEl.coordinatesMove = getCoordinates(e);
				ellipse.setAttribute('cx',svgEl.coordinatesMove.x);
				ellipse.setAttribute('cy',svgEl.coordinatesMove.y);
			}		
			svg.onmouseup = function(e){
					svg.onmousemove = null;
					svgEl.isMove = false;
			}
			if(svgEl.clickOddOrEven){
				//阻止冒泡
				e.stopPropagation();
			}
		}
		if(!svgEl.isMove){
			svg.appendChild(ellipse);
			svgEl.newEllipse = ellipse;
		}
		svgEl.clickOddOrEven = false;
	}else{
		svgEl.coordinatesObj1 = undefined;
		svgEl.clickOddOrEven = true;
	}
}
//绘制ellipse时svgMove事件
function ellipseMove(e,svgEl){
	//获取坐标对象
	svgEl.coordinatesObj2 = svgGetCoordinates(e);
	if(svgEl.coordinatesObj1 != undefined){
		var x1 = svgEl.coordinatesObj1.x;
		var y1 = svgEl.coordinatesObj1.y;
		var x2 = svgEl.coordinatesObj2.x;
		var y2 = svgEl.coordinatesObj2.y;
		var cx = x2 > x1 ? (x2 - x1)/2 + x1 : (x1 - x2)/2 + x2;
		var cy = y2 > y1 ? (y2 - y1)/2 + y1 : (y1 - y2)/2 + y2;
		var rx = Math.abs(x2 - x1) / 2;
		var ry = Math.abs(y2 - y1) / 2;
		svgEl.newEllipse.setAttribute('cx',cx);
		svgEl.newEllipse.setAttribute('cy',cy);
		svgEl.newEllipse.setAttribute('rx',rx);
		svgEl.newEllipse.setAttribute('ry',ry);
	}
}
//绘制polygon时的svgDown事件
function polygonDown(e,svgEl){
	//获取坐标
	var coordinates = svgGetCoordinates(e);
		
	if(e.which == 3){
		if(!svgEl.clickFirst){
			//将点添加到坐标集中
			addPoint(svgEl,coordinates);
			svgEl.newPolygon.setAttribute('points',svgEl.points);
			
			svgEl.clickFirst = true;
			svgEl.points = '';
			//阻止右键菜单弹出
			document.oncontextmenu = function(){return false};
		}
		return
	}
	//左键点击
	//第一次点击
	if(svgEl.clickFirst){	
		var polygon = creatPolygon(svgEl,coordinates);
		polygon.onmousedown = function(e){
			var polygonPoints = polygon.getAttribute('points');
			svgEl.isMove = true;
			var pointsArr = polygonPoints.split(" ");
			var moveBefore = getCoordinates(e);
			svg.onmousemove = function(e){
				svgEl.coordinatesMove = getCoordinates(e);
				var moveX = Number(svgEl.coordinatesMove.x - moveBefore.x);
				var moveY = Number(svgEl.coordinatesMove.y - moveBefore.y);
				var tempArr = [];
				for(var i = 0;i < pointsArr.length;i++){
					var pointNum = parseFloat(pointsArr[i]);
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
					svgEl.isMove = false;
			}
			if(svgEl.clickFirst){
				//阻止冒泡
				e.stopPropagation();
			}
		}
		if(!svgEl.isMove){
			svg.appendChild(polygon);
			svgEl.newPolygon = polygon;
		}
		svgEl.clickFirst = false;
	}
	//不是第一次点击
	else{
		//将点添加到坐标集中
		addPoint(svgEl,coordinates);
		svgEl.newPolygon.setAttribute('points',svgEl.points);
	}
}
//绘制ellipse时svgMove事件
function polygonMove(e,svgEl){
	if(!svgEl.clickFirst){
		//获取移动时坐标对象
		svgEl.coordinatesMove = svgGetCoordinates(e);
		//临时坐标集
		var pointsTemp = svgEl.points + (svgEl.coordinatesMove.x + ' ' + svgEl.coordinatesMove.y + ' ');
		
		svgEl.newPolygon.setAttribute('points',pointsTemp);
	}
}
//绘制bessel时的svgDown事件
function besselDown(e,svgEl){
	//获取坐标
	var coordinates = svgGetCoordinates(e);
	var x = coordinates.x;
	var y = coordinates.y;
	switch(e.which){
		//左键点击
		case 1:
			switch(svgEl.clickFirst){
				//第一次点击
				case 1:
					var path = createSvgPath(svgEl,x,y);
					if(!svgEl.isMove){
						svg.appendChild(path);
						svgEl.newpath = path;
					}
					break;
				//第二次点击 或者 第三次点击
				case 2:
				case 3:
					if(svgEl.Q != undefined && svgEl.Q != ''){
						svgEl.d= svgEl.M + svgEl.Q;
						svgEl.newpath.setAttribute('d',svgEl.d);
					}else{
						svgEl.d = svgEl.M;
						svgEl.newpath.setAttribute('d',svgEl.d);
						svgEl.clickFirst = 1;
					}
					break;
				//第四次点击
				case 4:
					//防止第四次点击和第三次点击是双击行为
					//即第四点的坐标与第三点一致，看做同一点，不构成三次贝塞尔曲线
					if(svgEl.C != undefined && svgEl.C != '' ){
						svgEl.d= svgEl.M + svgEl.C;
						svgEl.newpath.setAttribute('d',svgEl.d);
							
						//开始处理下一条曲线
						//清空初始量和命令集合
						svgEl.clickFirst = 1;
						clearCommand(svgEl);
						path = createSvgPath(svgEl,x,y);
						if(!svgEl.isMove){
							svg.appendChild(path);
							svgEl.newpath = path;
						}
					}else{
						svgEl.d= svgEl.M + svgEl.Q;
						svgEl.newpath.setAttribute('d',svgEl.d);
						svgEl.clickFirst = 3;
					}
					break;
			}
			svgEl.clickFirst += 1;
			break;
		//右键点击
		case 3:
			if(svgEl.clickFirst > 1){
				switch(svgEl.clickFirst){
					case 2:
					case 3:
						svgEl.d= svgEl.M + svgEl.Q;
						break;
					case 4:
						//防止第四次点击和第三次点击是双击行为
						//即第四点的坐标与第三点一致，看做同一点，不构成三次贝塞尔曲线
						if(svgEl.C != undefined && svgEl.C != '' ){
							svgEl.d= svgEl.M + svgEl.C;
						}else{
							svgEl.d= svgEl.M + svgEl.Q;
						}
						break;
				}
				svgEl.newpath.setAttribute('d',svgEl.d);				
				//清空初始量和命令集合
				svgEl.clickFirst = 1;
				clearCommand(svgEl);
				//阻止右键菜单弹出
				document.oncontextmenu = function(){return false};
			}
			break;
		
	}
}
//绘制bessel时svgMove事件
function besselMove(e,svgEl){
	//获取移动时坐标对象
	var coordinatesMove = svgGetCoordinates(e);
	var x = coordinatesMove.x;
	var y = coordinatesMove.y;
	//临时的d命令集合
	var tempD;
	if(svgEl.clickFirst > 1){
		switch(svgEl.clickFirst){
			case 2:
				svgEl.QParam2 = svgEl.QParam1 = x + ' ' + y;
				svgEl.Q = (' Q'+ svgEl.QParam1 + ','+ svgEl.QParam2 );
				tempD= svgEl.M + svgEl.Q;
				break;
			case 3:
				svgEl.QParam2 = x + ' ' + y;
				svgEl.Q = (' Q'+ svgEl.QParam1 + ','+ svgEl.QParam2 );
				tempD= svgEl.M + svgEl.Q;
				break;
			case 4:
				svgEl.CParam1 = svgEl.QParam1;
				svgEl.CParam2 = svgEl.QParam2;
				svgEl.CParam3 = x + ' ' + y;
				svgEl.C = (' C'+ svgEl.CParam1 + ','+ svgEl.CParam2 + ',' +  svgEl.CParam3);
				tempD= svgEl.M + svgEl.C;
				break;
		}
		svgEl.newpath.setAttribute('d',tempD);
	}
}
//绘制矩形
function drawRect(){
	var rectEl = {
		//是否单次点击
		clickOddOrEven:true,
		//判断是否移动
		isMove:false
	}
	//svg点击
	svg.addEventListener('mousedown',svgMouseDown = function(e){
		svgDown(e,rectEl,'rect');
	})
	//svg移动
	svg.addEventListener('mousemove',svgMouseMove = function(e){
		svgMove(e,rectEl,'rect')
	});
}
//绘制圆形
function drawEllipse(){
	var ellipseEl = {
		//是否单次点击
		clickOddOrEven:true,
		//判断是否移动
		isMove:false
	}
	//svg点击
	svg.addEventListener('mousedown',svgMouseDown = function(e){
		svgDown(e,ellipseEl,'ellipse');
	})
	//svg移动
	svg.addEventListener('mousemove',svgMouseMove = function(e){
		svgMove(e,ellipseEl,'ellipse')
	});
	
}
//绘制多边形
function drawPolygon(){
	var polygonEl = {
		//svg是否第一次点击
		clickFirst:true,
		//坐标集
		points:'',
		//判断是否移动
		isMove:false,
		
	};
	//svg点击
	svg.addEventListener('mousedown',svgMouseDown = function(e){
		svgDown(e,polygonEl,'polygon');
	})
	//svg移动
	svg.addEventListener('mousemove',svgMouseMove = function(e){
		svgMove(e,polygonEl,'polygon');
	});
}
//清空曲线所有命令及上一条曲线的坐标
function clearCommand(svgEl){
	svgEl.d = '';
	svgEl.M = '';
	svgEl.Q = '';
	svgEl.QParam1 = '';
	svgEl.QParam2 = '';
	svgEl.C = '';
	svgEl.CParam1 = '';
	svgEl.CParam2 = '';
	svgEl.CParam3 = '';
	svgEl.newpath = '';
}
//绘制曲线
function drawBessel(){
	var besselEl = {
		//svg点击次数
		clickFirst:1,
		//判断是否移动
		isMove:false,
	}
	//svg点击
	svg.addEventListener('mousedown',svgMouseDown = function(e){
		svgDown(e,besselEl,'bessel');
	})
	//svg移动
	svg.addEventListener('mousemove',svgMouseMove = function(e){
		svgMove(e,besselEl,'bessel')
	});
}
//默认绘制矩形
drawRect();