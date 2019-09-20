window.onload = function(){
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
	//获取坐标
	function getCoordinates(e){	
		var x =	(e.pageX || (e.clientX + scrollX)) - svgL;
		var y = (e.pageY || (e.clientY + scrollY)) - svgT;
		return {
			x,
			y
		}
	}
	//初始化：为按钮绑定事件
	function init(){
		// debugger
		// 图形元素数组
		var arrGraphicEl = ['rect','ellipse','polygon','bezier'];
		arrGraphicEl.forEach(item => {
			var GraphicEl = document.getElementsByClassName(item)[0];
			GraphicEl.onclick = function(){
				clickBtn(item);
			}
		})
		// document.getElementsByClassName('svgGraphicElUl')[0].onclick = function(){
		// 	clickBtn(item);
		// }
	}	
	//选择绘制图形的种类
	function clickBtn(clickChoose){
		//解绑svg的事件
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
			case 'bezier':
				drawBezier();
				break;
		}
		
	}



	//svg
	//创建svg元素
	function createSvgEl(type,props){
		var type = document.createElementNS('http://www.w3.org/2000/svg',type);
		for(var key in props){
			type.setAttribute(key,props[key]);
		}
		return type
	}
	//svgDown事件
	function svgDown(e,svgObj,type){
		switch(type){
			case 'rect':
				rectDown(e,svgObj);
				break;
			case 'ellipse':
				ellipseDown(e,svgObj);
				break;
			case 'polygon':
				polygonDown(e,svgObj);
				break;
			case 'bezier':
				bezierDown(e,svgObj);
				break;
		}	
	}
	//svg移动事件
	function svgMove(e,svgObj,type){
		switch(type){
			case 'rect':
				rectMove(e,svgObj);
				break;
			case 'ellipse':
				ellipseMove(e,svgObj);
				break;
			case 'polygon':
				polygonMove(e,svgObj);
				break;
			case 'bezier':
				bezierMove(e,svgObj);
				break;
		}	
	}

	//rect
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
	//创建rect元素
	function createRect(coordinatesObj1){
		var props = {
			'x':coordinatesObj1.x,
			'y':coordinatesObj1.y,
			'width':0,
			'height':0,
			'fill':'red',
			'stroke':'black'
		}
		return createSvgEl('rect',props);
	}
	//绘制rect时svgDown事件
	function rectDown(e,svgObj){
		//单次点击
		if(svgObj.clickOddOrEven){
			//获取坐标对象
			svgObj.coordinatesObj1 = getCoordinates(e);	
			var rect = createRect(svgObj.coordinatesObj1);
			rect.onmousedown = function(e){
				svgObj.isMove = true;
				var moveBefore = getCoordinates(e);
				var moveBeforeX = rect.getAttribute('x');
				var moveBeforeY = rect.getAttribute('y');
				svg.onmousemove = function(e){
					svgObj.coordinatesMove = getCoordinates(e);
					var moveX = Number(moveBeforeX) + Number(svgObj.coordinatesMove.x - moveBefore.x);
					var moveY = Number(moveBeforeY) + Number(svgObj.coordinatesMove.y - moveBefore.y);
					rect.setAttribute('x',moveX);
					rect.setAttribute('y',moveY);
				}		
				svg.onmouseup = function(e){
						svg.onmousemove = null;
						svgObj.isMove = false;
				}
				if(svgObj.clickOddOrEven){
					//阻止冒泡
					e.stopPropagation();
				}
			}
			if(!svgObj.isMove){
				svg.appendChild(rect);
				svgObj.newrect = rect;
			}
			svgObj.clickOddOrEven = false;
		}else{
			svgObj.coordinatesObj1 = undefined;
			svgObj.clickOddOrEven = true;
		}
	}

	//绘制rect时svgMove事件
	function rectMove(e,svgObj){
		//获取坐标对象
		svgObj.coordinatesObj2 = getCoordinates(e);
		if(svgObj.coordinatesObj1 != undefined){
			var x1 = svgObj.coordinatesObj1.x;
			var y1 = svgObj.coordinatesObj1.y;
			var x2 = svgObj.coordinatesObj2.x;
			var y2 = svgObj.coordinatesObj2.y;
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
			svgObj.newrect.setAttribute('x',x);
			svgObj.newrect.setAttribute('width',width);
			svgObj.newrect.setAttribute('y',y);
			svgObj.newrect.setAttribute('height',Math.abs(height));
		}
	}
	




	//ellipse
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
	
	//创建ellipse元素
	function createEllipse(coordinatesObj1){
		var props = {
			'cx':coordinatesObj1.x,
			'cy':coordinatesObj1.y,
			'rx':0,
			'ry':0,
			'fill':'red',
			'stroke':'black'
		}
		return createSvgEl('ellipse',props);
	}
	
	//绘制ellipse时的svgDown事件
	function ellipseDown(e,svgObj){
		//单次点击
		if(svgObj.clickOddOrEven){
			//获取坐标对象
			svgObj.coordinatesObj1 = getCoordinates(e);	
			var ellipse = createEllipse(svgObj.coordinatesObj1);
			ellipse.onmousedown = function(e){
				svgObj.isMove = true;
				svg.onmousemove = function(e){
					svgObj.coordinatesMove = getCoordinates(e);
					ellipse.setAttribute('cx',svgObj.coordinatesMove.x);
					ellipse.setAttribute('cy',svgObj.coordinatesMove.y);
				}		
				svg.onmouseup = function(e){
						svg.onmousemove = null;
						svgObj.isMove = false;
				}
				if(svgObj.clickOddOrEven){
					//阻止冒泡
					e.stopPropagation();
				}
			}
			if(!svgObj.isMove){
				svg.appendChild(ellipse);
				svgObj.newEllipse = ellipse;
			}
			svgObj.clickOddOrEven = false;
		}else{
			svgObj.coordinatesObj1 = undefined;
			svgObj.clickOddOrEven = true;
		}
	}
	//绘制ellipse时svgMove事件
	function ellipseMove(e,svgObj){
		//获取坐标对象
		svgObj.coordinatesObj2 = getCoordinates(e);
		if(svgObj.coordinatesObj1 != undefined){
			var x1 = svgObj.coordinatesObj1.x;
			var y1 = svgObj.coordinatesObj1.y;
			var x2 = svgObj.coordinatesObj2.x;
			var y2 = svgObj.coordinatesObj2.y;
			var cx = x2 > x1 ? (x2 - x1)/2 + x1 : (x1 - x2)/2 + x2;
			var cy = y2 > y1 ? (y2 - y1)/2 + y1 : (y1 - y2)/2 + y2;
			var rx = Math.abs(x2 - x1) / 2;
			var ry = Math.abs(y2 - y1) / 2;
			svgObj.newEllipse.setAttribute('cx',cx);
			svgObj.newEllipse.setAttribute('cy',cy);
			svgObj.newEllipse.setAttribute('rx',rx);
			svgObj.newEllipse.setAttribute('ry',ry);
		}
	}
	








	//polygon
	//polygon元素：将点坐标添加到坐标集points中
	function addPoint(svgObj,coordinates){
		svgObj.points += (coordinates.x + ' ' + coordinates.y + ' ');
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
	//创建polygon元素
	function createPolygon(svgObj,coordinates){
		//将点添加到坐标集中
		addPoint(svgObj,coordinates);
		var props = {
			'points':svgObj.points,
			'fill':'red',
			'stroke':'black'
		}
		return createSvgEl('polygon',props);
	}
	//绘制polygon时的svgDown事件
	function polygonDown(e,svgObj){
		//获取坐标
		var coordinates = getCoordinates(e);
			
		if(e.which == 3){
			if(!svgObj.clickFirst){
				//将点添加到坐标集中
				addPoint(svgObj,coordinates);
				svgObj.newPolygon.setAttribute('points',svgObj.points);
				
				svgObj.clickFirst = true;
				svgObj.points = '';
				//阻止右键菜单弹出
				document.oncontextmenu = function(){return false};
			}
			return
		}
		//左键点击
		//第一次点击
		if(svgObj.clickFirst){	
			var polygon = createPolygon(svgObj,coordinates);
			polygon.onmousedown = function(e){
				var polygonPoints = polygon.getAttribute('points');
				svgObj.isMove = true;
				var pointsArr = polygonPoints.split(" ");
				var moveBefore = getCoordinates(e);
				svg.onmousemove = function(e){
					svgObj.coordinatesMove = getCoordinates(e);
					var moveX = Number(svgObj.coordinatesMove.x - moveBefore.x);
					var moveY = Number(svgObj.coordinatesMove.y - moveBefore.y);
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
						svgObj.isMove = false;
				}
				if(svgObj.clickFirst){
					//阻止冒泡
					e.stopPropagation();
				}
			}
			if(!svgObj.isMove){
				svg.appendChild(polygon);
				svgObj.newPolygon = polygon;
			}
			svgObj.clickFirst = false;
		}
		//不是第一次点击
		else{
			//将点添加到坐标集中
			addPoint(svgObj,coordinates);
			svgObj.newPolygon.setAttribute('points',svgObj.points);
		}
	}
	//绘制ellipse时svgMove事件
	function polygonMove(e,svgObj){
		if(!svgObj.clickFirst){
			//获取移动时坐标对象
			svgObj.coordinatesMove = getCoordinates(e);
			//临时坐标集
			var pointsTemp = svgObj.points + (svgObj.coordinatesMove.x + ' ' + svgObj.coordinatesMove.y + ' ');
			
			svgObj.newPolygon.setAttribute('points',pointsTemp);
		}
	}
	






	//path
	//清空曲线所有命令及上一条曲线的坐标
	function clearCommand(svgObj){
		svgObj.d = '';
		svgObj.M = '';
		svgObj.Q = '';
		svgObj.QParam1 = '';
		svgObj.QParam2 = '';
		svgObj.C = '';
		svgObj.CParam1 = '';
		svgObj.CParam2 = '';
		svgObj.CParam3 = '';
		svgObj.newpath = '';
	}
	//绘制曲线
	function drawBezier(){
		var bezierEl = {
			//svg点击次数
			clickFirst:1,
			//判断是否移动
			isMove:false,
		}
		//svg点击
		svg.addEventListener('mousedown',svgMouseDown = function(e){
			svgDown(e,bezierEl,'bezier');
		})
		//svg移动
		svg.addEventListener('mousemove',svgMouseMove = function(e){
			svgMove(e,bezierEl,'bezier')
		});
	}

	//创建svgPath元素
	function createSvgPath(svgObj,x,y){
		svgObj.M = 'M'+ x + ' ' + y;
		svgObj.d = svgObj.M;
		var props = {
			'd':svgObj.d,
			'fill':'none',
			'stroke':'red'
		}
		return createSvgEl('path',props);
	}
	//绘制bezier时的svgDown事件
	function bezierDown(e,svgObj){
		//获取坐标
		var coordinates = getCoordinates(e);
		var x = coordinates.x;
		var y = coordinates.y;
		//右键点击
		if(e.which == 3){
			if(svgObj.clickFirst > 1){
				switch(svgObj.clickFirst){
					case 2:
					case 3:
						svgObj.d= svgObj.M + svgObj.Q;
						break;
					case 4:
						//防止第四次点击和第三次点击是双击行为
						//即第四点的坐标与第三点一致，看做同一点，不构成三次贝塞尔曲线
						if(svgObj.C != undefined && svgObj.C != '' ){
							svgObj.d= svgObj.M + svgObj.C;
						}else{
							svgObj.d= svgObj.M + svgObj.Q;
						}
						break;
				}
				svgObj.newpath.setAttribute('d',svgObj.d);				
				//清空初始量和命令集合
				svgObj.clickFirst = 1;
				clearCommand(svgObj);
				//阻止右键菜单弹出
				document.oncontextmenu = function(){return false};
			}
			return
		}
		//左键点击
		switch(svgObj.clickFirst){
			//第一次点击
			case 1:
				var path = createSvgPath(svgObj,x,y);
				if(!svgObj.isMove){
					svg.appendChild(path);
					svgObj.newpath = path;
				}
				break;
			//第二次点击 或者 第三次点击
			case 2:
			case 3:
				if(svgObj.Q != undefined && svgObj.Q != ''){
					svgObj.d= svgObj.M + svgObj.Q;
					svgObj.newpath.setAttribute('d',svgObj.d);
				}else{
					svgObj.d = svgObj.M;
					svgObj.newpath.setAttribute('d',svgObj.d);
					svgObj.clickFirst = 1;
				}
				break;
			//第四次点击
			case 4:
				//防止第四次点击和第三次点击是双击行为
				//即第四点的坐标与第三点一致，看做同一点，不构成三次贝塞尔曲线
				if(svgObj.C != undefined && svgObj.C != '' ){
					svgObj.d= svgObj.M + svgObj.C;
					svgObj.newpath.setAttribute('d',svgObj.d);
						
					//开始处理下一条曲线
					//清空初始量和命令集合
					svgObj.clickFirst = 1;
					clearCommand(svgObj);
					path = createSvgPath(svgObj,x,y);
					if(!svgObj.isMove){
						svg.appendChild(path);
						svgObj.newpath = path;
					}
				}else{
					svgObj.d= svgObj.M + svgObj.Q;
					svgObj.newpath.setAttribute('d',svgObj.d);
					svgObj.clickFirst = 3;
				}
				break;
		}
		svgObj.clickFirst += 1;
	}
	//绘制bezier时svgMove事件
	function bezierMove(e,svgObj){
		//获取移动时坐标对象
		var coordinatesMove = getCoordinates(e);
		var x = coordinatesMove.x;
		var y = coordinatesMove.y;
		//临时的d命令集合
		var tempD;
		if(svgObj.clickFirst > 1){
			switch(svgObj.clickFirst){
				case 2:
					svgObj.QParam2 = svgObj.QParam1 = x + ' ' + y;
					svgObj.Q = (' Q'+ svgObj.QParam1 + ','+ svgObj.QParam2 );
					tempD= svgObj.M + svgObj.Q;
					break;
				case 3:
					svgObj.QParam2 = x + ' ' + y;
					svgObj.Q = (' Q'+ svgObj.QParam1 + ','+ svgObj.QParam2 );
					tempD= svgObj.M + svgObj.Q;
					break;
				case 4:
					svgObj.CParam1 = svgObj.QParam1;
					svgObj.CParam2 = svgObj.QParam2;
					svgObj.CParam3 = x + ' ' + y;
					svgObj.C = (' C'+ svgObj.CParam1 + ','+ svgObj.CParam2 + ',' +  svgObj.CParam3);
					tempD= svgObj.M + svgObj.C;
					break;
			}
			svgObj.newpath.setAttribute('d',tempD);
		}
	}
	
	
	
	//默认绘制矩形
	drawRect();
	//初始化图形绑定
	init();
	
}