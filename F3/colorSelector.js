 ;(function(){
     var Draggable = function(options){
        var defaults = {
            onStart: "",//开始滑动回调
            onMove: "",//滑动过程回调
            onEnd: "",//滑动结束回调
            moveX: false,//仅在X轴滑动
            moveY: false,//仅在Y轴滑动
            container: "",//父容器
            offsetX: 0,
            offsetY: 0,
            handler: "",//滑动的元素
        };
        var settings = $.extend(defaults, options);//extend用于合并
        var $container = $(settings.container), 
        container = $container.get(0);
        var hasContainer = $container.length == 1 ? true : false;
        if (hasContainer){
            var $handler = $container.find(settings.handler);
        }else{
            var $handler = $(settings.handler);
        }
        var handler = $handler.get(0);
        
        var oldLeft, 
        oldTop, 
        mouseX, 
        mouseY, 
        oldWidth, 
        oldHeihgt, 
        isDown = false;
        //判断是否都在容器中
        var containerWidth = hasContainer ? $container.width() : window.innerWidth;
        var containerHeight = hasContainer ? $container.height() : window.innerHeight;
        var containerLeft = hasContainer ? getPosition(container).left : 0;
        var containerTop = hasContainer ? getPosition(container).top : 0;
        //触点left,top范围。保证移动范围是container的宽高
        var dx = Math.floor($handler.width()/2), 
            dy = Math.floor($handler.height()/2);
        var range = {
            left:{max: containerWidth-dx, min: -dx}, 
            top:{max: containerHeight-dy, min: -dy},
        };

        var lastPos, hasMoved = false;//用于最后
        //监听圆圈事件，利用on()函数
        $handler.on("mousedown", function(e){
            e.stopPropagation();
            e.preventDefault();
            isDown = true;      
            var position = getPosition(this, this.parentNode);//获得位置数组
            oldLeft = position.left;
            oldTop = position.top;
            $(this).css({
                position: "absolute",
                left: oldLeft,
                top: oldTop,
                margin: 0,
            });
            mouseX = e.pageX;
            mouseY = e.pageY;
            oldWidth = $handler.width();
            oldHeihgt = $handler.height();
            if ($.isFunction(settings.onStart)){
                settings.onStart.call(//设置该事件中会用到的内容
                    handler, 
                    {left: oldLeft, top: oldTop}, 
                    {left: dx, top: dy}, 
                    container, 
                    {width: containerWidth, height: containerHeight});
            }
        });
        //监听色轮滑块事件，利用on()函数
        $(document).on("mousemove mouseup", function(e){
            e.stopPropagation();
            e.preventDefault();
            if (e.type === "mouseup"){
                isDown = false;
                if (hasMoved && $.isFunction(settings.onEnd)){
                        settings.onEnd.call(//设置该事件中会用到的内容
                            handler, 
                            lastPos, 
                            {left: dx, top: dy}, 
                            container, 
                            {width: containerWidth, height: containerHeight})
                }
            }else if (e.type === "mousemove"){
                if (!isDown){
                    return;
                }
                hasMoved = true;
                var currLeft = oldLeft + e.pageX - mouseX;
                var currTop = oldTop + e.pageY - mouseY;
                currLeft = Math.min(currLeft, range.left.max);
                currLeft = Math.max(currLeft, range.left.min);
                currTop = Math.min(currTop, range.top.max);
                currTop = Math.max(currTop, range.top.min);
                ////console.log(currLeft, currTop);
                if (settings.moveX === true && settings.moveY === false){
                    $handler.css({
                        left: currLeft,
                    });
                }else if(settings.moveX === false && settings.moveY === true){
                    $handler.css({
                        top: currTop,
                    });
                }else{
                    $handler.css({
                        top: currTop,
                        left: currLeft,
                    });
                }
                lastPos = {left: currLeft, top: currTop};
                if ($.isFunction(settings.onMove)){
                    settings.onMove.call(
                        handler, 
                        {left: currLeft, top: currTop}, 
                        {left: dx, top: dy}, 
                        container, 
                        {width: containerWidth, height: containerHeight});
                }               
            }
        });
        //监听hsv文本框的数据变化
        $(".color-show-h,.color-show-s,.color-show-l").bind('input propertychange', function(){
            var H = $(".color-show-h").val();
            var S = $(".color-show-s").val();
            var L = $(".color-show-l").val();
            //判断数据范围
            if(359>H>0 && 100>S>0 && 100>L>0 ){
                var H1 = Number(H);//改变色轮滑块的位置
                var top = (360 - H1)*256/360-4;
                $("#color-l-value").css("top",top);
                var Hcolor = getHcolor(top, 256);
                $slWrap.css("background-color", Hcolor);

                var rgb = hsv2rgb(H/360, S/100, L/100);//根据hsv的值来计算rgb的值
                $showR.val(rgb.r);
                $showG.val(rgb.g);
                $showB.val(rgb.b);
                var hsl2 = rgbToHsl(rgb.r,rgb.g,rgb.b);

                $showH2.val(hsl2.h);//计算出hsl的值
                $showS2.val(hsl2.s);
                $showL2.val(hsl2.l);

                var rgbStr = "("+rgb.r+","+rgb.g+","+rgb.b+")";//设定颜色描述区的内容
                $showRGB.text(rgbStr);//显示rgb
                $preview.css("background-color", "rgb"+rgbStr);//显示选中颜色
                $showHex.text("#"+rgb.r.toString(16)+rgb.g.toString(16)+rgb.b.toString(16));//显示16进制数
            }
            else{
                alert("输入错误！HSV(B)中：0<H<359, 0 < S < 100,  0<V<100");
            }
        });
        //监听rgb文本框的数据变化
        $(".color-show-r,.color-show-g,.color-show-b").bind('input propertychange', function(){
            var r = Number($(".color-show-r").val());
            var g = Number($(".color-show-g").val());
            var b = Number($(".color-show-b").val());
            
            if(255>r>0 && 255>g>0 && 255>b>0 ){//规定rgb的范围
                var hsl = rgbToHsv(r, g, b);
                $showH.val(hsl.h);
                $showS.val(hsl.s);
                $showL.val(hsl.l);

                var H1 = Number(hsl.h);//改变色轮滑块的位置
                var top = (360 - H1)*256/360-4;
                $("#color-l-value").css("top",top);
                var Hcolor = getHcolor(top, 256);
                $slWrap.css("background-color", Hcolor);

                var hsl2 = rgbToHsl(r,g,b);//改变hsl的值
                $showH2.val(hsl2.h);
                $showS2.val(hsl2.s);
                $showL2.val(hsl2.l);

                var rgbStr = "("+r+","+g+","+b+")";//对应设置色彩描述区的内容
                $showRGB.text(rgbStr);//显示rgb
                $preview.css("background-color", "rgb"+rgbStr);//显示选中颜色
                console.log(r.toString(16));
                $showHex.text("#"+r.toString(16)+g.toString(16)+b.toString(16));//显示16进制数
            }
            else{
                alert("输入错误！RGB中：0<R<255，0<G<255， 0<B<255");
            }
        });
        $(".color-show-h2,.color-show-s2,.color-show-l2").bind('input propertychange', function(){
            var H2 = Number($(".color-show-h2").val());
            var S2 = Number($(".color-show-s2").val());
            var L2 = Number($(".color-show-l2").val());
            if(359>H2>0 && 100>S2>0 && 100>L2>0 ){
                var rgb = hslTorgb(H2, S2, L2);//使得rgb和hsl一一对应
                $showR.val(rgb.r);
                $showG.val(rgb.g);
                $showB.val(rgb.b);
                var rgbStr = "("+rgb.r+","+rgb.g+","+rgb.b+")";

                $showRGB.text(rgbStr);//显示rgb
                $preview.css("background-color", "rgb"+rgbStr);//显示选中颜色
                $showHex.text("#"+rgb.r.toString(16)+rgb.g.toString(16)+rgb.b.toString(16));//显示16进制数
                
                var hsl = rgbToHsv(rgb.r, rgb.g, rgb.b);//设置hsv
                $showH.val(hsl.h);
                $showS.val(hsl.s);
                $showL.val(hsl.l);

                var H1 = Number(hsl.h);//改变色轮滑块的位置
                var top = (360 - H1)*256/360-4;
                $("#color-l-value").css("top",top);
                var Hcolor = getHcolor(top, 256);
                $slWrap.css("background-color", Hcolor);
            }
            else{
                alert("输入错误！HSL中：0<H<359, 0 < S < 100,  0<L<100");
            }
        })
    }

    var getPosition = function(elem, parent){ 
        var x = 0, y = 0, stop = null;
        if (parent){
                stop = parent;
        }
        while(elem !== stop){
                x += elem.offsetLeft;
                y += elem.offsetTop;
                elem = elem.offsetParent;
            }
            return {left: x, top: y};
    }

    window.Draggable = Draggable;

    //处理颜色部分
    var H = 354, S = 42, L = 58;//随意给的三个值
    var $showH = $(".color-show-h"), $showS = $(".color-show-s"), $showL = $(".color-show-l");
    var $showH2 = $(".color-show-h2"), $showS2 = $(".color-show-s2"), $showL2 = $(".color-show-l2");
    var $showR = $(".color-show-r"),$showG = $(".color-show-g"),$showB = $(".color-show-b");
    var $showRGB = $(".color-show-rgb"), $showHex = $(".color-show-shiliu"), $slWrap = $("#color-hs");
    var $preview = $("#color-preview");

    //获得S(Saturation，饱和度)，从左到右升高  , L(Lightness，亮度) 从上往下降低
    new Draggable({
        container: "#color-hs",
        handler: "#color-hs-value",
        moveX: true,
        moveY: true,
        onMove: function(elemPos, dPos, container, containerWH){
            var H = $showH.val();
            S = (100/containerWH.width)*(elemPos.left + dPos.left);
            $showS.val(Math.round(S));//显示s
            L = 100 - (100/containerWH.height)*(elemPos.top + dPos.top);
            $showL.val(Math.round(L));//显示L
            var rgb = hsv2rgb(H/360, S/100, L/100);
            
            $showR.val(rgb.r);
            $showG.val(rgb.g);
            $showB.val(rgb.b);

            var hsl2 = rgbToHsl(rgb.r,rgb.g,rgb.b);
            $showH2.val(hsl2.h);
            $showS2.val(hsl2.s);
            $showL2.val(hsl2.l);
            var rgbStr = "("+rgb.r+","+rgb.g+","+rgb.b+")";

            $showRGB.text(rgbStr);//显示rgb
            $preview.css("background-color", "rgb"+rgbStr);//显示选中颜色
            $showHex.text("#"+rgb.r.toString(16)+rgb.g.toString(16)+rgb.b.toString(16));//显示16进制数
            //$slWrap.css("background-color","rgb"+rgbStr);//因为背景色是h上选择的
        }
    });

    //获得H(Hue，色调)  右边
    new Draggable({
        container: "#color-l",
        handler: "#color-l-value",
        moveY: true,
        onStart: function(elemPos, dPos, container, containerWH){
            var Hcolor = getHcolor(elemPos.top+dPos.top, containerWH.height);
            H =360 - (360/containerWH.height)*(elemPos.top + dPos.top);
            if (H == 360){
                H = 0;
            }
            $showH.val(Math.round(H));
            $slWrap.css("background-color", Hcolor);
        },
        onMove: function(elemPos, dPos, container, containerWH){
            
            var Hcolor = getHcolor(elemPos.top+dPos.top, containerWH.height);

            H =360 - (360/containerWH.height)*(elemPos.top + dPos.top);
            if (H == 360){
                H = 0;
            }
            $showH.val(Math.round(H));
            var rgb = hsv2rgb(H/360, S/100, L/100);
            
            var rgbStr = "("+rgb.r+","+rgb.g+","+rgb.b+")";//设置rgb
            $showR.val(rgb.r);
            $showG.val(rgb.g);
            $showB.val(rgb.b);

            var hsl2 = rgbToHsl(rgb.r,rgb.g,rgb.b);//设置hsl
            $showH2.val(hsl2.h);
            $showS2.val(hsl2.s);
            $showL2.val(hsl2.l);
            $showRGB.text(rgbStr);

            $preview.css("background-color", "rgb"+rgbStr);//设置颜色描述
            $slWrap.css("background-color", Hcolor);
            $showHex.text("#"+rgb.r.toString(16)+rgb.g.toString(16)+rgb.b.toString(16));
        }
    });

    //获得色轮任意一度的颜色值。top：滑动离顶端的距离，height：柱子的高度
    function getHcolor(top, height){
        var oneHeight = height/6;
        var d = 0, rgbStr;
        if (top < oneHeight*1){
            d = (top/oneHeight)*255;
            rgbStr = "rgb(255,0,"+Math.round(d)+")";

        }else if(top >= oneHeight && top < 2*oneHeight){
            d = 255 - ((top-oneHeight)/oneHeight)*255;
            rgbStr = "rgb("+Math.round(d)+",0,255)";

        }else if(top >= 2*oneHeight && top < 3*oneHeight){
            d = ((top-2*oneHeight)/oneHeight)*255;
            rgbStr = "rgb(0,"+Math.round(d)+",255)";

        }else if(top >= 3*oneHeight && top < 4*oneHeight){
            d = 255-((top-3*oneHeight)/oneHeight)*255;
            rgbStr = "rgb(0,255,"+Math.round(d)+")";

        }else if(top >= 4*oneHeight && top < oneHeight*5){
            d = ((top-oneHeight*4)/oneHeight)*255;
            rgbStr = "rgb("+Math.round(d)+",255,0)";

        }else{
            d = 255 - ((top-oneHeight*5)/oneHeight)*255;
            rgbStr = "rgb(255,"+Math.round(d)+",0)";
        }
        return rgbStr;
    }

    //HSB(V)转换为RGB，0<=H<1，0<=S,V<=1
    function hsv2rgb(H, S, V){
        var R, G, B;
        if (S == 0){
            R = G = B = V;
        }else{
            var _H = H * 6;
            if (_H == 6){
                _H = 0;
            }
            var i = Math.floor(_H);
            var v1 = V*(1 - S);
            var v2 = V*(1 - S*(_H - i ));
            var v3 = V*(1 - S*(1 - (_H - i)));
            if (i == 0){
                R = V;
                G = v3;
                B = v1;
            }else if(i == 1){
                R = v2;
                G = V;
                B = v1;
            }else if(i == 2){
                R = v1;
                G = V;
                B = v3;
            }else if(i == 3){
                R = v1;
                G = v2;
                B = V;
            }else if(i == 4){
                R = v3;
                G = v1;
                B = V;
            }else{
                R = V;
                G = v1;
                B = v2; 
            }
        }
        return {r: Math.round(R*255), g: Math.round(G*255), b: Math.round(B*255)};//返回RGB数组
    }
    //rgh转化成hsv
    function rgbToHsv(R, G, B){ 
        var var_R = ( R / 255 );
        var var_G = ( G / 255 );
        var var_B = ( B / 255 );
        var H,S,V;

        var var_Min = Math.min( var_R, var_G, var_B ) ;   //Min. value of RGB
        var var_Max = Math.max( var_R, var_G, var_B );    //Max. value of RGB
        var del_Max = var_Max - var_Min;            //Delta RGB value

        var V = var_Max;

        if ( del_Max == 0 )                     //This is a gray, no chroma...
        {
            H = 0;
            S = 0;
        }
        else                                    //Chromatic data...
        {
            S = del_Max / var_Max;

            var del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
            var del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
            var del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max;

            if      ( var_R == var_Max ) H = del_B - del_G
            else if ( var_G == var_Max ) H = ( 1 / 3 ) + del_R - del_B
            else if ( var_B == var_Max ) H = ( 2 / 3 ) + del_G - del_R

            if ( H < 0 ) H += 1
            if ( H > 1 ) H -= 1
        }
            return {h: Math.round(H*360),s: Math.round(S*100),l: Math.round(V*100)};
    }
    //rgb转化成hsl
    function rgbToHsl(R, G, B){
        var var_R = ( R / 255 );
        var var_G = ( G / 255 );
        var var_B = ( B / 255 );
        var H,S,L;
        var var_Min = Math.min( var_R, var_G, var_B ) ;   
        var var_Max = Math.max( var_R, var_G, var_B ) ;   
        var del_Max = var_Max - var_Min ;            

        L = ( var_Max + var_Min )/ 2;

        if ( del_Max == 0 )                    
        {
            H = 0;
            S = 0;
        }
        else                                    
        {
            if ( L < 0.5 ) S = del_Max / ( var_Max + var_Min );
            else   S = del_Max / ( 2 - var_Max - var_Min );

            var del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
            var del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
             var del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max;

            if( var_R == var_Max ) H = del_B - del_G;
            else if ( var_G == var_Max ) H = ( 1 / 3 ) + del_R - del_B;
            else if ( var_B == var_Max ) H = ( 2 / 3 ) + del_G - del_R;

            if ( H < 0 ) H += 1;
            if ( H > 1 ) H -= 1;
        }
        return{h: Math.round(H*360),s: Math.round(S*100),l: Math.round(L*100)};
    }
    //hsl转化成rgb
    function hslTorgb(H, S, L){
        H = H/360;
        S = S/100;
        L = L/100;
        var R,G,B;
        var var_1,var_2;
        if ( S == 0 )
        {
           R = L * 255;
           G = L * 255;
           B = L * 255;
        }
        else
        {
           if ( L < 0.5 ) var_2 = L * ( 1 + S );
           else           var_2 = ( L + S ) - ( S * L );

            var_1 = 2 * L - var_2;

           R = 255 * Hue_2_RGB( var_1, var_2, H + ( 1 / 3 ) );
           G = 255 * Hue_2_RGB( var_1, var_2, H );
           B = 255 * Hue_2_RGB( var_1, var_2, H - ( 1 / 3 ) );
        }
        return {r: Math.round(R), g: Math.round(G), b: Math.round(B)};//返回RGB数组
    }
    function Hue_2_RGB( v1, v2, vH ){
        if ( vH < 0 ) vH += 1;
        if( vH > 1 ) vH -= 1;
        if ( ( 6 * vH ) < 1 ) return ( v1 + ( v2 - v1 ) * 6 * vH );
        if ( ( 2 * vH ) < 1 ) return ( v2 );
        if ( ( 3 * vH ) < 2 ) return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 );
        return ( v1 );//Function Hue_2_RGB
    }

}());