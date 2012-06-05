

(function($){
    
    var TouchTapDemo = {
        init: function(){
            this.resetLabels();
            this.setHandlers();
        },
        timers: [],
        resetLabels: function(){
            $(".example-label").each(function(){
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
                var last = null;
                $('#exScroll1').bind('touchtap.scrollEnd', function(event, position){
                    last = null;
                }).touchtap('scroll', function(positions){
                    if(last){
                        var change = {
                            x: last[0].x
                                - positions[0].x,
                            y: last[0].y
                                - positions[0].y
                        };
                        $(this).scrollTop($(this).scrollTop() + change.y);
                    }
                    last = positions;
                });
            })();
            
            (function(){
                var last = null;
                $('#exPanBox').bind('touchtap.scrollEnd', function(event, position){
                    last = null;
                }).touchtap('scroll', function(positions){
                    if(last){
                        var change = {
                            x: last[0].x
                                - positions[0].x,
                            y: last[0].y
                                - positions[0].y
                        };
                        $(this).css('top', (parseInt($(this).css('top')) - change.y)+'px');
                        $(this).css('left', (parseInt($(this).css('left')) - change.x)+'px');
                    }
                    last = positions;
                });
            })();
        }
    };
    
    TouchTapDemo.init();

})(jQuery);