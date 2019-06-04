import moment from 'moment'

export function getDate(theDate) {
    let date = new Date();
    date.setTime(theDate);
    let newDate = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}` 
    let newMonth = date.getMonth()+1 > 9 ? date.getMonth()+1 : `0${date.getMonth()+1}`
    return `${newDate}-${newMonth}-${date.getFullYear()}`;
}

export function getHoursAndMinuteOfDate(theDate) {
    let date = new Date();
    date.setTime(theDate);
    return `${date.getHours()}:${date.getMinutes()}`;
}

export function getSmallerDate(firstDate, secondDate) {
    let date1 = new Date(firstDate),
        date2 = new Date(secondDate);

    return date1.getTime() > date2.getTime() ? getDate(date2) : getDate(date1);
}

export function switchPositionBetweenDayAndMonth(date) {
    let tempDate = date.split("-")

    return `${tempDate[1]}-${tempDate[0]}-${tempDate[2]}`

}

/**
* Generate random string for password
* 
*/

export function generateRandomPassword() {
    return Math.random().toString(36).slice(-10)
}

/**
* Given a Date, return a new Date object for the first
* day of the week.
* @param {Date} date - date object
* @param {boolean} mon - true if week starts on Monday, otherwise starts on Sunday
*/
export function getFirstAndLastDayOfWeek(date, mon) {
    let firstDate = new Date(+date);
    let lastDate = new Date();

    if (mon) {
        firstDate.setDate(firstDate.getDate() - (firstDate.getDay() || 7) + 1);
    } else {
        firstDate.setDate(firstDate.getDate() - firstDate.getDay());
    }

    lastDate.setDate(firstDate.getDate() + 6);
    return {
        firstDate, lastDate
    };
}

/**
* Given Hour and Minute return string formatted in HH:mm 
* @param {int} hour
* @param {int} minute
*/

export function formatNumberWithLeadingZero(hour, minute) {
    hour = hour < 10 ? `0${hour}` : hour
    minute = minute < 10 ? `0${minute}` : minute
    return `${hour}:${minute}`
}

/**
* Given time and regex return boolean value of whether the given time is valid with given regex
* @param {string} time
* @param {regex} reg - a regex to check the given time is valid or not
*/

export function isValidTime(time, reg) {
    if (!time || !reg || Number.isNaN(time) || !reg.test(time)) return false
    return true
}

/**
 * Given an array of objects, return new value-copied array of objects
 * @param {Array} array - array of objects
 */

export function copyArray(array) {
    let newArray = []
    for (let arrayIndex = 0, arrayLen = array.length; arrayIndex < arrayLen; arrayIndex++) {
        newArray[arrayIndex] = {}
        for(let prop in array[arrayIndex]) {
            newArray[arrayIndex][prop] = array[arrayIndex][prop]
        }
    }

    return newArray
}

/**
 * Given a url search string from url, return object with employeeId and token
 * @param {String} url - search string in 
 */

export function getEmployeeIdAndTokenFromUrl(url) {
    if (url && url.indexOf('employeeId') > 0 && url.indexOf('token') > 0) {
        let values = url.split('&')
        return {
            employeeId: values[0].replace('?employeeId=', ''),
            token: values[1].replace('token=', '')
        }
    }
    return {}
}

export function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
}

export function disabledToDate(current) {
    // Can not select days before today and today
    return current < moment().endOf('day')
}

export function getShopOwnerId(currentUser) {
    if (!currentUser) return ""
    return currentUser.shopOwnerId ? currentUser.shopOwnerId : currentUser.id
}