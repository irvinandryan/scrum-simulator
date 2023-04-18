import { getAveragePbPoint, getCurrentSprint, getCurrentSprintReview, getRandomBetween, getRemainingCost } from './Utils';

// E-01
// randomly choose a sprint backlog item in current sprint and make isSbDone false
export const rejectSb = (sprintBacklog, productBacklog) => {
    const currentSprint = getCurrentSprintReview(sprintBacklog)-1;
    const randomSbIndex = Math.floor(Math.random() * (sprintBacklog[currentSprint].sprintBacklogItem.length-1));
    sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].isSbDone = false;
    const rbIndex = sprintBacklog[currentSprint].releaseBacklog.findIndex(rb => rb.rbId === sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].relatedPbId);
    sprintBacklog[currentSprint].releaseBacklog[rbIndex].isRbDone = false;
    const pbIndex = productBacklog.findIndex(pb => pb.pbId === sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].relatedPbId);
    productBacklog[pbIndex].isPbDone = false;
    const message = "Sprint backlog " + sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].sbId + " cannot be completed";
    alert(message);
    return {sprintBacklog, productBacklog};
};

// E-02
// randomly choose a release backlog in current sprint and make isRbDone false
export const rejectRb = (sprintBacklog, productBacklog) => {
    const currentSprint = getCurrentSprintReview(sprintBacklog)-1;
    const randomRbIndex = Math.floor(Math.random() * (sprintBacklog[currentSprint].sprintBacklogItem.length-1));
    sprintBacklog[currentSprint].releaseBacklog[randomRbIndex].isRbDone = false;
    const pbIndex = productBacklog.findIndex(pb => pb.pbId === sprintBacklog[currentSprint].releaseBacklog[randomRbIndex].rbId);
    productBacklog[pbIndex].isPbDone = false;
    const message = "Release backlog " + sprintBacklog[currentSprint].releaseBacklog[randomRbIndex].rbId + " is rejected";
    alert(message);
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
export const addSprintCost = (sprintBacklog) => {
    const currentSprint = getCurrentSprintReview(sprintBacklog)-1;
    const increasePercent = getRandomBetween(0, 0.25).toFixed(2);
    sprintBacklog[currentSprint].sprintCost += increasePercent * sprintBacklog[currentSprint].sprintCost;
    if (increasePercent > 0) {
        const message = "Sprint cost is increased by " + increasePercent * 100 + "%";
        alert(message)
    }
    // handle the case when sprint cost is more than remaining budget
    // if (sprintBacklog[currentSprint].sprintCost > getRemainingCost(plannedCost, sprintBacklog)) {
    //     sprintBacklog[currentSprint].sprintCost = getRemainingCost(plannedCost, sprintBacklog);
    // }
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