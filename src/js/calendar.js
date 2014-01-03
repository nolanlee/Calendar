function Calendar_v2 (oConfig) {
    var Calendar = function() {};

    var YEAR_SCOPE_VIEW = "YearScopeView",
        YEARS_VIEW = "YearsView",
        MONTHS_VIEW = "MonthsView",
        MONTH_VIEW = "MonthView";

    var calendarStorage = window.localStorage,
        doc = window.document,
        currentDate = new Date();

    var _getOffset = function (nYear, nMonth) {
        var d = new Date();

        d.setFullYear(nYear);
        d.setMonth(nMonth - 1);
        d.setDate(1);

        return d.getDay();
    };

    var _isReapYear = function (nYear) {
        return (nYear % 4 == 0 && nYear % 100 != 0) || (nYear % 100 == 0 && nYear % 400 == 0);
    };

    var _getMonthLength = function (nYear, nMonth) {
        var dateCount;

        switch (nMonth) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                dateCount = 31;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                dateCount = 30;
                break;
            case 2:
                if (_isReapYear(nYear)) {
                    dateCount = 29;
                } else {
                    dateCount = 28;
                }
                break;
            default:
                throw new Error("Invalid Month");
        }
        return dateCount;
    };

    var _getMonthDetails = function (nYear, nMonth) {
        var monthData = {}, offset = _getOffset(nYear, nMonth),
            monthLength = _getMonthLength(nYear, nMonth),
            row = Math.ceil((offset + monthLength) / 7),
            endOffset = 1,
            indexDate = 1,
            beginOffset = _getMonthLength(nYear, (nMonth == 1) ? 12 : nMonth - 1);

        for (var i = 0; i < row; i++) {
            monthData[i] = [];
            for (var j = 0; j < 7; j++) {
                if (i === 0) {
                    if (j < offset) {
                        monthData[i].push({
                            date: beginOffset - offset + j + 1,
                            enabled: false
                        });
                    } else {
                        monthData[i].push({
                            date: indexDate,
                            enabled: true
                        });
                        indexDate++;
                    }
                } else if (i === row - 1) {
                    if (indexDate > monthLength) {
                        monthData[i].push({
                            date: endOffset,
                            enabled: false
                        });
                        endOffset++;
                    } else {
                        monthData[i].push({
                            date: indexDate,
                            enabled: true
                        });
                        indexDate++;
                    }
                } else {
                    monthData[i].push({
                        date: indexDate,
                        enabled: true
                    });
                    indexDate++;
                }
            }
        }

        monthData.row = row;

        return monthData;
    };

    var _formatWeek = function (week) {
        var fWeek;

        switch (week) {
            case 1:
                fWeek = "Mo";
                break;
            case 2:
                fWeek = "Tu";
                break;
            case 3:
                fWeek = "We";
                break;
            case 4:
                fWeek = "Th";
                break;
            case 5:
                fWeek = "Fr";
                break;
            case 6:
                fWeek = "Sa";
                break;
            case 0:
            case 7:
                fWeek = "Su";
                break;
        }
        return fWeek;
    };

    var _getMonthView = function (monthData) {
        var htmlStr = "";
        
        htmlStr += "<div class='calendar'><table class='table table-condensed' style='margin-bottom: 0;'><tbody><tr class='info'>";

        for (var i = 0; i < 7; i++) {
            if (i == 6 || i == 0) {
                htmlStr += "<td style='text-align:center;color: #FF5C00;'>" + _formatWeek(i) + "</th>";
            } else {
                htmlStr += "<td style='text-align:center;'>" + _formatWeek(i) + "</th>";
            }
        }

        htmlStr += "</tr></tbody></table><table class='table table-bordered table-condensed'><tbody>";

        for (var i = 0, l = monthData.row; i < l; i++) {
            htmlStr += "<tr>";
            for (var j = 0, k = monthData[i].length; j < k; j++) {
                if (monthData[i][j].enabled) {
                    var nowDateStr = _Calendar.date.getFullYear() + "-" + (_Calendar.date.getMonth() + 1) + "-" + monthData[i][j].date;
                    if (hasPlan(nowDateStr)) {
                        if (j == 0 || j == 6) {
                            htmlStr += "<td class='enabled cell plan' style='text-align:center;color: #FF5C00;'>" + monthData[i][j].date + "</td>";
                        } else {
                            htmlStr += "<td class='enabled cell plan' style='text-align:center;'>" + monthData[i][j].date + "</td>";
                        }
                    } else {
                        if (j == 0 || j == 6) {
                            htmlStr += "<td class='enabled cell' style='text-align:center;color: #FF5C00;'>" + monthData[i][j].date + "</td>";
                        } else {
                            htmlStr += "<td class='enabled cell' style='text-align:center;'>" + monthData[i][j].date + "</td>";
                        }
                    }
                } else {
                    htmlStr += "<td class='unabled cell' style='text-align:center;background-color: #F0F0F0;color: #D2D2D2;'>" + monthData[i][j].date + "</td>";
                }
            }
            htmlStr += "</tr>";
        }
        
        htmlStr += "</tbody></table></div>";

        return htmlStr;
    };

    var _drawCalendar = function(oContainer, sView, oDate) {
        var oData = null,
            htmlStr = null;

        switch(sView) {
            case YEAR_SCOPE_VIEW:
                break;
            case YEARS_VIEW:
                break;
            case MONTHS_VIEW:
                break;
            case MONTH_VIEW:
                oData = _getMonthDetails(oDate.getFullYear(), getMonth() + 1);
                htmlStr = _getMonthView(oData);
                break;
            default:
                throw new Error("Invalid view name");
                break;
        }

    };

    /**
     * draw calendar
     */
    Calendar.prototype.placeAt = function(sId) {
        var container = doc.getElementById(sId);

        if(container === null) {
            throw new Error("Container Not Found");
        } else {
            _drawCalendar(container, oConfig.viewName, currentDate); 
        }
    }

    return new Calendar();
};

