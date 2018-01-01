window.onload = function(){  
    //获取元素
    var canvas = document.getElementById('canvas');
    var brush = document.getElementById('brush');
    var eraser = document.getElementById('eraser');
    var set = document.getElementById('set');
    // 初始化
    var context = canvas.getContext('2d');
    setPageSize(canvas);
    var point = {x:'',y:''};
    // 监听鼠标事件
    listenToMouse()
    // 更改模式
    var using = false;
    var model = 'brush';
    brush.onclick = function(){
        model = 'brush';
        set.className = 'set draw'
    }
    eraser.onclick = function(){
        model = 'eraser';
        set.className = 'set clean'
    }

    function listenToMouse(){
        document.onmousedown = function (event) {
            using = true;
            var x = event.clientX;
            var y = event.clientY;
            if (model === 'brush') {
                point.x = x;
                point.y = y;
                drawCircle(x, y, 2, 'red');
                return point;
            } else {
                clean((x - 3), (y - 3), 6, 6);
            }

        }
        document.onmousemove = function (event) {
            var x = event.clientX;
            var y = event.clientY;
            // 知识点：非 using 直接 return
            if (!using) {
                return
            }
            if (model === 'brush') {
                drawLine(point.x, point.y, x, y, 'red', 4);
                // 知识点：更新位置
                point.x = x;
                point.y = y;
            } else {
                clean((x - 2), (y - 2), 4, 4);
            }
        }
        document.onmouseup = function () {
            using = false;
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
    function clean(x, y, width, height){
        context.clearRect(x, y, width, height)
    }
}