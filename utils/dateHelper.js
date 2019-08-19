var DAY_IN_MILLIS = 24 * 60 * 60 * 1000;
var WEEK_IN_MILLIS = 7 * DAY_IN_MILLIS;
var MONTH_IN_MILLIS = 30 * DAY_IN_MILLIS;
var YEAR_IN_MILLIS = 365 * DAY_IN_MILLIS;
var logger = require('../models/logger');

Date.prototype.pattern = function(fmt) {
    var o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时 (12小时制)
        'H+': this.getHours(), //小时 (24小时制)
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        'S': this.getMilliseconds() //毫秒
    };
    var week = {
        '0': '/u65e5',
        '1': '/u4e00',
        '2': '/u4e8c',
        '3': '/u4e09',
        '4': '/u56db',
        '5': '/u4e94',
        '6': '/u516d'
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + '']);
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
}

//判断两个日期对象是否是一天
Date.prototype.sameDay = function(date) {
    if (!this || !date) {
        return false;
    }
    var now = new Date(this);
    var that = new Date(date);
    if (now.getFullYear() == that.getFullYear() && now.getMonth() == that.getMonth() && now.getDay() == that.getDay()) {
        return true;
    } else {
        return false;
    }
};

var dateHelper = {
    getDayCount: function(year, month) {
        var count = 0;
        if (month == 2) {
            if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
                count = 29;
            } else {
                count = 28;
            }
        } else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
            count = 31;
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
            count = 30;
        }
        return count;
    },

    //获取两天之间的天数差
    getDateDiff: function(start, end) {
        logger.debug(start, end);
        var startTime = new Date(start).getTime();
        var endTime = new Date(end).getTime();
        var dates = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
        return dates;
    },

    //获取时间之间的差
    getTimeDiff: function(start, end) {
        var startTime = new Date("2013/04/02 " + start).getTime();
        var endTime = new Date("2013/04/02 " + end).getTime();
        logger.debug(startTime, endTime);
        var times = parseInt(endTime - startTime) / 1000 / 60 / 60;
        return times;
    },
    
    getTimeDiff2: function(start, end) {
        var startTime = new Date(start).getTime();
        var endTime = new Date(end).getTime();
        logger.debug(startTime, endTime);
        var times = parseInt(endTime - startTime) / 1000 / 60 / 60;
        return times;
    },

    setStartTime: function(time) {
        var start = new Date(time);
        start.setHours(0, 0, 0);
        return new Date(start.getTime());
    },

    setEndTime: function(time) {
        var end = new Date(time);
        end.setHours(23, 59, 59);
        return new Date(end.getTime());
    },

    getBeforeDate: function(n) {
        var n = n;
        var d = new Date();
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        var day = d.getDate();
        if (day <= n) {
            if (mon > 1) {
                mon = mon - 1;
            } else {
                year = year - 1;
                mon = 12;
            }
        }
        d.setDate(d.getDate() - n);
        year = d.getFullYear();
        mon = d.getMonth() + 1;
        day = d.getDate();
        s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
        return s;
    },

    getAfterDate: function(startDate,n) {
        var n = n;
        var d = new Date(startDate);
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        var day = d.getDate();
        if (day <= n) {
            if (mon > 1) {
                mon = mon - 1;
            } else {
                year = year - 1;
                mon = 12;
            }
        }
        d.setDate(d.getDate() + n);
        year = d.getFullYear();
        mon = d.getMonth() + 1;
        day = d.getDate();
        s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
        return s;
    },

    /*判断日期区间是否包含今天*/
    isBetweenDate: function(startTime, setEndTime){
        var now = new Date().pattern('yyyy-MM-dd');
        //now.pattern('yyyy-MM-dd');
        var startTime = new Date(startTime).pattern('yyyy-MM-dd');
        var setEndTime = new Date(setEndTime).pattern('yyyy-MM-dd');
        logger.debug("now startTime setEndTime", now , startTime, setEndTime);
        if(now >= startTime && now <= setEndTime) {
            return true;
        }
        return false;
    },

    /*判断日期区间是否包含今天*/
    isBetweenSomeDate: function(startTime, setEndTime, someDate){
        var now = new Date(someDate).pattern('yyyy-MM-dd');
        var startTime = new Date(startTime).pattern('yyyy-MM-dd');
        var setEndTime = new Date(setEndTime).pattern('yyyy-MM-dd');
        logger.debug("now startTime setEndTime", now , startTime, setEndTime);
        if(now >= startTime && now <= setEndTime) {
            return true;
        } 
        return false;
    },

    /*日期是否有交集*/
    isConfictDate: function(startDate, setEndDate, date1, date2){
        logger.debug("date1, date2", date1, date2);
        date1 = new Date(date1); //要提交的开始时间
        date2 = new Date(date2); //要提交的结束时间
        startDate = new Date(startDate);
        setEndDate = new Date(setEndDate);
        logger.debug("date1, date2", date1, date2);
        logger.debug("startDate, setEndDate", startDate, setEndDate);
        if(date2 <= startDate || date1 >= setEndDate) {
            return false;
        }

        return true;
    },

    isConfictTime: function(startTime, setEndTime, date1, date2){
        var now = (new Date()).pattern('yyyy-MM-dd');

        startTime = new Date(now + ' ' + startTime);
        setEndTime = new Date(now + ' ' + setEndTime);
        
        date1 = new Date(now + ' ' + date1);
        date2 = new Date(now + ' ' + date2);
	    logger.debug(date1, date2, startTime, setEndTime)
        if(date2 <= startTime || date1 >= setEndTime) {
            return false;
        }

        return true;
    },
    /*判断是否是之后某一天*/
    isAfterDate: function(startTime) {
        var now = new Date();
        now.pattern('yyyy-MM-dd');
        var startTime = new Date(startTime);
        if(now < startTime) {
            return true;
        }
        return false;
    },

    getBetweenSomeDay: function(startTime, endTime) {
        logger.debug("startTime, endTime", startTime, endTime);
        startTime = new Date(startTime).getTime();
        endTime = new Date(endTime).getTime();
        var days = Math.ceil((endTime - startTime) / (24 * 60 * 60 * 1000));
        logger.debug("days",days);
        var startDate = (new Date(startTime)).pattern('yyyy-MM-dd');
        var endDate = (new Date(endTime)).pattern('yyyy-MM-dd');
        var dates = [];
        var date_time ='';
        /*if (days == 1) {
            date_time = (new Date(startTime + i * 24 * 60 * 60 * 1000)).pattern('yyyy-MM-dd');
             dates.push(date_time);
        }
        else {*/
            for (var i = 0; i < days; i++) {
                date_time = (new Date(startTime + i * 24 * 60 * 60 * 1000)).pattern('yyyy-MM-dd')
                dates.push(date_time);
            } 
       // }
        return dates;
    },

    format: function(s) {  
      var s = '';  
      var mouth = (this.getMonth() + 1)>=10?(this.getMonth() + 1):('0'+(this.getMonth() + 1));  
      var day = this.getDate()>=10?this.getDate():('0'+this.getDate());  
      s += this.getFullYear() + '-'; // 获取年份。  
      s += mouth + "-"; // 获取月份。  
      s += day; // 获取日。  
      return (s); // 返回日期。  
    },

    //判断两个时间是否在同一天
    twoTimeIsSameDay: function(startTime, endTime) {
        logger.debug("startTime, endTime", startTime, endTime);
        var now = new Date().pattern('yyyy-MM-dd');
        var time1 = new Date(now +' '+ startTime).getTime();
        var time2 = new Date(now +' '+ endTime).getTime();
        logger.debug("time1, time2", time1, time2);
        if (time1 > time2) {
            time2 = time2 + (24 * 60 * 60 * 1000);
        }
        var times = (time2 - time1)/ (60 *60 * 1000);
        return times; 
    }


}

module.exports = dateHelper;
