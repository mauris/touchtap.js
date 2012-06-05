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
        positionDiff: function(pointA, pointB){
            var x = Math.abs(pointA.x - pointB.x);
            var y = Math.abs(pointA.x - pointB.x);
            return Math.sqrt(x * x + y * y);
        },
        eventController: function(eventType, callback, obj){
            return {
                touchData: {
                    startPosition: null,
                    currentPosition: null,
                    mousedown: false,
                    holdTimer: null,
                    firstTap: null
                },
                set: function(){
                    var events = [
                        'mousedown',
                        'mouseup',
                        'mouseout',
                        'mouseleave',
                        'mousemove',
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
                            data.startPosition = touchtap.getEventCoordinates(event);
                            data.mousedown = true;
                            if(eventType == 'hold'){
                                data.holdTimer = window.setTimeout(function(){
                                        data.mousedown = false;
                                        data.holdTimer = null
                                        callback.apply(obj);
                                    }, touchtap.__longPressDelayMs);
                            }else if(eventType == 'scroll'){
                                obj.trigger('touchtap.scrollStart');
                            }
                            break;
                        case 'mousemove':
                        case 'touchmove':
                            if(data.mousedown){
                                data.currentPosition = touchtap.getEventCoordinates(event);
                                if(eventType == 'scroll'){
                                    callback.apply(obj, [data.currentPosition]);
                                }else if(eventType == 'hold' && data.holdTimer
                                    && touchtap.positionDiff(data.startPosition[0], data.currentPosition[0]) > 5){
                                    window.clearTimeout(data.holdTimer);
                                    data.holdTimer = null;
                                }
                            }
                            break;
                        case 'mouseout':
                        case 'mouseup':
                        case 'mouseleave':
                        case 'touchcancel':
                        case 'touchend':
                            if(data.mousedown){
                                var endPosition = touchtap.getEventCoordinates(event);
                                // clear timer if the hold event is still there
                                if(data.holdTimer){
                                    window.clearTimeout(data.holdTimer);
                                    data.holdTimer = null;
                                }else if(eventType == 'scroll'){
                                    obj.trigger('touchtap.scrollEnd', endPosition);
                                }else if(eventType == 'doubletap'){
                                    var collectData = true;
                                    if(data.firstTap){
                                        var interval = Date.now() - data.firstTap.time;
                                        if(interval < touchtap.__doubleTapIntervalMs
                                            && touchtap.positionDiff(data.firstTap.position, endPosition[0]) < 5){
                                            callback.apply(obj);
                                            data.firstTap = null;
                                            collectData = false;
                                        }
                                    }
                                    if(collectData){
                                        data.firstTap ={
                                            time: Date.now(),
                                            position: endPosition[0]
                                        };
                                    }
                                }else if(eventType == 'tap'){
                                    callback.apply(obj);
                                }
                                data.mousedown = false;
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
            var controller = new touchtap.eventController('scroll', callback, this);
            controller.set();
            return this;
        },
        pan: function(callback){
            return this.scroll.apply(this, [callback]);
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