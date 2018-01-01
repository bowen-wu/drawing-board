window.onload = function(){  
    //获取元素
    var canvas = document.getElementById('canvas');
    var brush = document.getElementById('brush');
    var eraser = document.getElementById('eraser');
    var set = document.getElementById('set');
    var empty = document.getElementById('empty');
    var palette = document.getElementById('palette');
    var colors = document.getElementById('colors');
    var lineWidthWaper = document.getElementById('lineWidthWaper');
    var thin = document.getElementById('thin');
    var middle = document.getElementById('middle');
    var thick = document.getElementById('thick');

     

    var color = colors.childNodes;

    
    
   // 初始化
   var context = canvas.getContext('2d');
   setPageSize(canvas);
   var point = {x:'',y:''};

    // 监听鼠标事件
    listenUser()
    // 更改模式
    var using = false;
    var model = 'brush';
    brush.onclick = function(){
        model = 'brush';
        this.classList.add('modelActive');
        eraser.classList.remove('modelActive');
        lineWidthWaper.classList.add('lineWidthActive');
    }
    eraser.onclick = function(){
        model = 'eraser';
        this.classList.add('modelActive');
        brush.classList.remove('modelActive');
        lineWidthWaper.classList.remove('lineWidthActive');
    }
    eraser.ontouchmove = function(){
        console.log('move');
        using = false;
    }
    // 清屏
    empty.onclick = function(){
        clear(0, 0, canvas.width, canvas.height)
    }
    // 调色板 paletteActive
    var paletteing = false;
    palette.onclick = function(){
        if (!paletteing) {
            this.classList.add('paletteActive');
            colors.classList.add('colorsActive');
            paletteing = true;
        } else {
            this.classList.remove('paletteActive');
            colors.classList.remove('colorsActive');
            paletteing = false;
        }     
    }
    // 调色

    // 线宽
    var lineWidth = 2;
    context.lineWidth = lineWidth;
    console.log(context.lineWidth);
    thin.onclick = function(){
        console.log(context.lineWidth);
        lineWidth = 2;
        addClassName(this,'selectLineWidth')
    }
    middle.onclick = function(){
        console.log(context.lineWidth);
        lineWidth = 4;
        addClassName(this,'selectLineWidth')
    }
    thick.onclick = function(){
        console.log(context.lineWidth);
        lineWidth = 6;
        addClassName(this,'selectLineWidth')
    }
    function addClassName(ele,className){
        var childs = ele.parentNode.childNodes;
        for(var i = 0,len = childs.length;i<len;i++){
            childs[i].classList.remove(className);
        }
        ele.classList.add(className);
    }
    
    


    function listenUser() {
        if ('ontouchstart' in document.documentElement) {
            canvas.ontouchstart = function(event){
                lineWidthWaper.classList.remove('lineWidthActive');
                using = true;
                var x = event.touches[0].clientX;
                var y = event.touches[0].clientY;
                if (model === 'brush') {
                    point.x = x;
                    point.y = y;
                    drawCircle(x, y, lineWidth/2, 'red');
                    return point;
                } else {
                    clear((x - 3), (y - 3), 8, 8);
                }
            }
            canvas.ontouchmove = function(){
                var x = event.touches[0].clientX;
                var y = event.touches[0].clientY;
                // 知识点：非 using 直接 return
                if (!using) {
                    return
                }
                if (model === 'brush') {
                    drawLine(point.x, point.y, x, y, 'red', lineWidth);
                    // 知识点：更新位置
                    point.x = x;
                    point.y = y;
                } else {
                    clear((x - 2), (y - 2), 8, 8);
                }
            }
            canvas.ontouchend = function(){
                using = false;
            }
        } else {
            canvas.onmousedown = function (event) {
                lineWidthWaper.classList.remove('lineWidthActive');
                using = true;
                var x = event.clientX;
                var y = event.clientY;
                if (model === 'brush') {
                    point.x = x;
                    point.y = y;
                    drawCircle(x, y, lineWidth/2, 'red');
                    return point;
                } else {
                    clear((x - 3), (y - 3), 6, 6);
                }
            }
            canvas.onmousemove = function (event) {
                var x = event.clientX;
                var y = event.clientY;
                // 知识点：非 using 直接 return
                if (!using) {
                    return
                }
                if (model === 'brush') {
                    drawLine(point.x, point.y, x, y, 'red', lineWidth);
                    // 知识点：更新位置
                    point.x = x;
                    point.y = y;
                } else {
                    clear((x - 2), (y - 2), 4, 4);
                }
            }
            canvas.onmouseup = function () {
                using = false;
            }
        }
        
    }
    

    function setPageSize(canvas) {
        initPageSize(canvas);
        // 知识点：监控页面变化，随时进行更新
        window.onresize = function(){
            initPageSize(canvas);
        }
    }
    function initPageSize(canvas) {
        // 知识点：获取页面宽高
        var pageWidth = document.documentElement.clientWidth;
        var pageHeight = document.documentElement.clientHeight;
        canvas.width = pageWidth;
        canvas.height = pageHeight;
    }

    function drawCircle(x, y, r, color) {
        context.beginPath();
        context.fillStyle = color
        context.arc(x, y, r, 0, 2 * (Math.PI));
        context.fill();
    }
    function drawLine(x1,y1,x2,y2,color,width){
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = width;
        context.moveTo(x1,y1);
        context.lineTo(x2,y2);
        context.closePath();
        context.stroke();
    }
    function clear(x, y, width, height){
        context.clearRect(x, y, width, height)
    }
}