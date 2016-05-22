
function InfiniteDrag(args) {
    this.data = args;
    this.data.target.data('InfiniteDrag', this);
    this.data.move = this.data.move || true;
    this.data.onInit  = $.isFunction(this.data.onInit)  ? this.data.onInit    : function() {};
    this.data.onStart = $.isFunction(this.data.onStart) ? this.data.onStart   : function() {};
    this.data.onDrag  = $.isFunction(this.data.onDrag)  ? this.data.onDrag    : function() {};
    this.data.onStop  = $.isFunction(this.data.onStop)  ? this.data.onStop    : function() {};
    this.data.width  = this.data.width  ? this.data.width  : this.data.target.parent().width();
    this.data.height = this.data.height != undefined ? this.data.height : this.data.target.parent().height();
    this.correct = this.correct || true;
    this.forceAxis = this.data.axis || false;
    this.init();
}
datepicker.prototype.init = function() {
    var that = this;
    this.data.target.css({'position': 'relative', 'left': -this.data.width, 'top': -this.data.height });
    this.data.onInit(this);
    this.data.target.on('mousedown touchstart', function(e) {
        that.drag = true;
        that.startX = e.pageX - (that.dragX || -that.data.width);
        that.startY = e.pageY - (that.dragY || -that.data.height);
        that.dragX = -that.data.width;
        that.dragY = -that.data.height;
        that.data.onStart(e, that);
    });
    $(document).on('mousemove touchmove', function(e) {
        if (!that.drag) return;
        
        that.dragX = e.pageX - that.startX;
        that.distanceX = that.dragX + that.data.width;
        if (!that.axis || that.axis.toLowerCase() != 'y' ) {
            if (that.distanceX <= -(that.data.width / 2)) {
                that.data.target.find('.drag-column:first-child').each(function() {
                    $(this).appendTo($(this).parent())
                })
                that.dragX = that.data.width / 2;
                that.startX = e.pageX + that.data.width / 2;
            }
            if (that.distanceX >= that.data.width / 2) {
                that.data.target.find('.drag-column:last-child').each(function() {
                    $(this).prependTo($(this).parent())
                })
                that.dragX = -(that.data.width * 1.5);
                that.startX = e.pageX + that.data.width * 1.5;
            }
            if (that.distanceX >= 5 || that.distanceX <= -5) {
                that.axis = 'x';
                that.data.target.css({ 'left': that.dragX });
            }
        }
        if (!that.axis || that.axis.toLowerCase() != 'x') {
            that.dragY = e.pageY - that.startY;
            that.distanceY = that.dragY + that.data.height;
            
            if (that.distanceY <= -(that.data.height / 2)) {
                that.data.target.find('.drag-row:first-child').each(function() {
                    $(this).appendTo($(this).parent())
                })
                that.dragY = that.data.height / 2;
                that.startY = e.pageY + that.data.height / 2;
            }
            if (that.distanceY >= that.data.height / 2) {
                that.data.target.find('.drag-row:last-child').each(function() {
                    $(this).prependTo($(this).parent())
                })
                that.dragY = -(that.data.height * 1.5);
                that.startY = e.pageY + that.data.height * 1.5;
            }
            if (that.distanceY >= 5 || that.distanceY <= -5) {
                that.axis = 'y';
                that.data.target.css({ 'top': that.dragY });
            }
        }
    });
    $(document).on('mouseup touchend', function(e) {
        that.drag = false;
        that.axis = that.data.axis || false;
        if (that.correct === true) {
            $(that.data.target).animate({ left: -that.data.width, top: -that.data.height });
            that.dragX = -that.data.width;
            that.dragY = -that.data.height;
        }
    });
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