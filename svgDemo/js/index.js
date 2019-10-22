 //svg元素类
class Svg{
	//构造函数
	constructor(){
		//mousedown时坐标
		this.svgMouseDownX = null;
		this.svgMouseDownY = null;
		//mousemove时坐标
		this.svgMouseMoveX = null;
		this.svgMouseMoveY = null;
		switch(type){
			case 'rect':
				this.type = new Rect(this);
				break;
			case 'ellipse':
				this.type = new Ellipse(this);
				break;
			case 'polygon':
				this.type = new Polygon(this);
				break;
			case 'bezier':
				this.type = new Path(this);
				break;
		}
	}
	//创建svg图形元素
	createSvgEl(type,props){
		var type = document.createElementNS('http://www.w3.org/2000/svg',type);
		for(var key in props){
			type.setAttribute(key,props[key]);
		}
		//返回一个svg图形元素的Dom
		return type
	}
	//svg的mousedown事件
	svgMouseDown(e){
		var coordinates = getCoordinates(e);
		this.svgMouseDownX = coordinates.x;
		this.svgMouseDownY = coordinates.y;
		this.type.mouseDown(this.svgMouseDownX,this.svgMouseDownY,e);
	}
	//svg的mouseMove事件
	svgMouseMove(e){
		var coordinates = getCoordinates(e);
		this.svgMouseMoveX = coordinates.x;
		this.svgMouseMoveY = coordinates.y;
		this.type.mouseMove(this.svgMouseMoveX,this.svgMouseMoveY,e);	
	}
}

//rect矩形元素类
class Rect{
	//构造函数
	constructor(svgInstantiation){
		//是否单次点击
		this.clickOddOrEven = true;
		//判断是否移动
		this.isMove = false;
		//实例化一个svg对象
		this.svgInstantiation = svgInstantiation;
	}
	//绘制rect时mousedown事件
	mouseDown(x,y){
		// debugger
		var _this = this;
		//单次点击
		if(_this.clickOddOrEven){
			//rect属性
			var props = {
				'x':x,
				'y':y,
				'width':0,
				'height':0,
				'fill':'red',
				'stroke':'black'
			};
				
			var rect = _this.svgInstantiation.createSvgEl('rect',props);
			
			rect.onmousedown = function(e){
				// console.log(_this);
				_this.isMove = true;
				//拖动前：rect拖动前的定位坐标
				var moveBeforeX = rect.getAttribute('x');
				var moveBeforeY = rect.getAttribute('y');
				//拖动前：鼠标按下时坐标
				_this.moveBefore = getCoordinates(e);
				
				svg.onmousemove = function(e){
					//拖动时：rect应该所在的定位坐标 = 拖动前的定位坐标 + (鼠标移动的坐标 - 移动前的坐标)
					var moveX = Number(moveBeforeX) + (_this.svgInstantiation.svgMouseMoveX - _this.moveBefore.x);
					var moveY = Number(moveBeforeY) + (_this.svgInstantiation.svgMouseMoveY - _this.moveBefore.y);
					rect.setAttribute('x',moveX);
					rect.setAttribute('y',moveY);	
				}
				svg.onmouseup = function(e){
					svg.onmousemove = null;
					//结束拖动
					_this.isMove = false;
				}
				if(_this.clickOddOrEven){
					//阻止冒泡
					e.stopPropagation();
				}
			}
		   
			if(!_this.isMove){
				svg.appendChild(rect);
				_this.newrect = rect;
			}
			_this.clickOddOrEven = false;
		}else{
			_this.clickOddOrEven = true;
			_this.newrect = undefined;
		}
	}
	//绘制rect时mousemove事件
	mouseMove(x,y){
		var _this = this;
		if(_this.newrect != undefined){
			//获取鼠标按下时的坐标，即初始化rect的定位坐标
			var x1 = _this.svgInstantiation.svgMouseDownX;
			var y1 = _this.svgInstantiation.svgMouseDownY
			var width = x - x1;
			var height = y - y1;
			//moveTo参数水平偏移量x
			var offsetX;
			//moveTo参数垂直偏移量y
			var offsetY;
			if(width > 0){
				offsetX = x1;
			}else{
				offsetX = x;
				width = Math.abs(width);
			}
			if(height > 0){
				offsetY = y1;
			}else{
				offsetY = y;
				height = Math.abs(height);
			}
			_this.newrect.setAttribute('x',offsetX);
			_this.newrect.setAttribute('width',width);
			_this.newrect.setAttribute('y',offsetY);
			_this.newrect.setAttribute('height',Math.abs(height));
		}
	}
}

