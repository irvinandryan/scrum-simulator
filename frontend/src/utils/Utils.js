import jwt_decode from "jwt-decode";

export const getCurrentSprint = (sprintBacklog) => { // get the current sprint before sprint executed
    for (let i = 0; i < sprintBacklog.length; i++) {
        if (sprintBacklog[i].isSprintDone === false) {
            return i;
        }
    }
    return (sprintBacklog.length-1);
};

export const getCurrentSprintReview = (sprintBacklog) => { // get the current sprint after sprint executed
    for (let i = 0; i < sprintBacklog.length; i++) {
        if (sprintBacklog[i].isSprintDone === false) {
            return i;
        }
    }
    return (sprintBacklog.length);
};

export const getMaxScrumTeamWorkHour = (scrumTeamSize, scrumTeamHour, sprintLength) => { // get the max work hour of a scrum team
    return (scrumTeamSize * scrumTeamHour * sprintLength);
};

export const getTotalWorkHourOfPb = (pbId, sprintBacklog) => { // get the total work hour of a product backlog item
    let totalWorkHour = 0;
    for (let i = 0; i < sprintBacklog.length; i++) {
        for (let j = 0; j < sprintBacklog[i].sprintBacklogItem.length; j++) {
            if (sprintBacklog[i].sprintBacklogItem[j].relatedPbId === pbId) {
                totalWorkHour += sprintBacklog[i].sprintBacklogItem[j].sbHour;
            }
        }
    }
    return totalWorkHour;
};

// get total work hour of a sprint
export const getTotalWorkHourOfSprint = (sprintBacklog) => {
    let totalWorkHour = 0;
    for (let i = 0; i < sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem.length; i++) {
        totalWorkHour += sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].sbHour;
    }
    return totalWorkHour;
};

export const getTotalCostOfPb = (pbId, sprintBacklog, scrumTeamRate) => { // get the total cost of a product backlog item
    return (getTotalWorkHourOfPb(pbId, sprintBacklog) * scrumTeamRate);
};

export const getTotalSpendingThisSprint = (sprintBacklog, scrumTeamRate) => { // get the total spending of the current sprint
    let totalSpentCost = 0;
    for (let i = 0; i < sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem.length; i++) {
        totalSpentCost += (sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].sbHour * scrumTeamRate);
    }
    return totalSpentCost;
};

export const getTotalSpending = (sprintBacklog) => { // get the total spending of the project
    let totalSpentCost = 0;
    for (let i = 0; i < sprintBacklog.length; i++) {
        totalSpentCost += sprintBacklog[i].sprintCost;
    }
    return totalSpentCost;
};

export const getRemainingCost = (plannedCost, sprintBacklog) => { // get the remaining cost of the project
    return (plannedCost - getTotalSpending(sprintBacklog));
};

export const isAllPbDone = (productBacklog) => { // check if all product backlog items are done
    for (let i = 0; i < productBacklog.length; i++) {
        if (productBacklog[i].isPbDone === false) {
            return false;
        }
    }
    return true;
};

export const isRunOutOfCash = (sprintBacklog, plannedCost) => { // check if the remaining cost is enough to finish the project
    return (getTotalSpending(sprintBacklog) >= plannedCost);
};

export const isSimulationDone = (productBacklog, sprintBacklog, plannedCost) => { // check if the simulation is done
    return (isAllPbDone(productBacklog) || isRunOutOfCash(sprintBacklog, plannedCost) || (getCurrentSprint(sprintBacklog) === parseInt(sprintBacklog.length)) || (getCurrentSprintReview(sprintBacklog) === parseInt(sprintBacklog.length)));
};

export const isWeekday = (date) => { // check if the date is a weekday
    const day = date.getDay();
    return day !== 0 && day !== 6;
};

export const getAveragePbPoint = (productBacklog) => {
    let totalPbPoint = 0;
    for (let i = 0; i < productBacklog.length; i++) {
        totalPbPoint += productBacklog[i].pbPoint;
    }
    return Math.floor(totalPbPoint / productBacklog.length);
};

export const getSessionUsername = () => {
    try {
        const token = localStorage.getItem("authToken");
        const decoded = jwt_decode(token);
        return decoded.username;
    } catch (error) {
        return error;
    }
};

export const getRandomBoolean = (probability) => {
    const random = Math.random();
    return (random <= probability);
}

export const getRandomBetween = (min, max) => {
    return (Math.random() * (max - min) + min);
}

// get project status, wether it is completed or not
export const getProjectStatus = (productBacklog, sprintBacklog, plannedCost) => {
    if (isAllPbDone(productBacklog)) {
        return "Completed";
    } else if (isRunOutOfCash(sprintBacklog, plannedCost)) {
        return "Run out of cash";
    } else {
        return "Cannot be completed on time";
    }
}