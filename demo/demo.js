

(function($){
    
    var TouchTapDemo = {
        init: function(){
            this.resetLabels();
            this.setHandlers();
        },
        timers: [],
        resetLabels: function(){
            $(".example-unit").each(function(){
                TouchTapDemo.resetLabel(this);
            });
        },
        resetLabel: function(e){
            $(e).text($(e).attr('data-label'));
        },
        setTriggerLabel: function(e){
            $(e).text($(e).attr('data-trigger'));
        },
        setHandlers: function(){
            $("#exTap1").touchtap('tap', function(){
                var e = this;
                TouchTapDemo.setTriggerLabel(e);
                if(TouchTapDemo.timers['tap']){
                    TouchTapDemo.timers['tap'] = window.clearTimeout(TouchTapDemo.timers['tap']);
                }
                TouchTapDemo.timers['tap'] = window.setTimeout(function(){TouchTapDemo.resetLabel(e);}, 2000);
            });
            
            $("#exDoubleTap1").touchtap('doubletap', function(){
                var e = this;
                TouchTapDemo.setTriggerLabel(e);
                if(TouchTapDemo.timers['tap']){
                    TouchTapDemo.timers['tap'] = window.clearTimeout(TouchTapDemo.timers['tap']);
                }
                TouchTapDemo.timers['tap'] = window.setTimeout(function(){TouchTapDemo.resetLabel(e);}, 2000);
            });
            
            $("#exHold1").touchtap('hold', function(){
                var e = this;
                TouchTapDemo.setTriggerLabel(e);
                if(TouchTapDemo.timers['tap']){
                    TouchTapDemo.timers['tap'] = window.clearTimeout(TouchTapDemo.timers['tap']);
                }
                TouchTapDemo.timers['tap'] = window.setTimeout(function(){TouchTapDemo.resetLabel(e);}, 2000);
            });
            
            (function(){
                var panHandler = function(){
                    return {
                        startX: null,
                        startY: null,
                        calibrate: function(event){
                            startX = (document.all ? document.scrollLeft : window.pageXOffset);
                            startY = (document.all ? document.scrollTop : window.pageYOffset);
                        },
                        pan: function(change){
                            console.log(change);
                            window.scrollTo(startX + change.x, startY + change.y);
                        }
                    };
                }
                var handler = new panHandler();
                $("body").mousedown(handler.calibrate).touchtap('scroll', handler.pan);
            })();
        }
    };
    
    TouchTapDemo.init();

})(jQuery);