//ellipse圆形元素类
class Ellipse{
	//构造函数
	constructor(svgInstantiation){
		//是否单次点击
		this.clickOddOrEven = true;
		//判断是否移动
		this.isMove = false;
		//实例化一个svg对象
		this.svgInstantiation = svgInstantiation;
	}
	//绘制ellipse时mousedown事件
	mouseDown(x,y){
		var _this = this;
		//单次点击
		if(_this.clickOddOrEven){
			var props = {
				'cx':x,
				'cy':y,
				'rx':0,
				'ry':0,
				'fill':'red',
				'stroke':'black'
			};
			var ellipse = _this.svgInstantiation.createSvgEl('ellipse',props);
			ellipse.onmousedown = function(e){
				_this.isMove = true;
				
				svg.onmousemove = function(e){
					ellipse.setAttribute('cx',_this.svgInstantiation.svgMouseMoveX);
					ellipse.setAttribute('cy',_this.svgInstantiation.svgMouseMoveY);
				}
				svg.onmouseup = function(e){
					svg.onmousemove = null;
					_this.isMove = false;
				}
				if(_this.clickOddOrEven){
					//阻止冒泡
					e.stopPropagation();
				}
			}
			
			if(!_this.isMove){
				svg.appendChild(ellipse);
				_this.newEllipse = ellipse;
			}
			_this.clickOddOrEven = false;
		}else{
			_this.newEllipse = undefined
			_this.clickOddOrEven = true;
		}
	}
	//绘制ellipse时mousemove事件
	mouseMove(x,y){
		var _this = this;
		//已经创建了ellipse对象
		if(_this.newEllipse != undefined){
			//获取鼠标按下时的坐标，即初始化ellipse的定位坐标
			var x1 = _this.svgInstantiation.svgMouseDownX;
			var y1 = _this.svgInstantiation.svgMouseDownY;
			var cx = x > x1 ? (x - x1)/2 + x1 : (x1 - x)/2 + x;
			var cy = y > y1 ? (y - y1)/2 + y1 : (y1 - y)/2 + y;
			var rx = Math.abs(x - x1) / 2;
			var ry = Math.abs(y - y1) / 2;
			_this.newEllipse.setAttribute('cx',cx);
			_this.newEllipse.setAttribute('cy',cy);
			_this.newEllipse.setAttribute('rx',rx);
			_this.newEllipse.setAttribute('ry',ry);
		}
	}
}

//polygon多边形元素类
class Polygon{
	//构造函数
	constructor(svgInstantiation){
		//polygon的points坐标集
		this.points = '';
		//是否单次点击
		this.clickFirst = true;
		//判断是否移动
		this.isMove = false;
		//实例化一个svg对象
		this.svgInstantiation = svgInstantiation;

	}
	//添加坐标点
	addPoint(x,y){
		var _this = this;
		_this.points += (x + ' ' + y + ' ');
	}
	//绘制polygon时mousedown事件
	mouseDown(x,y,e){
		var _this = this;
		console.log('polygon点击绘制...');
		if(e.which == 3){
			if(!_this.clickFirst){
				//将点添加到坐标集中
				_this.addPoint(x,y);
				_this.newPolygon.setAttribute('points',_this.points);
				
				_this.clickFirst = true;
				_this.points = '';
				//阻止右键菜单弹出
				document.oncontextmenu = function(){return false};
			}
			return
		}
		//左键点击
		//第一次点击
		if(_this.clickFirst){	
			//将点添加到坐标集中
			this.addPoint(x,y);
			var props = {
				'points':_this.points,
				'fill':'red',
				'stroke':'black'
			}
			var polygon = _this.svgInstantiation.createSvgEl('polygon',props);
			polygon.onmousedown = function(e){
				//移动前的坐标点集合
				var polygonPoints = polygon.getAttribute('points');
				_this.isMove = true;
				var pointsArr = polygonPoints.split(" ");
				//拖动时，鼠标按下的坐标
				_this.moveBefore = getCoordinates(e);
				svg.onmousemove = function(e){
					var moveX = _this.svgInstantiation.svgMouseMoveX - _this.moveBefore.x;
					var moveY = _this.svgInstantiation.svgMouseMoveY - _this.moveBefore.y;
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
					_this.isMove = false;
				}
				if(_this.clickFirst){
					//阻止冒泡
					e.stopPropagation();
				}
			}
			if(!_this.isMove){
				svg.appendChild(polygon);
				_this.newPolygon = polygon;
			}
			_this.clickFirst = false;
		}
		//不是第一次点击
		else{
			//将点添加到坐标集中
			_this.addPoint(x,y);
			_this.newPolygon.setAttribute('points',_this.points);
		}
	}
	//绘制polyMouseMove事件
	mouseMove(x,y){
		var _this = this;
		if(!_this.clickFirst){
			//临时坐标集
			var pointsTemp = _this.points + (x + ' ' + y + ' ');            
			_this.newPolygon.setAttribute('points',pointsTemp);
		}
	}

}