//==============================================================================================================================
//==============================================================================================================================
//==============================================================================================================================
//==============================================================================================================================
//==============================================================================================================================
//==============================================================================================================================
//==============================================================================================================================
//==============================================================================================================================
var Calendar = (function ($, window) {
    var storage = window.localStorage;
    var _Calendar = {};

    if (storage) {
        if (!storage.getItem("baku_calendar")) {
            storage.setItem("baku_calendar", JSON.stringify({
                doList: []
            }))
        }
        _Calendar.storage = storage;
    }

    _Calendar.drawCalendar = function (element, data) {
        var htmlStr = "";
        
        element.empty();
        
        htmlStr += "<div class='calendar'><table class='table table-condensed' style='margin-bottom: 0;'><tbody><tr class='info'>";

        for (var i = 0; i < 7; i++) {
            if (i == 6 || i == 0) {
                htmlStr += "<td style='text-align:center;color: #FF5C00;'>" + formatWeek(i) + "</th>";
            } else {
                htmlStr += "<td style='text-align:center;'>" + formatWeek(i) + "</th>";
            }
        }
        htmlStr += "</tr></tbody></table><table class='table table-bordered table-condensed'><tbody>";

        for (var i = 0, l = data.row; i < l; i++) {
            htmlStr += "<tr>";
            for (var j = 0, k = data[i].length; j < k; j++) {
                if (data[i][j].enabled) {
                    var nowDateStr = _Calendar.date.getFullYear() + "-" + (_Calendar.date.getMonth() + 1) + "-" + data[i][j].date;
                    if (hasPlan(nowDateStr)) {
                        if (j == 0 || j == 6) {
                            htmlStr += "<td class='enabled cell plan' style='text-align:center;color: #FF5C00;'>" + data[i][j].date + "</td>";
                        } else {
                            htmlStr += "<td class='enabled cell plan' style='text-align:center;'>" + data[i][j].date + "</td>";
                        }
                    } else {
                        if (j == 0 || j == 6) {
                            htmlStr += "<td class='enabled cell' style='text-align:center;color: #FF5C00;'>" + data[i][j].date + "</td>";
                        } else {
                            htmlStr += "<td class='enabled cell' style='text-align:center;'>" + data[i][j].date + "</td>";
                        }
                    }
                } else {
                    htmlStr += "<td class='unabled cell' style='text-align:center;background-color: #F0F0F0;color: #D2D2D2;'>" + data[i][j].date + "</td>";
                }
            }
            htmlStr += "</tr>";
        }
        
        htmlStr += "</tbody></table></div>";

        element.append(htmlStr);
        
        if(_Calendar._callback) {
            _Calendar.bindEvent(_Calendar._callback);
        }
    };

    var fitData = function (year, month) {
        var data = {}, offset = getOffset(year, month),
            monthLength = getMonthLength(year, month),
            row = Math.ceil((offset + monthLength) / 7),
            endOffset = 1,
            indexDate = 1,
            beginOffset = getMonthLength(year, (month == 1) ? 12 : month - 1);

        for (var i = 0; i < row; i++) {
            data[i] = [];
            for (var j = 0; j < 7; j++) {
                if (i == 0) {
                    if (j < offset) {
                        data[i].push({
                            date: beginOffset - offset + j + 1,
                            enabled: false
                        });
                    } else {
                        data[i].push({
                            date: indexDate,
                            enabled: true
                        });
                        indexDate++;
                    }
                } else if (i == row - 1) {
                    if (indexDate > monthLength) {
                        data[i].push({
                            date: endOffset,
                            enabled: false
                        });
                        endOffset++;
                    } else {
                        data[i].push({
                            date: indexDate,
                            enabled: true
                        });
                        indexDate++;
                    }
                } else {
                    data[i].push({
                        date: indexDate,
                        enabled: true
                    });
                    indexDate++;
                }
            }
        }
        data.row = row;
        return data;
    };
    
    var getOffset = function (year, month) {
        var d = new Date();

        d.setFullYear(year);
        d.setMonth(month - 1);
        d.setDate(1);

        return d.getDay();
    };

    var isReapYear = function (year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0);
    };

    var getMonthLength = function (year, month) {
        var dateCount;

        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                dateCount = 31;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                dateCount = 30;
                break;
            case 2:
                if (isReapYear(year)) {
                    dateCount = 29;
                } else {
                    dateCount = 28;
                }
                break;
            default:
                dateCount = "year or month format is error";
        }
        return dateCount;
    };

    var formatWeek = function (week) {
        var fWeek;

        switch (week) {
            case 1:
                fWeek = "Mo";
                break;
            case 2:
                fWeek = "Tu";
                break;
            case 3:
                fWeek = "We";
                break;
            case 4:
                fWeek = "Th";
                break;
            case 5:
                fWeek = "Fr";
                break;
            case 6:
                fWeek = "Sa";
                break;
            case 0:
            case 7:
                fWeek = "Su";
                break;
        }
        return fWeek;
    };

    var preMonth = function (_date) {
        if (_date.getMonth() == 0) {
            _date.setFullYear(_date.getFullYear() - 1);
            _date.setMonth(11);
        } else {
            _date.setMonth(_date.getMonth() - 1);
        }
        return _date;
    };

    var nextMonth = function (_date) {
        if (_date.getMonth() == 11) {
            _date.setFullYear(_date.getFullYear() + 1);
            _date.setMonth(0);
        } else {
            _date.setMonth(_date.getMonth() + 1);
        }
        return _date;
    };

    var hasPlan = function (date) {
        return _Calendar.getPlan(date);
    };

    var createId = function () {
        return new Date().getTime();
    };

    _Calendar.putPlan = function (date, plan) {
        if (date || plan) {
            var doList = JSON.parse(storage.getItem("baku_calendar")).doList,
                hasDate = false;

            for (var i = 0, j = doList.length; i < j; i++) {
                if (doList[i].date == date) {
                    var planList = doList[i].planList;
                    hasDate = true;
                    planList.push({
                        "id": createId(),
                        "plan": plan
                    });
                }
                break;
            }

            if (!hasDate) {
                var planList = [];
                planList.push({
                    "id": createId(),
                    "plan": plan
                });
                doList.push({
                    "date": date,
                    "planList": planList
                })
            }

            storage.setItem("baku_calendar", JSON.stringify({
                "doList": doList
            }));

            _Calendar.rerender();
        } else {
            return;
        }
    };

    _Calendar.getPlan = function (date) {
        if (date) {
            var doList = JSON.parse(storage.getItem("baku_calendar")).doList;

            for (var i = 0, j = doList.length; i < j; i++) {
                if (doList[i].date == date) {
                    return doList[i].planList;
                }
            }
        } else {
            return;
        }
    };

    _Calendar.delPlan = function (date, planId) {
        if (date || planId) {
            var doList = JSON.parse(storage.getItem("baku_calendar")).doList;

            for (var i = 0, j = doList.length; i < j; i++) {
                if (doList[i].date == date) {
                    var planList = doList[i].planList;
                    for (var k = 0, l = planList.length; k < l; k++) {
                        if (planList[k].id == planId) {
                            planList.splice(k, 1);
                            if (!planList.length) {
                                doList.splice(i, 1);
                            }
                            break;
                        }
                    }
                    break;
                }
            }

            storage.setItem("baku_calendar", JSON.stringify({
                "doList": doList
            }));

            _Calendar.rerender();
            return true;
        } else {
            return;
        }
    };

    _Calendar.drawPreMonth = function (preButton) {
        preButton.on("tap", function () {
            var t = preMonth(_Calendar.date);
            _Calendar.drawCalendar(_Calendar.$calendar, fitData(t.getFullYear(), t.getMonth() + 1));
            if (_Calendar._title) {
                _Calendar._title.html(t.getFullYear() + "年" + (t.getMonth() + 1) + "月");
            }
        });
        
        return this;
    };

    _Calendar.drawNextMonth = function (nextButton) {
        nextButton.on("tap", function () {
            var t = nextMonth(_Calendar.date);
            _Calendar.drawCalendar(_Calendar.$calendar, fitData(t.getFullYear(), t.getMonth() + 1));
            if (_Calendar._title) {
                _Calendar._title.html(t.getFullYear() + "年" + (t.getMonth() + 1) + "月");
            }
        });
        
        return this;
    };

    _Calendar.init = function (element, title) {
        var data;

        _Calendar.date = new Date();
        _Calendar.$calendar = $(element);
        data = fitData(_Calendar.date.getFullYear(), _Calendar.date.getMonth() + 1);

        if (title) {
            _Calendar._title = $(title);
            $(title).html(_Calendar.date.getFullYear() + "年" + (_Calendar.date.getMonth() + 1) + "月");
        }
        
        _Calendar.drawCalendar(_Calendar.$calendar, data);
        
        return this;
    };

    _Calendar.rerender = function () {
        var data = fitData(_Calendar.date.getFullYear(), _Calendar.date.getMonth() + 1);
        _Calendar.drawCalendar(_Calendar.$calendar, data);
        
        return this;
    };
    
    _Calendar.bindEvent = function (callback) {
        _Calendar._callback = callback;
        
        $(".enabled").on("tap", function () {
            var date = $(this).html();
            callback(date);
            _Calendar.date.setDate(date);
        });

        return this;
    };

    return _Calendar;

})($, window);