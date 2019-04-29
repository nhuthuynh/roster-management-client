export function getDate(theDate) {
    let date = new Date();
    date.setTime(theDate);
    return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
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
 * Given an a array of objects, return new value-copied array of objects
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