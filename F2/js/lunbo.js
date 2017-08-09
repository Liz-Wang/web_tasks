$(document).ready(function() { 
    var currentIndex = 0;//当前页“页码”
    var interval;
    var hasStarted = false;//是否已经开始轮播 
    var t = 3000; //轮播时间间隔 
    var length = $('.slider-panel').length; 
    //开始轮播 
    start(); 
    //开始就将除了第一张图片隐藏 
    $('.slider-panel:not(:first)').hide(); 
    //将第一个slider-item（图片）设为激活状态（通过样式体现） 
    $('.slider-item:first').addClass('slider-item-selected'); 
    //隐藏向前、向后翻按钮 
    $('.slider-page').hide(); 
    //鼠标事件-图片
    $('.slider-panel, .slider-pre, .slider-next').hover(
        function() { //鼠标上悬时
        stop(); //停止轮播
        $('.slider-page').show(); //显示向前、向后翻按钮
        }, 
        function() { //鼠标离开时
        $('.slider-page').hide(); //隐藏向前、向后翻按钮
        start(); //开始轮播
    }); 
    //鼠标事件-页码
    $('.slider-item').hover(
        function(event) { 
            stop(); //停止轮播
            var preIndex = $(".slider-item").filter(".slider-item-selected").index(); //当前页作为起始页
            currentIndex = $(this).index(); //作为要到达的页
            play(preIndex, currentIndex); //实现跳转
        }, 
        function() { 
        start(); //鼠标离开开始轮播
    }); 
    $('.slider-pre').bind('click', function() { 
         pre(); //向前翻页
    });  
    $('.slider-next').bind('click', function() { 
        next(); //向后翻页
    }); 
    /** 
     * 向前翻页 
    */
    function pre() { 
        var preIndex = currentIndex; 
        currentIndex = (--currentIndex + length) % length; //使得可以循环播放的关键
        play(preIndex, currentIndex); 
     } 
    /** 
     * 向后翻页 
    */
    function next() { 
        var preIndex = currentIndex; 
        currentIndex = ++currentIndex % length; //使得可以循环播放的关键
        play(preIndex, currentIndex); 
    } 
    /** 
     * 实现翻页
     */
    function play(preIndex, currentIndex) { 
        $('.slider-panel').eq(preIndex).fadeOut(500) .parent().children().eq(currentIndex).fadeIn(1000); //遍历方式，淡入淡出
        $('.slider-item').removeClass('slider-item-selected'); //使得页标和图片的改变同步
        $('.slider-item').eq(currentIndex).addClass('slider-item-selected'); 
     } 
    /** 
     * 开始轮播 
     */
    function start() { 
        if(!hasStarted) { 
            hasStarted = true; 
            interval = setInterval(next, t); 
        } 
    } 
    /** 
     * 停止轮播 
     */
    function stop() { 
        clearInterval(interval); 
        hasStarted = false; 
    } 
    /**
     * 原生js touch事件实现触屏滑动,待完善
     */
    var mytouch = (function() {
        var x, y,
        doc = document,
        list = doc.getElementById("slider-main"),//获取图片        
        left = list.offsetLeft, //ul的左偏移量
        imgWidth=doc.getElementById("slider-panel").clientWidth,
        i = 0,
        // dots = doc.getElementsByClassName("dot"), //获取li.dot的集合，页码块
        len=list.length-1,
        totalWidth=imgWidth*len*(-1),
        speed = 350, //每次移动的距离
        isMoved = true; //判断touchmove事件是否要切换图片（第一次移动时切换图片，连续移动，后面的不切换图片）
       
        var changeImg = function() { //帮助切换图片
            if (left <= totalWidth) { //最后一张
                i = 0;
                left = 0;         
            } 
            else {
                i++;
                left -= speed;
            }
            list.style.left = left + "px";
        };
        return { //返回对象
            tStart: function(event) { //获取触摸到屏幕时的坐标
                if (isMoved) {
                    stop();
                    var touches = event.targetTouches;
                    if (touches.length == 1) {
                        x = touches[0].pageX;
                        y = touches[0].pageY;
                        console.log(x);//帮助调试
                    }
                isMoved = false;
                }
            },
            tMove: function(event) { //手指在屏幕上移动时触发左/右/上/下滑事件
                // event.preventDefault(); //默认事件滚动
                if (!isMoved) { //只有手指第一次在屏幕上滑动时，并且满足响应条件，才触发左/右/上/下滑事件
                    var touches = event.targetTouches;
                    if (touches.length == 1) { //一个手指在屏幕上
                        var x1 = touches[0].pageX; //移动到的坐标
                        var y1 = touches[0].pageY;
                        if (((x1 + 30) < x) && (Math.abs(y1 - y) < 20)) { //触摸左滑动
                            isMoved = true; //设置为true，手指在屏幕上连续滑动时，后面满足条件的移动不再触发该事件
                            //向左切换图片
                            next();
                        }
                        if (((x1 - 30) > x) && (Math.abs(y1 - y) < 20)) { //触摸右滑动
                            isMoved = true;
                            //向右切换图片
                            if (left >= 0) {
                                i =len;
                                left = totalWidth;
                            } else {
                                i--;
                                left += speed;
                            }
                            list.style.left = left + "px";
                            pre();
                        }
                       
                    }
                }
            },
            tEnd: function() {
                start(); //开启自动切换图片   
            }
        };
    })();
    document.addEventListener("touchstart", mytouch.tStart, false);
    document.addEventListener("touchmove", mytouch.tMove, false);
    document.addEventListener("touchend", mytouch.tEnd, false);
}); 
