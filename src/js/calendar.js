var Calendar = {};

(function ($, window) {
    var storage = window.localStorage;

    if (storage) {
        if (!storage.getItem("nolan_calendar")) {
            storage.setItem("nolan_calendar", JSON.stringify({
                doList: []
            }))
        }
        Calendar.storage = storage;
    }

    Calendar.drawCalendar = function (element, data) {
        var html = "";
        
        element.empty();
        
        html += "<div class='calendar'><table class='table table-condensed' style='margin-bottom: 0;'><tbody><tr class='info'>";

        for (var i = 0; i < 7; i++) {
            if (i == 6 || i == 0) {
                html += "<td style='text-align:center;color: #FF5C00;'>" + formatWeek(i) + "</th>";
            } else {
                html += "<td style='text-align:center;'>" + formatWeek(i) + "</th>";
            }
        }
        html += "</tr></tbody></table><table class='table table-bordered table-condensed'><tbody>";

        for (var i = 0, l = data.row; i < l; i++) {
            html += "<tr>";
            for (var j = 0, k = data[i].length; j < k; j++) {
                if (data[i][j].enabled) {
                    var nowDateStr = Calendar.date.getFullYear() + "-" + (Calendar.date.getMonth() + 1) + "-" + data[i][j].date;
                    if (hasPlan(nowDateStr)) {
                        if (j == 0 || j == 6) {
                            html += "<td class='enabled cell plan' style='text-align:center;color: #FF5C00;'>" + data[i][j].date + "</td>";
                        } else {
                            html += "<td class='enabled cell plan' style='text-align:center;'>" + data[i][j].date + "</td>";
                        }
                    } else {
                        if (j == 0 || j == 6) {
                            html += "<td class='enabled cell' style='text-align:center;color: #FF5C00;'>" + data[i][j].date + "</td>";
                        } else {
                            html += "<td class='enabled cell' style='text-align:center;'>" + data[i][j].date + "</td>";
                        }
                    }
                } else {
                    html += "<td class='unabled cell' style='text-align:center;background-color: #F0F0F0;color: #D2D2D2;'>" + data[i][j].date + "</td>";
                }
            }
            html += "</tr>";
        }
        
        html += "</tbody></table></div>";

        element.append(html);
        
        if(Calendar._callback) {
            Calendar.bindEvent(Calendar._callback);
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
        return Calendar.getPlan(date);
    };

    var createId = function () {
        return new Date().getTime();
    };

    Calendar.putPlan = function (date, plan) {
        if (date || plan) {
            var doList = JSON.parse(storage.getItem("nolan_calendar")).doList,
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

            storage.setItem("nolan_calendar", JSON.stringify({
                "doList": doList
            }));

            Calendar.rerender();
        } else {
            return;
        }
    };

    Calendar.getPlan = function (date) {
        if (date) {
            var doList = JSON.parse(storage.getItem("nolan_calendar")).doList;

            for (var i = 0, j = doList.length; i < j; i++) {
                if (doList[i].date == date) {
                    return doList[i].planList;
                }
            }
        } else {
            return;
        }
    };

    Calendar.delPlan = function (date, planId) {
        if (date || planId) {
            var doList = JSON.parse(storage.getItem("nolan_calendar")).doList;

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

            storage.setItem("nolan_calendar", JSON.stringify({
                "doList": doList
            }));

            Calendar.rerender();
            return true;
        } else {
            return;
        }
    };

    Calendar.drawPreMonth = function (preButton) {
        preButton.on("tap", function () {
            var t = preMonth(Calendar.date);
            Calendar.drawCalendar(Calendar.$calendar, fitData(t.getFullYear(), t.getMonth() + 1));
            if (Calendar._title) {
                Calendar._title.html(t.getFullYear() + "年" + (t.getMonth() + 1) + "月");
            }
        });
        
        return this;
    };

    Calendar.drawNextMonth = function (nextButton) {
        nextButton.on("tap", function () {
            var t = nextMonth(Calendar.date);
            Calendar.drawCalendar(Calendar.$calendar, fitData(t.getFullYear(), t.getMonth() + 1));
            if (Calendar._title) {
                Calendar._title.html(t.getFullYear() + "年" + (t.getMonth() + 1) + "月");
            }
        });
        
        return this;
    };

    Calendar.init = function (element, title) {
        var data;

        Calendar.date = new Date();
        Calendar.$calendar = $(element);
        data = fitData(Calendar.date.getFullYear(), Calendar.date.getMonth() + 1);

        if (title) {
            Calendar._title = $(title);
            $(title).html(Calendar.date.getFullYear() + "年" + (Calendar.date.getMonth() + 1) + "月");
        }
        
        Calendar.drawCalendar(Calendar.$calendar, data);
        
        return this;
    };

    Calendar.rerender = function () {
        var data = fitData(Calendar.date.getFullYear(), Calendar.date.getMonth() + 1);
        Calendar.drawCalendar(Calendar.$calendar, data);
        
        return this;
    };
    
    Calendar.bindEvent = function (callback) {
        Calendar._callback = callback;
        
        $(".enabled").on("tap", function () {
            var date = $(this).html();
            callback(date);
            Calendar.date.setDate(date);
        });

        return this;
    };
    
})($, window);