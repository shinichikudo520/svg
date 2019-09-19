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
//获取坐标
function getCoordinates(e){	
	var x =	(e.pageX || (e.clientX + scrollX)) - svgL;
	var y = (e.pageY || (e.clientY + scrollY)) - svgT;
	return {
		x,
		y
	}
}
function clickBtn(clickChoose){
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
	//解绑svg的事件
	var svg = document.getElementById('svg_contain'); 
	svg.onmousemove = null;
	svg.onmouseup = null;
	svg.removeEventListener('mousedown',svgDown,false);
	svg.removeEventListener('mousemove',svgMove,false);
}
//创建rect元素
function creatRect(coordinatesObj1){
	var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
	rect.setAttribute('x',coordinatesObj1.x);
	rect.setAttribute('y',coordinatesObj1.y);
	rect.setAttribute('width',0);
	rect.setAttribute('height',0);
	rect.setAttribute('fill','red');
	rect.setAttribute('stroke','black');
	return rect
}
//创建ellipse元素
function creatEllipse(coordinatesObj1){
	var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
	ellipse.setAttribute('cx',coordinatesObj1.x);
	ellipse.setAttribute('cy',coordinatesObj1.y);
	ellipse.setAttribute('rx',0);
	ellipse.setAttribute('ry',0);
	ellipse.setAttribute('fill','red');
	ellipse.setAttribute('stroke','black');	
	return ellipse
}
//ellipse元素：将点坐标添加到坐标集points中
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
//创建svgPath元素
function createSvgPath(x,y){
	var path = document.createElementNS('http://www.w3.org/2000/svg','path');
	M = 'M'+ x + ' ' + y;
	d = M;
	path.setAttribute('d',d);
	path.setAttribute('fill','none');
	path.setAttribute('stroke','red');
	return path
}
//svgDown事件
function svgDown(e,svgEl){
	// debugger
	//单次点击
	if(svgEl.clickOddOrEven){
		//获取坐标对象
		svgEl.coordinatesObj1 = getCoordinates(e);	
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
//svg移动事件
function svgMove(e,svgEl){
	//获取坐标对象
	svgEl.coordinatesObj2 = getCoordinates(e);
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
//绘制矩形
function drawRect(){
	var rectEl = {
		clickOddOrEven:true,
		isMove:false
	}
	//svg点击
	svg.addEventListener('mousedown',function(e){
		svgDown(e,rectEl);
	})
	//svg移动
	svg.addEventListener('mousemove',function(e){
		svgMove(e,rectEl)
	});
}
//绘制圆形
function drawEllipse(){
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
	
	//svgDown事件
	function svgDown(e){
		//单次点击
		if(clickOddOrEven){
			//获取坐标对象
			coordinatesObj1 = getCoordinates(e);	
			var ellipse = creatEllipse(coordinatesObj1);
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
	svg.addEventListener('mousedown',function(e){
		svgDown(e,ellipseEl);
	})
	//svg移动
	svg.addEventListener('mousemove',function(e){
		svgMove(e,ellipseEl)
	});
	
}
//绘制多边形
function drawPolygon(){
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
	svg.addEventListener('mousedown',function(e){
		svgDown(e,polygonEl);
	})
	//svg移动
	svg.addEventListener('mousemove',function(e){
		svgMove(e,polygonEl)
	});
}
//绘制曲线
function drawBessel(){
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
	//清空所有命令及上一条曲线的坐标
	function clearCommand(){
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
						var path = createSvgPath(x,y);
						if(!isMove){
							svg.appendChild(path);
							newpath = path;
						}
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
						//防止第四次点击和第三次点击是双击行为
						//即第四点的坐标与第三点一致，看做同一点，不构成三次贝塞尔曲线
						if(C != undefined && C != '' ){
							d= M + C;
							newpath.setAttribute('d',d);
								
							//开始处理下一条曲线
							//清空初始量和命令集合
							clickFirst = 1;
							clearCommand();
							path = createSvgPath(x,y);
							if(!isMove){
								svg.appendChild(path);
								newpath = path;
							}
						}else{
							d= M + Q;
							newpath.setAttribute('d',d);
							clickFirst = 3;
						}
						break;
				}
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
					tempD= M + Q;
					break;
				case 3:
					QParam2 = x + ' ' + y;
					Q = (' Q'+QParam1 + ','+ QParam2 );
					tempD= M + Q;
					break;
				case 4:
					CParam1 = QParam1;
					CParam2 = QParam2;
					CParam3 = x + ' ' + y;
					C = (' C'+CParam1 + ','+ CParam2 + ',' +  CParam3);
					tempD= M + C;
					break;
			}
			newpath.setAttribute('d',tempD);
		}
	
	}
	//svg点击
	svg.addEventListener('mousedown',function(e){
		svgDown(e,besselEl);
	})
	//svg移动
	svg.addEventListener('mousemove',function(e){
		svgMove(e,besselEl)
	});
}
//默认绘制矩形
drawRect();