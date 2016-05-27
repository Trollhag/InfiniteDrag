
var R_Months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
var R_Days = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
var R_Days_Short = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
var R_Today = 'idag';
var R_WeekStart = 1;
var R_Time = '{0} {1} {2}';

function datepicker(args) {
    this.data = args;
    this.iTime = this.data.iTime;
    this.iText = this.data.iText;
    this.onInit   = $.isFunction(this.data.onInit)   ? this.data.onInit   : function() {};
    this.onChange = $.isFunction(this.data.onChange) ? this.data.onChange : function() {};

    this.init();
}
datepicker.prototype.init = function() {
    
    var t = this.iTime.val();
    var current = new Date(t.substring(0,4),t.substring(5,7) - 1,t.substring(8,10),0,0,0,0);

    this.selectedDate = this.getChoosenDate(current);
    this.year = this.selectedDate.getFullYear();
    this.month = this.selectedDate.getMonth();
    this.getMonth(this.data.container, this.month, this.year);
    this.change();
    
    this.data.onInit(this);
}
datepicker.prototype.getDate = function(change) {
    var month = this.month + change;
    var year = this.year;
    if (month < 0) { month += 12; year--; }
    if (month > 11) { month -= 12; year++; }
    return [month, year];
}
datepicker.prototype.setDate = function(change) {
    var d = this.getDate(change);
    this.month = d[0];
    this.year = d[1];
    return d;
}
datepicker.prototype.getWeek = function(target, week, month, year) {
    var that = this;
    
    this.template = this.data.template || $('<table><thead><tr><th colspan="7" class="monthName"></th></tr><tr></tr></thead><tbody></tbody></table>');
    for(var i = 0; i < 7; i++) {
        var d = '<th class="day">{0}</th>'.format(R_Days_Short[(i + R_WeekStart) % 7]);
        $(this.template).find('thead tr').last().append(d);
    }
    target.html(this.template);
    
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    target.find('.monthName').html(R_Months[month] + " " + year);
    var dates = this.GenerateDateArray(year, month);
    var days = target.find('tbody');
    var row = $('<tr></tr>').appendTo(days);
    for (var j = 0; j < 7; j++) {
        var item = dates[j + week * 7];
        var cl = (item < yesterday) ? 'passedTime' :
            (item.getMonth() == month) ? '' : 'otherMonth'
        $('<td class="{0}"><span>{1}</span></td>'.format(cl, item.getDate()))
            .appendTo(row)
            .data('date', item)
            .filter(function () {
                return item >= yesterday;
            })
            .click(function () {
                var newDate = $(this).data('date');
                that.selectedDate = newDate;
                that.change();
            });
    }
}
datepicker.prototype.getMonth = function(target, month, year) {
    var that = this;
    
    this.template = this.data.template || $('<table><thead><tr><th colspan="7" class="monthName"></th></tr><tr></tr></thead><tbody></tbody></table>');
    for(var i = 0; i < 7; i++) {
        var d = '<th class="day">{0}</th>'.format(R_Days_Short[(i + R_WeekStart) % 7]);
        $(this.template).find('thead tr').last().append(d);
    }
    target.html(this.template);
    
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    target.find('.monthName').html(R_Months[month] + " " + year);
    var dates = this.GenerateDateArray(year, month);
    var days = target.find('tbody');
    for (var i = 0; i < 6; i++) {
        var row = $('<tr></tr>').appendTo(days);
        for (var j = 0; j < 7; j++) {
            var item = dates[j + i * 7];
            var cl = (item < yesterday) ? 'passedTime' :
                (item.getMonth() == month) ? '' : 'otherMonth'
            $('<td class="{0}"><span>{1}</span></td>'.format(cl, item.getDate()))
                .appendTo(row)
                .data('date', item)
                .filter(function () {
                    return item >= yesterday;
                })
                .click(function () {
                    var newDate = $(this).data('date');
                    that.selectedDate = newDate;
                    that.change();
                });
        }
    }
}
datepicker.prototype.change = function () {
    var that = this;
    this.data.container.find("td").each(function () {
        if ($(this).removeClass('selectedDate').data('date') - that.selectedDate === 0) { $(this).addClass('selectedDate') }
    });
    var day = this.pad(this.selectedDate.getDate());
    var month = this.pad(this.selectedDate.getMonth() + 1);
    var date = this.selectedDate.getFullYear() + '-' + month + '-' + day;

    var dow = this.getChoosenDate(new Date()).getTime() == this.selectedDate.getTime() ? R_Today : R_Days[this.selectedDate.getDay()];

    this.iTime.val(date);

    this.iText.text(R_Time.format(dow, this.selectedDate.getDate(), R_Months[this.selectedDate.getMonth()]));
    
    this.onChange.call(this);
}
datepicker.prototype.getChoosenDate = function (date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
datepicker.prototype.GenerateDateArray = function (year, month) {
    var count = 1 + (new Date(year, month, 1).getDay() + 6 - R_WeekStart) % 7;
    var startDate = new Date(year, month, 1 - count);
    var arr = new Array();
    for (var i = 0; i < 42; i++) {
        var myDate = new Date(startDate.getTime()); //Clone
        myDate.setDate(myDate.getDate() + i);
        arr.push(myDate);
    }
    return arr;
}
datepicker.prototype.pad = function (i) {
    if (i < 10) { return "0" + i; } else { return i; }
}

if (!String.prototype.format) {
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};
}