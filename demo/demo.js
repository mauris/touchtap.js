

(function($){
    
    var TouchTapDemo = {
        init: function(){
            this.resetLabel();
            this.setHandlers();
        },
        resetLabel: function(){
            $(".example-unit").each(function(){
                $(this).text($(this).attr('data-label'));
            });
        },
        setTriggerLabel: function(e){
            $(e).text($(e).attr('data-trigger'));
        },
        setHandlers: function(){
            $("#exTap1").touchtap('tap', function(){
                TouchTapDemo.setTriggerLabel(this);
                window.setTimeout(function(){TouchTapDemo.resetLabel();}, 2000);
            });
            $("#exHold1").touchtap('hold', function(){
                TouchTapDemo.setTriggerLabel(this);
                window.setTimeout(function(){TouchTapDemo.resetLabel();}, 2000);
            });
        }
    };
    
    TouchTapDemo.init();

})(jQuery);