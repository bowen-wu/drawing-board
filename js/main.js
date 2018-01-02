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
    var download = document.getElementById('download');
    var context = canvas.getContext('2d');
    var lineWidth = 1;
    var drawing = false;
    var model = 'brush';
    var lineColor = black;
    var point = {
        x: '',
        y: ''
    };

    init()
    

    // init 工具函数
    function init() {
        // 准备
        prepare();
        // 监听用户事件
        listenUser();
        // 选择线宽
        selectLineWidth();
        // 选择模式
        selectModel();
        // 清屏
        clearScreen();
        // 调色
        changeColor();
        // 下载
        saveCanvas();
    }

    // 准备 工具函数
    function prepare() {
        setPageSize()
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    function setPageSize() {
        preparePageSize(canvas);
        // 知识点：监控页面变化，随时进行更新
        window.onresize = function () {
            preparePageSize();
        }
    }
    function preparePageSize() {
        // 知识点：获取页面宽高
        var pageWidth = document.documentElement.clientWidth;
        var pageHeight = document.documentElement.clientHeight;
        canvas.width = pageWidth;
        canvas.height = pageHeight;
    }
    // 用户事件 工具函数
    function listenUser() {
        if ('ontouchstart' in document.documentElement) {
            mobile();
        } else {
            PC();
        }
    }
    function mobile(){
        canvas.ontouchstart = function(event){
            startEvent(event.touches[0]);
        }
        canvas.ontouchmove = function(){
            moveEvent(event.touches[0]);
        }
        canvas.ontouchend = function(){
            drawing = false;
        }
    }
    function PC(){
        canvas.onmousedown = function (event) {
            startEvent(event)
        }
        canvas.onmousemove = function (event) {
            moveEvent(event);
        }
        canvas.onmouseup = function () {
            drawing = false;
        }
    }
    function startEvent(pos) {
        drawing = true;
        var x = pos.clientX;
        var y = pos.clientY;
        if (model === 'brush') {
            point.x = x;
            point.y = y;
            drawCircle(x, y, lineWidth / 2, lineColor);
            return point;
        } else {
            clear((x - 5), (y - 5), 10, 10);
        }
    }
    function moveEvent(pos) {
        var x = pos.clientX;
        var y = pos.clientY;
        // 知识点：非 drawing 直接 return
        if (!drawing) {
            return
        }
        if (model === 'brush') {
            drawLine(point.x, point.y, x, y, lineColor, lineWidth);
            // 知识点：更新位置
            point.x = x;
            point.y = y;
        } else {
            clear((x - 5), (y - 5), 10, 10);
        }
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
        var childs = filterElementNode(ele.parentNode.childNodes);
        for (var i = 0, len = childs.length; i < len; i++) {
            childs[i].classList.remove(className);
        }
        ele.classList.add(className);
    }
    // 清屏 工具函数
    function clearScreen() {
        empty.onclick = function () {
            clear(0, 0, canvas.width, canvas.height);
            this.classList.add("animated", "shake");
            setTimeout(() => {
                this.classList.remove("animated", "shake");
            }, 1000);
        }
    }
    // 调色 工具函数
    function changeColor() {
        paletteEvent();
        selectColorEvent();
    }
    function paletteEvent() {
        var paletteing = false;
        palette.onclick = function () {
            paletteing = switchStatus(this,paletteing)
        }
    }
    function switchStatus(ele,status){
        if (!status) {
            ele.classList.add('paletteActive');
            colors.classList.add('colorsActive');
            return status = true;
        } else {
            ele.classList.remove('paletteActive');
            colors.classList.remove('colorsActive');
            return status = false;
        }
    }
    function selectColorEvent() {
        var color = filterElementNode(colors.childNodes);
        colors.onclick = function (event) {
            lineColor = event.target.style.backgroundColor;
            palette.style.fill = lineColor;
        }
    }
    // 下载 工具函数
    function saveCanvas() {
        download.onclick = function () {
            var a = document.createElement('a');
            document.body.appendChild(a);
            var imgName = window.prompt('请您为您的爱图保存名字：', '');
            if (imgName) {
                a.setAttribute('download', imgName + '.png');
                a.setAttribute('href', canvas.toDataURL("image/png"));
                a.click();
            } else {
                return;
            }
        }
    }
    // 画图 工具函数
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
    // 筛选元素节点
    function filterElementNode(nodes){
        var node=[];
        for(var i=0, len=nodes.length;i<len;i++){
            if(nodes[i].nodeType === 1){
                node.push(nodes[i]);
            }
        }
        return node;
    }
}



