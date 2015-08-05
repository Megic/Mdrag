/**
 * author Megic
 *
 */

(function ($) {

    $.fn.Mdrag = function (options) {
        //创建一些默认值，拓展任何被提供的选项
        var settings = $.extend({
            'item': '.mdrag-box',//移动元素
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
            //点击html隐藏控制器
            var curBox;
            $('html').mousedown(function () {
                $(settings.item, this).removeClass('mdrag-show');
            });
            //监测鼠标移动
            obj.mousemove(function (e) {
                if (!!moveObj.move) {
                    var posix = !moveObj.move_target ? {'x': 0, 'y': 0} : moveObj.move_target.posix,
                        callback = moveObj.call_down || function () {
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
                if (curBox)curBox.removeClass('mdrag-show');
                curBox = $(this);
                curBox.addClass('mdrag-show');
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
                        var clObj = $(this);
                        var itemW = item.width();
                        var itemH = item.height();
                        var posix = {
                            'top': parseInt(item.css('top')),
                            'left': parseInt(item.css('left')),
                            'ox': parseInt(item.css('left')) + offset.left + itemW / 2,//元素中心坐标
                            'oy': parseInt(item.css('top')) + offset.top + itemH / 2,
                            'w': itemW,
                            'h': itemH,
                            'x': e.pageX,//鼠标点击坐标
                            'y': e.pageY
                        };
                        var direction;
                        var cType = clObj.attr('data-type');
                        switch (cType) {
                            case '1'://高度变化
                                direction = e.pageY < posix.oy;
                                clObj.css('cursor', 's-resize');
                                break;
                            case '2'://宽度变化
                                direction = e.pageX < posix.ox;
                                clObj.css('cursor', 'w-resize');
                                break;
                            case '3'://整体变化
                                if ((e.pageY > posix.oy) && (e.pageX > posix.ox)) {
                                    direction = 'rb';
                                    clObj.css('cursor', 'se-resize');
                                }//右下
                                if ((e.pageY < posix.oy) && (e.pageX > posix.ox)) {
                                    direction = 'rt';
                                    clObj.css('cursor', 'ne-resize');
                                }//右上
                                if ((e.pageY > posix.oy) && (e.pageX < posix.ox)) {
                                    direction = 'lb';
                                    clObj.css('cursor', 'ne-resize');
                                }//左下
                                if ((e.pageY < posix.oy) && (e.pageX < posix.ox)) {
                                    direction = 'lt';
                                    clObj.css('cursor', 'se-resize');
                                }//左上
                                break;

                        }
                        $.extend(moveObj, {
                            'move': true, 'call_up': function () {
                                clObj.css('cursor', 'crosshair');
                            }, 'call_down': function (e) {
                                var option = {};
                                var cX = e.pageX - posix.x;//x轴变化
                                var cY = e.pageY - posix.y;//y轴变化
                                if (cType == 2) {//宽度变化
                                    option['width'] = !direction ? cX + posix.w : posix.w - cX;
                                    if (direction) {
                                        option['left'] = posix.left + cX;
                                    }
                                }
                                if (cType == 1) {//高度变化
                                    option['height'] = !direction ? cY + posix.h : posix.h - cY;
                                    if (direction) {
                                        option['top'] = posix.top + cY;
                                    }
                                }
                                if (cType == 3) {//宽高变化
                                    if (direction == 'rb') {
                                        option['height'] = posix.h + cY;
                                        option['width'] = cX + posix.w;
                                    }
                                    if (direction == 'rt') {
                                        option['height'] = posix.h - cY;
                                        option['width'] = cX + posix.w;
                                        option['top'] = posix.top + cY;
                                    }
                                    if (direction == 'lt') {
                                        option['height'] = posix.h - cY;
                                        option['width'] = posix.w - cX;
                                        option['top'] = posix.top + cY;
                                        option['left'] = posix.left + cX;
                                    }
                                    if (direction == 'lb') {
                                        option['height'] = posix.h + cY;
                                        option['width'] = posix.w - cX;
                                        option['left'] = posix.left + cX;
                                    }

                                }
                                item.css(option);
                            }
                        });
                        return false;
                    });


                    //旋转控制开始
                    var b_dw, b_dh, b_top, b_left;
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
                        var rotate = parseInt(item.attr('data-rotate'));
                        $.extend(moveObj, {
                            'move': true, 'call_down': function (ev9) {
                                var _x9 = ev9.pageX;
                                var _y9 = ev9.pageY;
                                var a2 = Math.atan2(x0 - _x9, y0 - _y9);
                                a2 = a2 * 180 / Math.PI;
                                var value = rotate - a2 + a1;
                                item.attr('data-rotate', value);
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