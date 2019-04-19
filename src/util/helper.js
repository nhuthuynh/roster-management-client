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
