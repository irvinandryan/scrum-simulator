export const getCurrentSprint = (sprintBacklog) => {
    for (let i = 0; i < sprintBacklog.length; i++) {
        if (sprintBacklog[i].sprintBacklogItem.length === 0) {
            return (i-1);
        }
    }
    return (sprintBacklog.length-1);
}

export const getTotalScrumTeamWorkHour = (scrumTeamSize, scrumTeamHour, sprintLength) => {
    return (scrumTeamSize * scrumTeamHour * sprintLength);
}

export const getTotalWorkHour = (sprintBacklog) => {
    let totalWorkHour = 0;
    for (let i = 0; i < sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem.length; i++) {
        totalWorkHour += sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].sbHour;        
    }
    return totalWorkHour;
}

export const getTotalWorkHourOfPb = (pbId, sprintBacklog) => {
    let totalWorkHour = 0;
    for (let i = 0; i < sprintBacklog.length; i++) {
        for (let j = 0; j < sprintBacklog[i].sprintBacklogItem.length; j++) {
            if (sprintBacklog[i].sprintBacklogItem[j].relatedPbId === pbId) {
                totalWorkHour += sprintBacklog[i].sprintBacklogItem[j].sbHour;
            }
        }
    }
    return totalWorkHour;
}

export const getTotalCostOfPb = (pbId, sprintBacklog, scrumTeamRate) => {
    return (getTotalWorkHourOfPb(pbId, sprintBacklog) * scrumTeamRate);
}