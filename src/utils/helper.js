import { getValue } from "@/utils/auth";
import BigNumber from "bignumber.js";
export function formatTime(
  timestamp,
  seconds = 1000,
  format = "yyyy-MM-dd hh:mm:ss"
) {
  const newDate = new Date(timestamp * seconds);
  // eslint-disable-next-line
  Date.prototype.format = function (format) {
    var date = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S+": this.getMilliseconds(),
    };

    if (/(y+)/i.test(format)) {
      format = format.replace(
        RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (var key in date) {
      if (new RegExp("(" + key + ")").test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? date[key]
            : ("00" + date[key]).substr(("" + date[key]).length)
        );
      }
    }
    return format;
  };

  return newDate.format(format);
}

export function formatTimimg(updateTime) {
  if (updateTime === null) {
    return "";
  }
  //console.log("locale= "+getValue("locale"))
  var local = getValue("locale") === "zh-cn" ? 0 : 1;
  // var local = localStorage.getItem('locale') === 'zh' ? 0 : 1
  var tips = {
    just: "刚刚",
    second: "秒",
    minute: "分钟",
    hour: "小时",
    day: "天",
    week: "周",
    month: "个月",
    year: "年",

    seconds: "秒",
    minutes: "分钟",
    hours: "小时",
    days: "天",
    weeks: "周",
    months: "个月",
    years: "年",
  };
  if (local === 1) {
    tips = {
      just: " just ",
      second: " sec ",
      minute: " min ",
      hour: " hr ",
      day: " day ",
      week: " week ",
      month: " month ",
      year: " year ",

      seconds: " secs ",
      minutes: " mins ",
      hours: " hrs ",
      days: " days ",
      weeks: " weeks ",
      months: " months ",
      years: " years ",
    };
  }
  const now = new Date().getTime();
  const second = Math.floor((now - updateTime) / 1000);
  const minute = Math.floor(second / 60);
  const hour = Math.floor(minute / 60);
  const day = Math.floor(hour / 24);
  const month = Math.floor(day / 30);
  const year = Math.floor(month / 12);
  if (year > 0) {
    // const t = month - (year * 12)
    // return year + tips.year + t + tips.month
    if (year > 1) return year + tips.years;
    else return year + tips.year;
  } else if (month > 0) {
    // const t = day - (month * 31)
    // return month + tips.month + t + tips.day
    if (month > 1) return month + tips.months;
    else return month + tips.month;
  } else if (day > 0) {
    if (day > 1) return day + tips.days;
    else return day + tips.day;
    //const ret = day + tips.day
    //return ret
  } else if (hour > 0) {
    // const t = minute - (hour * 60)
    // return hour + tips.hour + t + tips.minute
    if (hour > 1) return hour + tips.hours;
    else return hour + tips.hour;
  } else if (minute > 0) {
    // const t = second - (minute * 60)
    if (minute > 1) return minute + tips.minutes;
    else return minute + tips.minute;
    // return minute + tips.minute + t + tips.second
  } else if (second > 0) {
    if (second > 1) return second + tips.seconds;
    else return second + tips.second;
  } else {
    return 0 + tips.second;
  }
}

export function formatfloat(num) {
  var result = parseFloat(num);
  if (isNaN(result)) {
    alert("Error in passing parameters!");
    return false;
  }
  result = Math.round(num * 100) / 100;
  var s_x = result.toString();

  var pos_decimal = s_x.indexOf(".");

  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += ".";
  }

  while (s_x.length <= pos_decimal + 2) {
    s_x += "0";
  }
  return s_x;
}

export function goUrl(_that, url, selector) {
  _that.navIndex = url;
  _that.$router.push({
    name: url,
    params: {
      selector: selector,
    },
  });
}
export function goTheUrl(_that, url, params) {
  _that.navIndex = url;
  _that.$router.push({
    name: url,
    params: params,
  });
}
export function goPathUrl(_that, url, selector) {
  _that.navIndex = url;
  url = url.toLowerCase();
  _that.$router.push({
    path: "/" + url + "/" + selector,
  });
}

export function getDataFormat(data, pow = 18, decimal = 10000) {
  let x = new BigNumber(data);
  let length = parseInt(x.toFixed().length) - pow + 4;
  return x.toFixed().substring(0, length) / decimal;
}

export function getDataFormatDecimal(data, pow = 18, decimal = 10000, row = 4) {
  let x = new BigNumber(data);
  let length = parseInt(x.toFixed().length) - pow + row;
  return x.toFixed().substring(0, length) / decimal;
}

export function getAddrFormat(data, number = 16) {
  if (!data || data.length === 0) {
    return;
  }
  if (typeof data !== "string") {
    data = `${data}`;
  }
  if (data.length <= number * 2) {
    return data;
  }
  const str1 = data.substr(0, number);
  const str2 = data.substr(data.length - number);
  return str1 + "..." + str2;
}

export function changeSymbol(data, symbol = "utg", digits = "2") {
  if (!data || data.length === 0) {
    return;
  }
  const str1 = data.substr(digits, data.length);
  return symbol + "" + str1;
}

export function changeBackSymbol(data, symbol = "0x", digits = "3") {
  if (!data || data.length === 0) {
    return;
  }
  const str1 = data.substr(digits, data.length);
  return symbol + "" + str1;
}
export function goAnchor(selector) {
  this.menuDisplay = false;
  this.drawer = false;
  const anchor = document.getElementById(selector);
  const total = anchor.offsetTop;
  let distance =
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    window.pageYOffset;
  let step = total / 50;
  if (distance < total) {
    (function smoothDown() {
      if (distance < total) {
        distance += step;
        document.body.scrollTop = distance;
        document.documentElement.scrollTop = distance;
        setTimeout(smoothDown, 10);
      } else {
        document.body.scrollTop = total;
        document.documentElement.scrollTop = total;
      }
    })();
  } else {
    const newTotal = distance - total;
    step = newTotal / 50;
    (function smoothUp() {
      if (distance > total) {
        distance -= step;
        document.documentElement.scrollTop = distance;
        setTimeout(smoothUp, 5);
      } else {
        document.documentElement.scrollTop = total;
      }
    })();
  }
}
