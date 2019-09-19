window.onload = function(){

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
        svgMouseDown(e,svgObj){
            var coordinates = getCoordinates(e);
            this.svgMouseDownX = coordinates.x;
            this.svgMouseDownY = coordinates.y;
            switch(type){
                case 'rect':
                    // rectDown(e,svgObj);
                    break;
                case 'ellipse':
                    // ellipseDown(e,svgObj);
                    break;
                case 'polygon':
                    // polygonDown(e,svgObj);
                    break;
                case 'bezier':
                    // bezierDown(e,svgObj);
                    break;
            }
        }
        //svg的mouseMove事件
        svgMouseMove(e,svgObj){
            var coordinates = getCoordinates(e);
            this.svgMouseMoveX = coordinates.x;
            this.svgMouseMoveY = coordinates.y;
            switch(type){
                case 'rect':
                    // rectMove(e,svgObj);
                    break;
                case 'ellipse':
                    // ellipseMove(e,svgObj);
                    break;
                case 'polygon':
                    // polygonMove(e,svgObj);
                    break;
                case 'bezier':
                    // bezierMove(e,svgObj);
                    break;
            }	
        }
    }

    //rect元素类
    class Rect{
        //构造函数
        constructor(){
			//是否单次点击
            this.clickOddOrEven = true;
			//判断是否移动
            this.isMove = false;
            //实例化一个svg对象
            this.svgInstantiation = new Svg();
        }
        //绘制rect时mousedown事件
        rectMouseDown(x,y){
            //单次点击
            if(this.clickOddOrEven){
                //rect属性
                var props = {
                    'x':x,
                    'y':y,
                    'width':0,
                    'height':0,
                    'fill':'red',
                    'stroke':'black'
                };
                	
                var rect = this.svgInstantiation.createSvgEl('rect',props);
                //拖动前：rect拖动前的定位坐标
                var moveBeforeX = rect.getAttribute('x');
                var moveBeforeY = rect.getAttribute('y');
                rect.onmousedown = function(e){
                    this.isMove = true;
                    //拖动前：鼠标按下时坐标
                    this.moveBefore = getCoordinates(e);
                    if(this.clickOddOrEven){
                        //阻止冒泡
                        e.stopPropagation();
                    }
                }
                rect.onmousemove = function(e){
                    //拖动时：rect应该所在的定位坐标 = 拖动前的定位坐标 + (鼠标移动的坐标 - 移动前的坐标)
                    var moveX = Number(moveBeforeX) + (this.svgInstantiation.svgMouseMoveX - this.moveBefore.x);
                    var moveY = Number(moveBeforeY) + (this.svgInstantiation.svgMouseMoveY - this.moveBefore.y);
                    rect.setAttribute('x',moveX);
                    rect.setAttribute('y',moveY);	
                }
                rect.onmouseup = function(e){
                    rect.onmousemove = null;
                    //结束拖动
                    this.isMove = false;
                }
                if(!this.isMove){
                    svg.appendChild(rect);
                    this.newrect = rect;
                }
                this.clickOddOrEven = false;
            }else{
                this.clickOddOrEven = true;
            }
        }
        //绘制rect时mousemove事件
        rectMouseMove(x,y){
            if(this.newrect != undefined){
                //获取鼠标按下时的坐标，即初始化rect的定位坐标
                var x1 = this.svgInstantiation.svgMouseDownX;
                var y1 = this.svgInstantiation.svgMouseDownY
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
                this.newrect.setAttribute('x',offsetX);
                this.newrect.setAttribute('width',width);
                this.newrect.setAttribute('y',offsetY);
                this.newrect.setAttribute('height',Math.abs(height));
            }
        }
    }

    //ellipse元素类
    class Ellipse{
        //构造函数
        constructor(){
			//是否单次点击
            this.clickOddOrEven = true;
			//判断是否移动
            this.isMove = false;
            //ellipse的points坐标集
            this.points = '';
            //实例化一个svg对象
            this.svgInstantiation = new Svg();
        }
        //添加坐标点
        addPoint(x,y){
            this.points += (x + ' ' + y + ' ');
        }
        //绘制ellipse时mousedown事件
        ellipseMouseDown(x,y){
            //单次点击
            if(this.clickOddOrEven){
                var props = {
                    'cx':x,
                    'cy':y,
                    'rx':0,
                    'ry':0,
                    'fill':'red',
                    'stroke':'black'
                };
                var ellipse = this.svgInstantiation.createSvgEl('ellipse',props);
                ellipse.onmousedown = function(e){
                    this.isMove = true;
                   if(this.clickOddOrEven){
                        //阻止冒泡
                        e.stopPropagation();
                    }
                }
                ellipse.onmousemove = function(e){
                    ellipse.setAttribute('cx',this.svgInstantiation.svgMouseMoveX);
                    ellipse.setAttribute('cy',this.svgInstantiation.svgMouseMoveY);
                }
                ellipse.onmouseup = function(e){
                    ellipse.onmousemove = null;
                    this.isMove = false;
                }
                if(!this.isMove){
                    svg.appendChild(ellipse);
                    this.newEllipse = ellipse;
                }
                this.clickOddOrEven = false;
            }else{
                this.clickOddOrEven = true;
            }
        }
        //绘制ellipse时mousemove事件
        ellipseMouseMove(x,y){
            //已经创建了ellipse对象
            if(this.newEllipse != undefined){
                //获取鼠标按下时的坐标，即初始化ellipse的定位坐标
                var x1 = this.svgInstantiation.svgMouseDownX;
                var y1 = this.svgInstantiation.svgMouseDownY;
                var cx = x > x1 ? (x - x1)/2 + x1 : (x1 - x)/2 + x;
                var cy = y > y1 ? (y - y1)/2 + y1 : (y1 - y)/2 + y;
                var rx = Math.abs(x - x1) / 2;
                var ry = Math.abs(y - y1) / 2;
                this.newEllipse.setAttribute('cx',cx);
                this.newEllipse.setAttribute('cy',cy);
                this.newEllipse.setAttribute('rx',rx);
                this.newEllipse.setAttribute('ry',ry);
            }
        }
    }



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
		});
    }
    
    


	// //初始化
	init();
}