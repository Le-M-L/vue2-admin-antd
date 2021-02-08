import enquireJs from 'enquire.js'  //媒体查询库

export function isDef(v) {
  return v !== undefined && v !== null
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true)
    },
    unmatch: function () {
      call && call(false)
    }
  }
  enquireJs.register('only screen and (max-width: 767.99px)', handler)
}

export const dateToString = (date, type) => {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString();
  var day = (date.getDate()).toString();
  var h = (date.getHours()).toString();
  var m = (date.getMinutes()).toString();
  var s = (date.getSeconds()).toString()
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }
  if (h.length == 1) {
    h = "0" + h
  }
  if (m.length == 1) {
    m = "0" + m
  }
  if (s.length == 1) {
    s = "0" + s
  }
  let dateTime;
  switch (type) {
    case 'year':
      dateTime = year.toString()
      break;
    case 'month':
      dateTime = year + "-" + month
      break;
    case 'day':
      dateTime = year + "-" + month + "-" + day
      break;

    default:
      dateTime = year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
      break;
  }
  return dateTime;
}

const _toString = Object.prototype.toString
