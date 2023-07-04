function fetchDates(day: string, startDate: string, endDate: string): string[] {
    const dates: string[] = []
    const daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    for (let currentDate: Date = new Date(startDate); currentDate < new Date(endDate); currentDate.setDate(currentDate.getDate() + 1)) {
        const currentDay: number = currentDate.getDay()
        const getDayIndex: number = daysOfWeek.indexOf(day)
        
        if (currentDay === getDayIndex) {
            dates.push(currentDate.toISOString())
        }
    }
    return dates
}

// Test case..
const day: string = "Monday"
const startDate: string = "2023-07-13"
const endDate: string = "2023-07-27"

console.log(fetchDates(day, startDate, endDate))