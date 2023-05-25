
function getNextAppDates(lastVisitDate: string): string[] {
    const maxFutureMonths: number = 4
    const nextAppointmentDates: string[] = []

    const endDate: Date = new Date()
    const startDate: Date = new Date(lastVisitDate)
    endDate.setMonth(endDate.getMonth() + maxFutureMonths)

    for (let currentDate: Date = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        const currentDay = currentDate.getDay()
        if (currentDay === 2 || currentDay === 4) {
            nextAppointmentDates.push(currentDate.toISOString())
        }
    }

    return nextAppointmentDates
}

export default function lastNextApp(date: string): string {
    const dates: string[] = getNextAppDates(date)
    return dates[dates.length - 1]
}
