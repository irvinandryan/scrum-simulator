import { getCurrentSprint } from "./Utils";

export const getPlannedReleasePoint = (productBacklog) => {
    let plannedPbPoints = 0;
    for (let i = 0; i < productBacklog.length; i++) {
        plannedPbPoints += productBacklog[i].pbPoint;
    }
    return plannedPbPoints;
}

export const getReleasePointCompleted = (productBacklog) => {
    let completedPbPoints = 0;
    for (let i = 0; i < productBacklog.length; i++) {
        if (productBacklog[i].isPbDone) {
            completedPbPoints += productBacklog[i].pbPoint;
        }
    }
    return completedPbPoints;
}

export const getActualPercentCompleted = (productBacklog) => {
    return (getReleasePointCompleted(productBacklog) / getPlannedReleasePoint(productBacklog));
}

export const getPlannedPercentCompleted = (sprintBacklog, plannedSprint) => {
    let completedSprint = 0;
    for (let i = 0; i < sprintBacklog.length; i++) {
        if (sprintBacklog[i].isSprintDone) {
            completedSprint++;
        }
    }
    return (completedSprint / plannedSprint);
}

export const getActualCost = (sprintBacklog) => {
    let totalCost = 0;
    for (let i = 0; i < sprintBacklog.length; i++) {
        totalCost += sprintBacklog[i].sprintCost;
    }
    return totalCost;
}

export const getPlannedValue = (sprintBacklog, plannedSprint, plannedCost) => {
    return (getPlannedPercentCompleted(sprintBacklog, plannedSprint) * plannedCost);
}

export const getEarnedValue = (productBacklog, plannedCost) => {
    return (getActualPercentCompleted(productBacklog) * plannedCost);
}

export const getCostVariance = (productBacklog, sprintBacklog, plannedCost) => {
    return (getEarnedValue(productBacklog, plannedCost) - getActualCost(sprintBacklog));
}

export const getScheduleVariance = (productBacklog, sprintBacklog, plannedSprint, plannedCost) => {
    return (getEarnedValue(productBacklog, plannedCost) - getPlannedValue(sprintBacklog, plannedSprint, plannedCost));
}

export const getCostPerformanceIndex = (productBacklog, sprintBacklog, plannedCost) => {
    return (getEarnedValue(productBacklog, plannedCost) / getActualCost(sprintBacklog));
}

export const getSchedulePerformanceIndex = (productBacklog, sprintBacklog, plannedSprint, plannedCost) => {
    return (getEarnedValue(productBacklog, plannedCost) / getPlannedValue(sprintBacklog, plannedSprint, plannedCost));
}

export const getEstimateToCompleteion = (productBacklog, sprintBacklog, plannedCost) => {
    return ((plannedCost - getEarnedValue(productBacklog, plannedCost)) / getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost));
}

export const getEstimateAtCompletion = (productBacklog, sprintBacklog, plannedCost) => {
    return (getActualCost(sprintBacklog) + getEstimateToCompleteion(productBacklog, sprintBacklog, plannedCost));
}

export const getReleaseDate = (productBacklog, sprintBacklog, plannedCost, startDate, sprintLength) => {
    let SD = new Date(startDate);
    let L = sprintLength;
    let n = getCurrentSprint(sprintBacklog);
    let EAC = getEstimateAtCompletion(productBacklog, sprintBacklog, plannedCost);
    let AC = getActualCost(sprintBacklog);
    let temp = L * (n * (EAC / AC));
    return addWorkingDays(SD, temp);
}

// add working days to a date
// https://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates
export const addWorkingDays = (date, days) => {
    var result = new Date(date);
    while (days > 0) {
        result.setDate(result.getDate() + 1);
        if (result.getDay() !== 0 && result.getDay() !== 6) {
            days--;
        }
    }
    return result;
}

