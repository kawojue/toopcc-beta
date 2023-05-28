"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getNextAppDates(lastVisitDate) {
    const maxFutureMonths = 4;
    const nextAppointmentDates = [];
    const endDate = new Date();
    const startDate = new Date(lastVisitDate);
    endDate.setMonth(endDate.getMonth() + maxFutureMonths);
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        const currentDay = currentDate.getDay();
        if (currentDay === 2 || currentDay === 4) {
            nextAppointmentDates.push(currentDate.toISOString());
        }
    }
    return nextAppointmentDates;
}
function lastNextApp(date) {
    const dates = getNextAppDates(date);
    return dates[dates.length - 1];
}
exports.default = lastNextApp;
