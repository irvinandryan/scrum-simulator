import { getCurrentSprint, isAllPbDone } from "./Utils";

export const getPlannedReleasePoint = (productBacklog) => {
    let plannedPbPoints = 0;
    for (let i = 0; i < productBacklog.length; i++) {
        plannedPbPoints += productBacklog[i].pbPoint;
    }
    return plannedPbPoints;
};

export const getReleasePointCompleted = (productBacklog) => {
    let completedPbPoints = 0;
    for (let i = 0; i < productBacklog.length; i++) {
        if (productBacklog[i].isPbDone) {
            completedPbPoints += productBacklog[i].pbPoint;
        }
    }
    return completedPbPoints;
};

export const getActualPercentCompleted = (productBacklog) => {
    return (getReleasePointCompleted(productBacklog) / getPlannedReleasePoint(productBacklog));
};

export const getPlannedPercentCompleted = (sprintBacklog, plannedSprint) => {
    let completedSprint = 0;
    for (let i = 0; i < sprintBacklog.length; i++) {
        if (sprintBacklog[i].isSprintDone) {
            completedSprint++;
        }
    }
    return (completedSprint / plannedSprint);
};

export const getActualCost = (sprintBacklog) => {
    let totalCost = 0;
    for (let i = 0; i < sprintBacklog.length; i++) {
        totalCost += sprintBacklog[i].sprintCost;
    }
    return totalCost;
};

export const getPlannedValue = (sprintBacklog, plannedSprint, plannedCost) => {
    return (getPlannedPercentCompleted(sprintBacklog, plannedSprint) * plannedCost);
};

export const getEarnedValue = (productBacklog, plannedCost) => {
    return (getActualPercentCompleted(productBacklog) * plannedCost);
};

export const getCostVariance = (productBacklog, sprintBacklog, plannedCost) => {
    return (getEarnedValue(productBacklog, plannedCost) - getActualCost(sprintBacklog));
};

export const getScheduleVariance = (productBacklog, sprintBacklog, plannedSprint, plannedCost) => {
    return (getEarnedValue(productBacklog, plannedCost) - getPlannedValue(sprintBacklog, plannedSprint, plannedCost));
};

export const getCostPerformanceIndex = (productBacklog, sprintBacklog, plannedCost) => {
    let CPI = getEarnedValue(productBacklog, plannedCost) / getActualCost(sprintBacklog)
    if (isNaN(CPI)) {
        return 1;
    }
    return CPI;
};

export const getSchedulePerformanceIndex = (productBacklog, sprintBacklog, plannedSprint, plannedCost) => {
    let SPI = getEarnedValue(productBacklog, plannedCost) / getPlannedValue(sprintBacklog, plannedSprint, plannedCost);
    if (isNaN(SPI)) {
        return 1;
    }
    return SPI;
};

export const getEstimateToCompleteion = (productBacklog, sprintBacklog, plannedCost) => {
    return ((plannedCost - getEarnedValue(productBacklog, plannedCost)) / getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost));
};

export const getEstimateAtCompletion = (productBacklog, sprintBacklog, plannedCost) => {
    return (getActualCost(sprintBacklog) + getEstimateToCompleteion(productBacklog, sprintBacklog, plannedCost));
};

export const getReleaseDate = (productBacklog, sprintBacklog, plannedCost, startDate, sprintLength) => {
    let SD = new Date(startDate);
    let L = sprintLength;
    let n = getCurrentSprint(sprintBacklog);
    let EAC = getEstimateAtCompletion(productBacklog, sprintBacklog, plannedCost);
    let AC = getActualCost(sprintBacklog);
    let temp = L * (n * (EAC / AC));
    if (isAllPbDone(productBacklog) === true) {
        return addWorkingDays(SD, temp + L);
    }
    return addWorkingDays(SD, temp);
};

export const addWorkingDays = (date, days) => {
    var result = new Date(date);
    while (days > 0) {
        result.setDate(result.getDate() + 1);
        if (result.getDay() !== 0 && result.getDay() !== 6) {
            days--;
        }
    }
    let dd = result.getDate();
    let mm = result.getMonth() + 1;
    let yyyy = result.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    result = yyyy + '-' + mm + '-' + dd;
    return result;
};

export const getBudgetStatus = (productBacklog, sprintBacklog, plannedCost) => {
    let CPI = getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost);
    if (CPI < 1) {
        return "Over planned cost";
    } else if (CPI > 1) {
        return "Under planned cost";
    } else {
        return "On planned cost";
    }
};

export const getScheduleStatus = (productBacklog, sprintBacklog, plannedSprint, plannedCost) => {
    let SPI = getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost);
    if (SPI < 1) {
        return "Behind schedule";
    } else if (SPI > 1) {
        return "Ahead of schedule";
    } else {
        return "On schedule";
    }
};