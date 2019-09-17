console.log('rect绘制');

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
//svg是否第一次点击
var clickOddOrEven = true;
//矩形
var newrect;
//第一个坐标
var coordinatesObj1;
//第二个坐标
var coordinatesObj2;
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
	//单次点击
	if(clickOddOrEven){
		//获取坐标对象
		coordinatesObj1 = getCoordinates(e);	
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('x',coordinatesObj1.x);
		rect.setAttribute('y',coordinatesObj1.y);
		rect.setAttribute('width',0);
		rect.setAttribute('height',0);
		rect.setAttribute('fill','red');
		rect.setAttribute('stroke','black');	
		rect.onmousedown = function(e){
			console.log('拖动',rect);
			isMove = true;
			console.log('move');
			var moveBefore = getCoordinates(e);
			console.log('拖动前坐标',moveBefore);
			var moveBeforeX = rect.getAttribute('x');
			var moveBeforeY = rect.getAttribute('y');
			console.log('拖动前x,y',moveBeforeX,moveBeforeY);
			svg.onmousemove = function(e){
				coordinatesMove = getCoordinates(e);
				console.log('拖动时坐标',coordinatesMove);
				var moveX = Number(moveBeforeX) + Number(coordinatesMove.x - moveBefore.x);
				var moveY = Number(moveBeforeY) + Number(coordinatesMove.y - moveBefore.y);
				console.log('拖动时x,y',moveX,moveY);
				rect.setAttribute('x',moveX);
				rect.setAttribute('y',moveY);
			}		
			svg.onmouseup = function(e){
					console.log('up');
					svg.onmousemove = null;
					isMove = false;
			}
			if(clickOddOrEven){
				//阻止冒泡
				e.stopPropagation();
			}
		}
		if(!isMove){
			svg.appendChild(rect);
			newrect = rect;
		}
		clickOddOrEven = false;
	}else{
		coordinatesObj1 = undefined;
		clickOddOrEven = true;
	}
})
svg.addEventListener('mousemove',function(e){
	//获取坐标对象
	coordinatesObj2 = getCoordinates(e);
	if(coordinatesObj1 != undefined){
		console.log(coordinatesObj1,coordinatesObj2);
		var x1 = coordinatesObj1.x;
		var y1 = coordinatesObj1.y;
		var x2 = coordinatesObj2.x;
		var y2 = coordinatesObj2.y;
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
		newrect.setAttribute('x',x);
		newrect.setAttribute('width',width);
		newrect.setAttribute('y',y);
		newrect.setAttribute('height',Math.abs(height));
		// console.log('矩形的高宽',width,height);
		
		
	}
});
console.log('rect.js加载结束...');