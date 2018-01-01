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
    var point = { x: '', y: '' };
    // 监听鼠标事件
    listenUser()
    // 选择线宽
    var lineWidth = 1;
    selectLineWidth();

    // 选择模式
    var drawing = false;
    var model = 'brush';
    selectModel();

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
    



    function listenUser() {
        if ('ontouchstart' in document.documentElement) {
            canvas.ontouchstart = function(event){
                drawing = true;
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
                // 知识点：非 drawing 直接 return
                if (!drawing) {
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
                drawing = false;
            }
        } else {
            canvas.onmousedown = function (event) {
                drawing = true;
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
                // 知识点：非 drawing 直接 return
                if (!drawing) {
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
                drawing = false;
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



    // 选择模式 工具函数
    function selectModel() {
        brush.onclick = function () {
            switchModel('brush', this, eraser)
        }
        eraser.onclick = function () {
            switchModel('eraser', this, brush)
        }
    }
    function switchModel(mode,ele,init){
        model = mode;
        ele.classList.add('modelActive');
        init.classList.remove('modelActive');
    }

    // 选择线宽 工具函数
    function selectLineWidth() {
        context.lineWidth = lineWidth;
        thin.onclick = function () {
            setLineWidth(this, 1)
        }
        middle.onclick = function () {
            setLineWidth(this, 2)
        }
        thick.onclick = function () {
            setLineWidth(this, 4);
        }
    }
    function setLineWidth(ele, width) {
        lineWidth = width;
        addClassName(ele, 'activeLineWidth')
    }
    function addClassName(ele, className) {
        var childs = ele.parentNode.childNodes;
        for (var i = 0, len = childs.length; i < len; i++) {
            childs[i].classList.remove(className);
        }
        ele.classList.add(className);
    }



}



