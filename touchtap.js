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
            ['tap', 'doubletap', 'hold'],
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
                down: function(){
                    this.timer = window.setTimeout(function(){
                            callback.apply(obj)
                        },
                        touchtap.constants.longPressDelay
                    );
                },
                up: function(){
                    window.clearTimeout(this.timer);
                    this.timer = null;
                }
            }
        },
        hold: function(callback){
            var handler = new touchtap.holdHandler(this, callback);
            this.mousedown(handler.down).mouseup(handler.up);
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