/**
 * author levi
 * url http://levi.cg.am
 */

(function ($) {

    $.fn.Mdrag = function (options) {
        //创建一些默认值，拓展任何被提供的选项
        var settings = $.extend({
            'item': '.box',//移动元素
            'controller': '.mdrag-change'//缩放控制元素
            , 'rotate': '.mdrag-rotate'
        }, options);
        var moveObj = {
            'move': false,
            'move_target': null,
            'call_down': false,
            'call_up': false
        };

        return this.each(function () {
            var obj = $(this);//父元素，移动范围
            var offset = obj.offset();//父元素边距
            //隐藏控制器
            var curBox;
            $('html').mousedown(function () {
                $('.mdrag-cl', this).hide();
            });
            //监测鼠标移动
            obj.mousemove(function (e) {
                if (!!moveObj.move) {
                    var posix = !moveObj.move_target ? {'x': 0, 'y': 0} : moveObj.move_target.posix,
                        callback = moveObj.call_down || function () {
                                // console.log(e.pageY)
                                $(moveObj.move_target).css({
                                    'top': e.pageY - posix.y,
                                    'left': e.pageX - posix.x
                                });
                            };

                    callback.call(this, e, posix);
                }
                return false;
            }).mouseup(function (e) {
                if (!!moveObj.move) {
                    var callback = moveObj.call_up || function () {
                        };
                    callback.call(this, e);
                    $.extend(moveObj, {
                        'move': false,
                        'move_target': null,
                        'call_down': false,
                        'call_up': false
                    });
                }
            });


            obj.on('mousedown', settings.item, function (e) {
                $('.mdrag-cl', curBox).hide();
                curBox = this;
                if (!moveObj.move) {
                    $.extend(moveObj, {'move': true, 'move_target': this});
                    var item = $(this);
                    if ($('.mdrag-change', this).length < 1) {
                        item.append('<div class="mdrag-rotate mdrag-cl"></div> <div class="mdrag-change mdrag-rb mdrag-cl" data-type="3"></div> <div class="mdrag-cl mdrag-change mdrag-lb" data-type="3"></div> <div class="mdrag-cl mdrag-change mdrag-rt" data-type="3"></div> <div class="mdrag-cl mdrag-change mdrag-lt" data-type="3"></div> <div class="mdrag-cl mdrag-change mdrag-r" data-type="2"></div> <div class="mdrag-cl mdrag-change mdrag-l" data-type="2"></div> <div class="mdrag-cl mdrag-change mdrag-t" data-type="1"></div> <div class="mdrag-cl mdrag-change mdrag-b" data-type="1"></div>');
                    } else {
                        $('.mdrag-cl', moveObj.move_target).show();
                    }
                    this.posix = {'x': e.pageX - parseInt(item.css('left')), 'y': e.pageY - parseInt(item.css('top'))};
                    //console.log(this.posix)
                    //大小控制器
                    var controller = $(settings.controller, this);
                    controller.unbind('mousedown').mousedown(function (e) {
                      var itemW=item.width();
                        var itemH=item.height();
                        var posix = {
                            'ox':parseInt(item.css('left'))+offset.left+itemW/2,//元素中心坐标
                            'oy':parseInt(item.css('top'))+offset.top+itemH/2,
                            'w': itemW,
                            'h': itemH,
                            'x': e.pageX,//鼠标点击坐标
                            'y': e.pageY
                        };
                        posix['type']=0;//变化方向
                        var cType=$(this).attr('data-type');
                        switch (cType){
                            case 2://宽度变化

                                break;

                        }

                        $.extend(moveObj, {
                            'move': true, 'call_down': function (e) {
                                var option={};
                                var cX=e.pageX - posix.x;//x轴变化
                                var cY=e.pageY - posix.y//y轴变化
                                if (cType==2) option['width']=cX+ posix.w;
                                item.css(option);
                                //item.css({
                                //    'width': Math.max(30, e.pageX - posix.x + posix.w),
                                //    'height': Math.max(30, e.pageY - posix.y + posix.h)
                                //});
                            }
                        });
                        return false;
                    });

                    var b_dw, b_dh, b_top, b_left;
                    //旋转控制开始
                    var rotateCl = $(settings.rotate, item);
                    rotateCl.mousedown(function (e9) {
                        event.stopPropagation();
                        var x9 = e9.pageX;
                        var y9 = e9.pageY;
                        b_dw = item.width();
                        b_dh = item.height();
                        b_top = parseInt(item.css('top'));
                        b_left = parseInt(item.css('left'));
                        var x0 = b_left + b_dw / 2 + offset.left;
                        var y0 = b_top + b_dh / 2 + offset.top;
                        var a1 = Math.atan2(x0 - x9, y0 - y9);
                        a1 = a1 * 180 / Math.PI;
                        var rotate =parseInt(item.attr('data-rotate'));
                        $.extend(moveObj, {
                            'move': true, 'call_down': function (ev9) {
                                var _x9 = ev9.pageX;
                                var _y9 = ev9.pageY;
                                var a2 = Math.atan2(x0 - _x9, y0 - _y9);
                                a2 = a2 * 180 / Math.PI;
                                var value = rotate - a2 + a1;
                                item.attr('data-rotate', value)
                                item.css({
                                    "transform": "rotate(" + value + "deg)",
                                    "-webkit-transform": "rotate(" + value + "deg)",
                                    "-moz-transform": "rotate(" + value + "deg)",
                                    "-ms-transform": "rotate(" + value + "deg)",
                                    "-o-transform": "rotate(" + value + "deg)"
                                });
                            }
                        });
                    });
//旋转控制结束
                }
                return false;
            });


        });

    };
})(jQuery);