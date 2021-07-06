import moment from 'moment'

const now = new Date(1625575387101)

const dateObject = new Date(now)
console.log(dateObject)
const humanDateFormat = dateObject.toLocaleString() //2019-12-9 10:30:15

dateObject.toLocaleString("en-US", {weekday: "long"}) // Monday
dateObject.toLocaleString("en-US", {month: "long"}) // December
dateObject.toLocaleString("en-US", {day: "numeric"}) // 9
dateObject.toLocaleString("en-US", {year: "numeric"}) // 2019
dateObject.toLocaleString("en-US", {hour: "numeric"}) // 10 AM
dateObject.toLocaleString("en-US", {minute: "numeric"}) // 30
dateObject.toLocaleString("en-US", {second: "numeric"}) // 15
dateObject.toLocaleString("en-US", {timeZoneName: "short"}) // 1