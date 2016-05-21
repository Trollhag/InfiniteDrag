
function datepicker(args) {
    this.data = args;
    this.data.target.data('datepicker', this);
    this.init();
}
datepicker.prototype.init = function() {
    var that = this;
    this.data.target.css({'position': 'relative', 'left': 0 })
    this.data.target.mousedown(function(e) {
        that.drag = true;
        that.offsetX = e.pageX - (that.dragX || 0);
        that.offsetY = e.pageY - (that.dragY || 0);
    });
    $(document).mouseup(function() {
        that.drag = false;
    });
    $(document).mousemove(function(e) {
        if (!that.drag) return;
        that.dragX = e.pageX - that.offsetX;
        that.dragY = e.pageY - that.offsetY;
        that.data.target.css({'left': that.dragX, 'top': that.dragY });
    })
}


/*
function datepicker(args) {
    this.data = args;
    this.data.target.data('datepicker', this);
    this.init();
}
datepicker.prototype.init = function() {
    this.data.target.css('left', -this.data.target.parent().width());
    this.data.target.draggable({
        start: function(e, ui) {
            var DP = $(this).data('datepicker');
            DP.block = false;
        },
        drag: function(e, ui, data) {
            var DP = $(this).data('datepicker');
            if (!DP.block) {
                if (ui.position.top != ui.originalPosition.top) {
                    $(this).draggable('option', 'axis', 'y');
                    DP.block = true;
                }
                else if (ui.position.left != ui.originalPosition.left) {
                    $(this).draggable('option', 'axis', 'x');
                    DP.block = true;
                }
            }
            if (ui.position.left < ui.originalPosition.left) {
                //Drag left
                if (ui.position.left - ui.originalPosition.left < ui.originalPosition.left / 2) {
                    $(this).append($(this).children(':first-child'));
                    $(this).css({'left': ui.position.left + $(this).parent().width() })
                    ui.position.left += $(this).parent().width()
                }
            }
            else if (ui.position.left > ui.originalPosition.left) {
                // Drag right
                $(this).prepend($(this).children(':last-child'));
                $(this).css({'left': ui.position.left - $(this).parent().width() })
            }
        },
        stop: function(e, ui) {
            var DP = $(this).data('datepicker');
            $(this).draggable('option', 'axis', false);
            DP.block = false;
            var corrTop = Math.round(ui.position.top / $(this).parent().height()) * $(this).parent().height();
            var corrLeft = Math.round(ui.position.left / $(this).parent().width()) * $(this).parent().width();
            
            $(this).animate({ top: corrTop, left: corrLeft });
        }
    });
}
datepicker.prototype.startDrag = function(e) {
}
datepicker.prototype.stopDrag = function(e) {
}

    this.data.target.on('DOMMouseScroll mousewheel scroll', function (e) {
        if(e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) { //alternative options for wheelData: wheelDeltaX & wheelDeltaY
            this.scroll = 'Down';
        } else if (e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0) {
            this.scroll = 'Up';
        }
        else if ($(this).scrollLeft() >= 25){
            this.scroll = 'Left'
        }
        else if ($(this).scrollLeft() < 25) {
            this.scroll = 'Right';
        }
    });
*/