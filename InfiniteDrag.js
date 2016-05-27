
function InfiniteDrag(args) {
    this.data = args;
    this.data.target.data('InfiniteDrag', this);
    this.data.handle = this.data.handle || this.data.target.find('.handle');
    this.data.move = this.data.move || true;
    this.data.onInit  = $.isFunction(this.data.onInit)  ? this.data.onInit  : function() {};
    this.data.onStart = $.isFunction(this.data.onStart) ? this.data.onStart : function() {};
    this.data.onDrag  = $.isFunction(this.data.onDrag)  ? this.data.onDrag  : function() {};
    this.data.onStop  = $.isFunction(this.data.onStop)  ? this.data.onStop  : function() {};
    this.data.onStop  = $.isFunction(this.data.onSwap) ? this.data.onXSwap  : function() {};
    this.data.width  = this.data.width  != undefined ? this.data.width  : this.data.target.width();
    this.data.height = this.data.height != undefined ? this.data.height : this.data.target.height();
    this.correct = this.correct || true;
    this.forceAxis = this.data.axis || false;
    this.Init();
}
InfiniteDrag.prototype.Init = function() {
    var that = this;
    this.data.handle.css({'position': 'relative', 'left': (this.data.axis != 'y' ? -this.data.width : 0), 'top': (this.data.axis != 'x' ? -this.data.height : 0) });
    this.data.handle.addClass('drag-' + (this.data.axis ? this.data.axis : 'xy'));
    this.data.onInit.call(this);
    this.data.handle.on('mousedown touchstart', function(e) { that.Start(e); });
    $(document).on('mousemove touchmove', function(e) { that.Drag(e); });
    $(document).on('mouseup touchend', function(e) { that.Stop(e) });
    $(document).on('selectstart', function(e) { // Prevent user selection when dragging
        if (that.dragging) {
            e.preventDefault();
            return false;
        }
    });
}
InfiniteDrag.prototype.Start = function(e) {
    this.drag = true;
    this.startX = e.pageX - (this.dragX || -this.data.width);
    this.startY = e.pageY - (this.dragY || -this.data.height);
    this.dragX = -this.data.width;
    this.dragY = -this.data.height;
    this.data.onStart(e, this);
}
InfiniteDrag.prototype.Drag = function(e) {
    if (!this.drag) return;
    this.dragging = true;
    this.dragX = e.pageX - this.startX;
    this.distanceX = this.dragX + this.data.width;
    if (!this.axis || this.axis.toLowerCase() != 'y' ) {
        if (this.distanceX < -(this.data.width / 2)) {
            this.data.target.find('.drag-column:first-child').each(function() {
                $(this).appendTo($(this).parent())
            })
            this.startX = e.pageX + this.data.width / 2;
            this.dragX = e.pageX - this.startX;
            this.data.onSwap.call(this, this.data.target.find('.drag-column:last-child'), 'Left');
        }
        if (this.distanceX > this.data.width / 2) {
            this.data.target.find('.drag-column:last-child').each(function() {
                $(this).prependTo($(this).parent())
            })
            this.startX = e.pageX + this.data.width * 1.5;
            this.dragX = e.pageX - this.startX;
            this.data.onSwap.call(this, this.data.target.find('.drag-column:first-child'), 'Right');
        }
        if (this.distanceX >= 5 || this.distanceX <= -5) {
            this.axis = 'x';
            this.data.handle.css({ 'left': this.dragX });
        }
    }
    if (!this.axis || this.axis.toLowerCase() != 'x') {
        this.dragY = e.pageY - this.startY;
        this.distanceY = this.dragY + this.data.height;
        
        if (this.distanceY < -(this.data.height / 2)) {
            this.data.target.find('.drag-row:first-child').each(function() {
                $(this).appendTo($(this).parent())
            })
            this.startY = e.pageY + this.data.height / 2;
            this.dragY = e.pageY - this.startY;
            this.data.onSwap.call(this, this.data.target.find('.drag-row:last-child'), 'Up');
        }
        if (this.distanceY > this.data.height / 2) {
            this.data.target.find('.drag-row:last-child').each(function() {
                $(this).prependTo($(this).parent())
            })
            this.startY = e.pageY + this.data.height * 1.5;
            this.dragY = e.pageY - this.startY;
            this.data.onSwap.call(this, this.data.target.find('.drag-row:first-child'), 'Down');
        }
        if (this.distanceY >= 5 || this.distanceY <= -5) {
            this.axis = 'y';
            this.data.handle.css({ 'top': this.dragY });
        }
    }
}
InfiniteDrag.prototype.Stop = function(e) {
    if (this.dragging) { // If a selection was made during draging remove it
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            }
            else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        }
        else if (document.selection) {  // IE?
            document.selection.empty();
        }
    }
    this.axis = this.data.axis || false;
    if (this.correct === true) {
        $(this.data.handle).animate({ 'left': (this.data.axis != 'y' ? -this.data.width : 0), 'top': (this.data.axis != 'x' ? -this.data.height : 0) });
        this.dragX = -this.data.width;
        this.dragY = -this.data.height;
    }
    this.drag = this.dragging = false;
}