//path曲线元素类
class Path{
	//构造函数
	constructor(svgInstantiation){
		//svg点击次数
		this.clickCount = 1;
		this.isMove = false;
		//实例化一个svg对象
		this.svgInstantiation = svgInstantiation;

	}
	//清空曲线对象所有命令及上一条曲线的坐标
	clearCommand(){
		var _this = this;
		_this.d = '';
		_this.M = '';
		_this.Q = '';
		_this.QParam1 = '';
		_this.QParam2 = '';
		_this.C = '';
		_this.CParam1 = '';
		_this.CParam2 = '';
		_this.CParam3 = '';
		// _this.newpath = '';
	}
	//绘制bezier时的mousedown事件
	mouseDown(x,y,e){
		var _this = this;
		//右键点击
		if(e.which == 3){
			if(_this.clickCount > 1){
				switch(_this.clickCount){
					case 2:
					case 3:
						_this.d= _this.M + _this.Q;
						break;
					case 4:
						//防止第四次点击和第三次点击是双击行为
						//即第四点的坐标与第三点一致，看做同一点，不构成三次贝塞尔曲线
						if(_this.C != undefined && _this.C != '' ){
							_this.d= _this.M + _this.C;
						}else{
							_this.d= _this.M + _this.Q;
						}
						break;
				}
				_this.newpath.setAttribute('d',_this.d);				
				//清空初始量和命令集合
				_this.clickCount = 1;
				_this.clearCommand();
				//阻止右键菜单弹出
				document.oncontextmenu = function(){return false};
			}
			return
		}
		// debugger

		//左键点击
		switch(_this.clickCount){
			//第一次点击
			case 1:
				_this.d = _this.M = 'M'+ x + ' ' + y;
				var props = {
					'd':_this.d,
					'fill':'none',
					'stroke':'red'
				};
				var path = _this.svgInstantiation.createSvgEl('path',props);
				if(!_this.isMove){
					svg.appendChild(path);
					_this.newpath = path;
				}
				break;
			//第二次点击 或者 第三次点击
			case 2:
			case 3:
				if(_this.Q != undefined && _this.Q != ''){
					_this.d= _this.M + _this.Q;
					_this.newpath.setAttribute('d',_this.d);
				}else{
					_this.d = _this.M;
					_this.newpath.setAttribute('d',_this.d);
					_this.clickCount = 1;
				}
				break;
			//第四次点击
			case 4:
				// debugger
				//防止第四次点击和第三次点击是双击行为
				//即第四点的坐标与第三点一致，看做同一点，不构成三次贝塞尔曲线
				if(_this.C != undefined && _this.C != '' ){
					_this.d= _this.M + _this.C;
					_this.newpath.setAttribute('d',_this.d);
						
					//开始处理下一条曲线
					//清空初始量和命令集合
					_this.clickCount = 1;
					_this.clearCommand();
					_this.d = _this.M = 'M'+ x + ' ' + y;
					var props = {
						'd':_this.d,
						'fill':'none',
						'stroke':'red'
					};
					path = _this.svgInstantiation.createSvgEl('path',props);
					if(!_this.isMove){
						svg.appendChild(path);
						_this.newpath = path;
					}
				}else{
					_this.d= _this.M + _this.Q;
					_this.newpath.setAttribute('d',_this.d);
					_this.clickCount = 3;
				}
				break;
		}
		_this.clickCount += 1;
	}
	//绘制bezier时的mousemove事件
	mouseMove(x,y,e){
		var _this = this;
		//临时的d命令集合
		var tempD;
		if(_this.clickCount > 1){
			switch(_this.clickCount){
				case 2:
					_this.QParam2 = _this.QParam1 = x + ' ' + y;
					_this.Q = (' Q'+ _this.QParam1 + ','+ _this.QParam2 );
					tempD= _this.M + _this.Q;
					break;
				case 3:
					_this.QParam2 = x + ' ' + y;
					_this.Q = (' Q'+ _this.QParam1 + ','+ _this.QParam2 );
					tempD= _this.M + _this.Q;
					break;
				case 4:
					console.log('4move...');
					_this.CParam1 = _this.QParam1;
					_this.CParam2 = _this.QParam2;
					_this.CParam3 = x + ' ' + y;
					_this.C = (' C'+ _this.CParam1 + ','+ _this.CParam2 + ',' +  _this.CParam3);
					tempD= _this.M + _this.C;
					break;
			}
			_this.newpath.setAttribute('d',tempD);
		}
	}
}

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
	// //svg的mouseDown的绑定事件名
	// var svgMouseDown;
	// //svg的mouseMove的绑定事件名
    // var svgMouseMove;
    //当前绘制的svg图形种类
    var type = 'rect';
	//获取坐标
	function getCoordinates(e){	
		var x =	(e.pageX || (e.clientX + scrollX)) - svgL;
		var y = (e.pageY || (e.clientY + scrollY)) - svgT;
		return {
			x,
			y
		};
    }
	//初始化：为按钮绑定事件
	function init(){
        //创建一个svg实例
        var svgInstantiation = new Svg();
		// 图形元素数组
		var arrGraphicEl = ['rect','ellipse','polygon','bezier'];
		arrGraphicEl.forEach(item => {
			var GraphicEl = document.getElementsByClassName(item)[0];
			GraphicEl.onclick = function(){
                //改变目前的绘制图形种类
                type = item;
                svgInstantiation = new Svg();
			}
        });
        //svg点击
        svg.addEventListener('mousedown',function(e){
            svgInstantiation.svgMouseDown(e);
        })
        //svg移动
        svg.addEventListener('mousemove',function(e){
            svgInstantiation.svgMouseMove(e);
        });
    }
	// //初始化
	init();
}