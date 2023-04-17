import { getAveragePbPoint, getCurrentSprint } from './Utils';

// E-01
// randomly choose a sprint backlog item in current sprint and make isSbDone false
export const rejectSb = (sprintBacklog, productBacklog) => {
    const currentSprint = getCurrentSprint(sprintBacklog);
    const randomSbIndex = Math.floor(Math.random() * sprintBacklog[currentSprint].sprintBacklogItem.length);
    sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].isSbDone = false;
    for (let i = 0; i < sprintBacklog[currentSprint].releaseBacklog.length; i++) {
        if (sprintBacklog[currentSprint].releaseBacklog[i].rbId === sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].relatedPbId) {
            sprintBacklog[currentSprint].releaseBacklog[i].isRbDone = false;
        }
    }
    for (let i = 0; i < productBacklog.length; i++) {
        if (productBacklog[i].pbId === sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].relatedPbId) {
            productBacklog[i].isPbDone = false;
        }
    }
    return sprintBacklog;
};

// E-02
// randomly choose a release backlog in current sprint and make isRbDone false
export const rejectRb = (sprintBacklog, productBacklog) => {
    const currentSprint = getCurrentSprint(sprintBacklog);
    const randomRbIndex = Math.floor(Math.random() * sprintBacklog[currentSprint].releaseBacklog.length);
    sprintBacklog[currentSprint].releaseBacklog[randomRbIndex].isRbDone = false;
    for (let i = 0; i < productBacklog.length; i++) {
        if (productBacklog[i].pbId === sprintBacklog[currentSprint].releaseBacklog[randomRbIndex].rbId) {
            productBacklog[i].isPbDone = false;
        }
    }
    return sprintBacklog;
};

// E-03
// randomly generate a new product backlog item and add it to the product backlog
export const addPb = (productBacklog) => {
    const newPb = {
        pbId: "PB-"+productBacklog.length,
        pbPoint: Math.floor(Math.random() * getAveragePbPoint(productBacklog)),
        isPbDone: false,
    };
    productBacklog.push(newPb);
    return productBacklog;
};

// E-04
// randomly add sprint cost to the current sprint
export const addSprintCost = (sprintBacklog, scrumTeamRate) => {
    const currentSprint = getCurrentSprint(sprintBacklog);
    sprintBacklog[currentSprint].sprintCost += Math.floor(Math.random() * scrumTeamRate);
    return sprintBacklog;
};

// E-05
// randomly make team size decrease by 1
export const decreaseTeamSize = (scrumTeamSize) => {
    let random = Math.random();
    if (random < 0.5) {
        if (scrumTeamSize > 1) {
            scrumTeamSize--;
        }
        return scrumTeamSize;
    }
};