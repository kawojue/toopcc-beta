"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByDates = exports.sortByCardNumbers = void 0;
const sortByDates = (array) => {
    return array.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });
};
exports.sortByDates = sortByDates;
const sortByCardNumbers = (array) => {
    return array.sort((a, b) => {
        const numA = parseInt(a.card_no, 10);
        const numB = parseInt(b.card_no, 10);
        if (numA < numB) {
            return -1;
        }
        else if (numA > numB) {
            return 1;
        }
        const alphaA = a.replace(/[^a-zA-Z]/g, "");
        const alphaB = b.replace(/[^a-zA-Z]/g, "");
        return alphaA.localeCompare(alphaB);
    });
};
exports.sortByCardNumbers = sortByCardNumbers;
