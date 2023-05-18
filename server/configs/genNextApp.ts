
export default function getNextAppointmentDates(lastVisitDate: string) {
    const maxFutureMonths: number = 3
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

const lastVisitDate = '2023-05-10T00:00:00.000Z'
const nextAppointments = getNextAppointmentDates(lastVisitDate)

console.log("Next available appointment dates: ")
nextAppointments.forEach((date) => {
    console.log(date)
})
