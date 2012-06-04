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
        publicMethods:
            ['tap'],
        init: function(){
            
        },
        tap: function(callback){
            this.each(function(){
                $(this).click(callback);
            });
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
        return null;
    };
    
})(jQuery);