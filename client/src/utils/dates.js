const DATE = new Date()

export default function getTodayDate() {
    return DATE.toISOString().substring(0, 10)
}
export function AddDaysToDate(inputDate, numberOfDays) {
    const date = new Date(inputDate);
    date.setDate(date.getDate() + numberOfDays);
    return date.toISOString()
}
