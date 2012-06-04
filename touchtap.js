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
        constants:{
            longPressDelay: 800
        },
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
            
        },
        tap: function(callback){
            this.each(function(){
                $(this).click(callback);
            });
            return this;
        },
        doubletap: function(callback){
            this.each(function(){
                $(this).dblclick(callback);
            });
            return this;
        },
        holdHandler: function(obj, callback){
            return {
                timer: null,
                start: function(event){
                    event.preventDefault();
                    this.timer = window.setTimeout(function(){
                            callback.apply(obj)
                        },
                        touchtap.constants.longPressDelay
                    );
                    return false;
                },
                cancel: function(event){
                    event.preventDefault();
                    window.clearTimeout(this.timer);
                    this.timer = null;
                    return false;
                }
            }
        },
        hold: function(callback){
            var handler = new touchtap.holdHandler(this, callback);
            this.mousedown(handler.start).mouseup(handler.cancel);
            return this;
        },
        scrollHandler: function(obj, callback, orientation){
            return {
                start: null,
                orientation: 0,
                enable: function(event){
                    event.preventDefault();
                    this.start = {x: event.pageX, y: event.pageY};
                    return false;
                },
                move: function(event){
                    event.preventDefault();
                    if(this.start){
                        var data = null;
                        switch(orientation){
                            case 1: // x
                                data = this.start.x - event.pageX;
                                break;
                            case 2: // y
                                data = this.start.y - event.pageY;
                                break;
                            default:
                                data = {x: this.start.x - event.pageX,
                                    y: this.start.y - event.pageY};
                                break;
                        }
                        callback.apply(obj, [data]);
                    }
                    return false;
                },
                disable: function(event){
                    event.preventDefault();
                    this.start = null;
                    return false;
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
        if(touchtap.publicMethods.indexOf(method) > -1){
            return touchtap[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }else if(typeof method === 'object' || ! method){
            return touchtap.init.apply( this, arguments );
        }else{
            $.error('Method "' +  method + '" does not exist on jQuery.touchtap.');
        }
        return this;
    };
    
})(jQuery);