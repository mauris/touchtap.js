/**
 * touchtap.js
 * version 1.0a
 * 
 * lovely multi-touch and gesture jQuery library
 * 
 * Copyright (c) 2010-2012, Sam-Mauris Yong
 */

(function($){
    
    var touchtap = {
        __longPressDelayMs: 800,
        __doubleTapIntervalMs: 800,
        _touchEnabled: false,
        _init: false,
        publicMethods:
            [
                'tap',
                'doubletap',
                'hold',
                'scroll',
                'scrollX',
                'scrollY',
                'pan'
            ],
        init: function(){
            this._touchEnabled = ('ontouchstart' in window);
            this._init = true;
        },
        config: function(){
            
        },
        tap: function(callback){
            var controller = new touchtap.eventController('tap', callback, this);
            controller.set();
            return this;
        },
        doubletap: function(callback){
            var controller = new touchtap.eventController('doubletap', callback, this);
            controller.set();
            return this;
        },
        getEventCoordinates: function (event){
            event = event || window.event;

            if(touchtap._touchEnabled) {
                // multitouch, return array with positions
                var pos = [];
                for(var i = 0, len= event.touches.length; i < len; ++i) {
                    pos.push({x: event.touches[i].pageX, y: event.touches[i].pageY});
                }
                return pos;
            } else {
                // non-touchy, use the event pageX and pageY
                var d = document;
                var b = d.body;

                return [{
                    x: event.pageX || event.clientX + (d && d.scrollLeft || b && b.scrollLeft || 0 ) - ( d && d.clientLeft || b && d.clientLeft || 0 ),
                    y: event.pageY || event.clientY + (d && d.scrollTop || b && b.scrollTop || 0 ) - ( d && d.clientTop || b && d.clientTop || 0 )
                }];
            }
        },
        eventController: function(eventType, callback, obj){
            return {
                touchData: {
                    startPosition: null,
                    curentPositions: null,
                    mousedown: false,
                    holdTimer: null,
                    firstTapDateTime: null
                },
                set: function(){
                    var events = [
                        'mousedown',
                        'mouseup',
                        'mouseout',
                        'mouseleave',
                        'touchstart',
                        'touchend',
                        'touchcancel',
                        'touchmove'
                    ];
                    var controller = this;
                    for(var e in events){
                        obj.on(events[e], function(event){
                                controller.handler.apply(controller, [event]);
                            });
                    }
                },
                handler: function(event){
                    var data = this.touchData;
                    switch(event.type){
                        case 'mousedown':
                        case 'touchstart':
                            data.start = touchtap.getEventCoordinates(event);
                            data.mousedown = true;
                            if(eventType == 'hold'){
                                data.holdTimer = window.setTimeout(function(){
                                        data.mousedown = false;
                                        data.holdTimer = null
                                        callback.apply(obj);
                                    }, touchtap.__longPressDelayMs);
                            }
                            break;
                        case 'mousemove':
                        case 'touchmove':
                            break;
                        case 'mouseout':
                        case 'mouseup':
                        case 'mouseleave':
                        case 'touchcancel':
                        case 'touchend':
                            if(data.mousedown){
                                // clear timer if the hold event is still there
                                if(data.holdTimer){
                                    window.clearTimeout(data.holdTimer);
                                    data.holdTimer = null;
                                }else if(eventType == 'doubletap'){
                                    if(data.firstTapDateTime){
                                        var interval = Date.now() - data.firstTapDateTime;
                                        if(interval < touchtap.__doubleTapIntervalMs){
                                            callback.apply(obj);
                                        }
                                        data.firstTapDateTime = null;
                                    }else{
                                        data.firstTapDateTime = Date.now();
                                    }
                                }else if(eventType == 'tap'){
                                    callback.apply(obj);
                                }
                            }
                            break;
                    }
                }
            };
        },
        hold: function(callback){
            var controller = new touchtap.eventController('hold', callback, this);
            controller.set();
            return this;
        },
        scrollHandler: function(obj, callback, orientation){
            return {
                start: null,
                enable: function(event){
                    if(!this.start){
                        event.preventDefault();
                        this.start = {x: event.pageX, y: event.pageY};
                    }
                },
                move: function(event){
                    event.preventDefault();
                    if(this.start){
                        var data = null;
                        var mag = null;
                        switch(orientation){
                            case 1: // x
                                data = this.start.x - event.pageX;
                                mag = Math.abs(data);
                                break;
                            case 2: // y
                                data = this.start.y - event.pageY;
                                mag = Math.abs(data);
                                break;
                            default:
                                data = {x: this.start.x - event.pageX,
                                    y: this.start.y - event.pageY};
                                mag = Math.max(Math.abs(data.x), Math.abs(data.y));
                                break;
                        }
                        if(mag > 2){
                            callback.apply(obj, [data]);
                            this.start = {x: event.pageX, y: event.pageY};
                        }
                    }
                },
                disable: function(event){
                    if(this.start){
                        event.preventDefault();
                        this.start = null;
                        this.direction = null;
                    }
                }
            }
        },
        scroll: function(callback){
            var handler = new touchtap.scrollHandler(this, callback);
            this.mousedown(handler.enable).mousemove(handler.move)
                .mouseup(handler.disable).mouseout(handler.disable);
            return this;
        },
        scrollX: function(callback){
            var handler = new touchtap.scrollHandler(this, callback, 1);
            this.mousedown(handler.enable).mousemove(handler.move)
                .mouseup(handler.disable).mouseout(handler.disable);
            return this;
        },
        scrollY: function(callback){
            var handler = new touchtap.scrollHandler(this, callback, 2);
            this.mousedown(handler.enable).mousemove(handler.move)
                .mouseup(handler.disable).mouseout(handler.disable);
            return this;
        },
        pan: function(callback){
            var handler = new touchtap.scrollHandler(this, callback);
            this.mousedown(handler.enable).mousemove(handler.move)
                .mouseup(handler.disable).mouseout(handler.disable);
            return this;
        }
    };
    
    if(!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(needle) {
            for(var i = 0; i < this.length; ++i) {
                if(this[i] === needle) {
                    return i;
                }
            }
            return -1;
        };
    }
    
    $.fn.touchtap = function(method){
        if(!touchtap._init){
            touchtap.init.apply(this);
        }
        if(touchtap.publicMethods.indexOf(method) > -1){
            return touchtap[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }else if(typeof method === 'object' || !method){
            return touchtap.config.apply(this, arguments);
        }else{
            $.error('Method "' +  method + '" does not exist on jQuery.touchtap.');
        }
        return this;
    };
    
})(jQuery);