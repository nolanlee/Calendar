function Calendar(oConfig) {
    var YEAR_SCOPE_VIEW = "YearScopeView",
        YEARS_VIEW = "YearsView",
        MONTHS_VIEW = "MonthsView",
        MONTH_VIEW = "MonthView";

    var doc = window.document,
        currentDate = new Date(),
        container = null;

    var _typeOf = function (o, e) {
        return Object.prototype.toString.call(o) === ("[object " + e + "]");
    };

    var _initConfig = function (oConfig) {
        oConfig.date =  (oConfig && oConfig.date && _typeOf(oConfig.date, "Date")) ? oConfig.date : currentDate;

        return oConfig;
    };

    var _getOffset = function (nYear, nMonth) {
        var d = new Date();

        d.setFullYear(nYear);
        d.setMonth(nMonth - 1);
        d.setDate(1);

        return d.getDay();
    };

    var _isReapYear = function (nYear) {
        return (nYear % 4 === 0 && nYear % 100 !== 0) || (nYear % 100 === 0 && nYear % 400 === 0);
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
        var monthData = [],
            offset = _getOffset(nYear, nMonth),
            monthLength = _getMonthLength(nYear, nMonth),
            row = Math.ceil((offset + monthLength) / 7),
            endOffset = 1,
            indexDate = 1,
            beginOffset = _getMonthLength(nYear, (nMonth === 1) ? 12 : nMonth - 1),
            cellData = null,
            curYear = currentDate.getFullYear(),
            curMonth = currentDate.getMonth() + 1,
            curDate = currentDate.getDate();

        for (var i = 0; i < row; i++) {
            monthData[i] = [];
            for (var j = 0; j < 7; j++) {
                if (i === 0) {
                    if (j < offset) {
                        cellData = {
                            date: beginOffset - offset + j + 1,
                            enabled: false
                        };
                    } else {
                        cellData = {
                            date: indexDate,
                            enabled: true
                        };
                        indexDate++;
                    }
                } else if (i === row - 1) {
                    if (indexDate > monthLength) {
                        cellData = {
                            date: endOffset,
                            enabled: false
                        };
                        endOffset++;
                    } else {
                        cellData = {
                            date: indexDate,
                            enabled: true
                        };
                        indexDate++;
                    }
                } else {
                    cellData = {
                        date: indexDate,
                        enabled: true
                    };
                    indexDate++;
                }

                if(nYear === curYear && nMonth === curMonth && cellData.enabled && cellData.date === curDate) {
                    cellData.isToday = true;
                }

                monthData[i][j] = cellData;
            }
        }

        return monthData;
    };

    var _transformWeek = function (week, isShort) {
        var fWeek;

        switch (week) {
        case 1:
            fWeek = "Monday";
            break;
        case 2:
            fWeek = "Tuesday";
            break;
        case 3:
            fWeek = "Wednesday";
            break;
        case 4:
            fWeek = "Thursday";
            break;
        case 5:
            fWeek = "Friday";
            break;
        case 6:
            fWeek = "Saturday";
            break;
        case 0:
        case 7:
            fWeek = "Sunday";
            break;
        }

        if (isShort) {
            return fWeek.substring(0, 2);
        } else {
            return fWeek;
        }
    };

    var _transformMonth = function (month, isShort) {
        var fMonth;

        switch (month) {
        case 1:
            fMonth = "January";
            break;
        case 2:
            fMonth = "February";
            break;
        case 3:
            fMonth = "March";
            break;
        case 4:
            fMonth = "April";
            break;
        case 5:
            fMonth = "May";
            break;
        case 6:
            fMonth = "June";
            break;
        case 7:
            fMonth = "July";
            break;
        case 8:
            fMonth = "August";
            break;
        case 9:
            fMonth = "Septemter";
            break;
        case 10:
            fMonth = "Octuber";
            break;
        case 11:
            fMonth = "November";
            break;
        case 12:
            fMonth = "December";
            break;
        }

        if (isShort) {
            return fMonth.substring(0, 3);
        } else {
            return fMonth;
        }
    };

    var _getHeaderView = function (sDate) {
        sDate = sDate ? sDate : "";

        return "<div class='cal-toolbar' style='font-weight: bold;'><span id='cal-previous' class='cal-nav-button' " +
            "style='display:inline-block;width: 12%;'>&lt;</span>" +
            "<span id='cal-title' style='display:inline-block;width: 76%;'>" + sDate + "</span>" +
            "<span id='cal-next' class='cal-nav-button'" + "style='display:inline-block;width: 12%;'>&gt;</span></div>";
    };

    var _getMonthsView = function() {
        var htmlStr = "",
            i = 0,
            j = 0;

        htmlStr += "<table style='margin-bottom: 0; width: 100%;'>";

        for(i = 0; i < 3; i++) {
            htmlStr += "<tr>";

            for (j = 0; j < 4; j++) {
                htmlStr += "<td class='cal-cell' data-month-key='" + (i + 1) * (j + 1) + "' >" + _transformMonth((i + 1) * (j + 1), true) + "</td>";
            }

            htmlStr += "</tr>";
        }

         htmlStr += "</table>";

        return htmlStr;
    };

    var _getMonthView = function (monthData) {
        var htmlStr = "",
            i = 0,
            j = 0,
            k = 0,
            l = 0;

        htmlStr += "<table style='margin-bottom: 0; width: 100%;'><thead><tr>";

        for (i = 0; i < 7; i++) {
            htmlStr += "<th class='cal-header'>" + _transformWeek(i, true) + "</th>";
        }

        htmlStr += "</tr></thead><tbody>";

        for (i = 0, l = monthData.length; i < l; i++) {
            htmlStr += "<tr>";
            for (j = 0, k = monthData[i].length; j < k; j++) {
                var cellStrBefore =
                    "<td class='{enabledClass} {todayClass} cal-cell' style='{enabledStyle} {todayStyle}'>",
                    cellStrAfter = "</td>";

                if (monthData[i][j].isToday) {
                    cellStrBefore = cellStrBefore.replace("{todayClass}", "cal-today-cell").replace("{todayStyle}",
                        "font-weight: bold;");
                } else {
                    cellStrBefore = cellStrBefore.replace("{todayClass}", "").replace("{todayStyle}", "");
                }

                if (monthData[i][j].enabled) {
                    cellStrBefore = cellStrBefore.replace("{enabledClass}", "cal-enabled-cell").replace(
                        "{enabledStyle}", "");
                } else {
                    cellStrBefore = cellStrBefore.replace("{enabledClass}", "cal-disabled-cell").replace(
                        "{enabledStyle}", "color: #D2D2D2;");
                }

                htmlStr += cellStrBefore + monthData[i][j].date + cellStrAfter;
            }
            htmlStr += "</tr>";
        }

        htmlStr += "</tbody></table>";

        return htmlStr;
    };

    var _drawCalendar = function (oContainer, sView, oDate) {
        var oData = null,
            headerHtmlStr = null,
            htmlStr = null,
            previousHandler = null,
            nextHandler = null,
            titleHandler = null,
            cellHandler = null;

        switch (sView) {
        case YEAR_SCOPE_VIEW:
            break;
        case YEARS_VIEW:
            break;
        case MONTHS_VIEW:
            headerHtmlStr = _getHeaderView(oDate.getFullYear());
            htmlStr = _getMonthsView();
            previousHandler = function() {
                oDate.setFullYear(oDate.getFullYear() - 1);
                _drawCalendar(container, MONTHS_VIEW, oDate);
            };
            nextHandler = function() {
                oDate.setFullYear(oDate.getFullYear() + 1);
                _drawCalendar(container, MONTHS_VIEW, oDate);
            };
            cellHandler = function() {
                var month = event.target.dataset.monthKey;

                oDate.setMonth(month - 1);
                _drawCalendar(container, MONTH_VIEW, oDate);
            };
            break;
        case MONTH_VIEW:
        default:
            oData = _getMonthDetails(oDate.getFullYear(), oDate.getMonth() + 1);
            headerHtmlStr = _getHeaderView(_transformMonth(oDate.getMonth() + 1) + ", " + oDate.getFullYear());
            htmlStr = _getMonthView(oData);
            previousHandler = function () {
                _drawCalendar(container, MONTH_VIEW, _getPreMonthDate(oDate));
            };
            nextHandler = function() {
                _drawCalendar(container, MONTH_VIEW, _getNextMonthDate(oDate));
            };
            titleHandler = function() {
                _drawCalendar(container, MONTHS_VIEW, oDate);
            };
            break;
        }

        htmlStr =
            "<div class='calendar' style='font-family: Arial, Helvetica, sans-serif; font-size: 16px; padding: 0; text-align:center; min-width: 180px;'>" +
             headerHtmlStr + htmlStr + "</div>";
        oContainer.innerHTML = htmlStr;

        _bindEventHandler(previousHandler, nextHandler, titleHandler, cellHandler);
    };

    var _getPreMonthDate = function (oDate) {
        if (oDate.getMonth() === 0) {
            oDate.setFullYear(oDate.getFullYear() - 1);
            oDate.setMonth(11);
        } else {
            oDate.setMonth(oDate.getMonth() - 1);
        }
        return oDate;
    };

    var _getNextMonthDate = function (oDate) {
        if (oDate.getMonth() == 11) {
            oDate.setFullYear(oDate.getFullYear() + 1);
            oDate.setMonth(0);
        } else {
            oDate.setMonth(oDate.getMonth() + 1);
        }
        return oDate;
    };

    var _bindEventHandler = function (previousHandler, nextHandler, titleHandler, cellHandler) {
        var previousBtn = doc.getElementById("cal-previous"),
            nextBtn = doc.getElementById("cal-next"),
            title = doc.getElementById("cal-title"),
            cells = doc.getElementsByClassName("cal-cell");

        if(previousHandler) {
            previousBtn.addEventListener("click", previousHandler);
        }

        if(nextHandler){
            nextBtn.addEventListener("click", nextHandler);
        }

        if(titleHandler) {
            title.addEventListener("click", titleHandler);
        }

        if(cellHandler) {
            for (var i = 0, j = cells.length; i < j; i++) {
                cells[i].addEventListener("click", cellHandler);
            }
        }
    };

    var _placeAt = function (sId) {
        container = doc.getElementById(sId);
        oConfig = _initConfig(oConfig);

        if (container === null) {
            throw new Error("Container Not Found");
        } else {
            _drawCalendar(container, oConfig.viewName, oConfig.date);
        }
    };

    return {
        placeAt: _placeAt
    };
};