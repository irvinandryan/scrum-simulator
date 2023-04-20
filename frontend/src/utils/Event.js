import { getAveragePbPoint, getCurrentSprint, getCurrentSprintReview, getRandomBetween, getRemainingCost } from './Utils';

// E-01
// randomly choose a sprint backlog item in current sprint and make isSbDone false
export const rejectSb = (sprintBacklog, productBacklog) => {
    const currentSprint = getCurrentSprintReview(sprintBacklog)-1;
    const randomSbIndex = Math.floor(getRandomBetween(0, sprintBacklog[currentSprint].sprintBacklogItem.length-1));
    sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].isSbDone = false;
    const rbIndex = sprintBacklog[currentSprint].releaseBacklog.findIndex(rb => rb.rbId === sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].relatedPbId);
    sprintBacklog[currentSprint].releaseBacklog[rbIndex].isRbDone = false;
    const pbIndex = productBacklog.findIndex(pb => pb.pbId === sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].relatedPbId);
    productBacklog[pbIndex].isPbDone = false;
    const eventLog = "Sprint backlog " + sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].sbId + " related with release backlog " + sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].relatedPbId + " cannot be completed";
    return {sprintBacklog, productBacklog, eventLog};
};

// E-02
// randomly choose a release backlog in current sprint and make isRbDone false
export const rejectRb = (sprintBacklog, productBacklog) => {
    const currentSprint = getCurrentSprintReview(sprintBacklog)-1;
    const randomRbIndex = Math.floor(getRandomBetween(0, sprintBacklog[currentSprint].releaseBacklog.length-1));
    sprintBacklog[currentSprint].releaseBacklog[randomRbIndex].isRbDone = false;
    const pbIndex = productBacklog.findIndex(pb => pb.pbId === sprintBacklog[currentSprint].releaseBacklog[randomRbIndex].rbId);
    productBacklog[pbIndex].isPbDone = false;
    const eventLog = "Release backlog " + sprintBacklog[currentSprint].releaseBacklog[randomRbIndex].rbId + " is rejected by product owner";
    return {sprintBacklog, eventLog};
};

// E-03
// randomly generate a new product backlog item and add it to the product backlog
export const addPb = (productBacklog) => {
    const newPb = {
        pbId: "PB-"+(productBacklog.length+1),
        pbPoint: Math.floor(Math.random() * getAveragePbPoint(productBacklog)),
        isPbDone: false,
    };
    productBacklog.push(newPb);
    const eventLog = "Product owner add a new item " + productBacklog[productBacklog.length-1].pbId + " in product backlog with " + productBacklog[productBacklog.length-1].pbPoint + " story points";
    return {productBacklog, eventLog};
};

// E-04
// randomly add sprint cost to the current sprint
export const addSprintCost = (sprintBacklog, plannedCost) => {
    const currentSprint = getCurrentSprintReview(sprintBacklog)-1;
    const increasePercent = getRandomBetween(0, 0.25).toFixed(2);
    if (increasePercent > 0) {
        let temp = sprintBacklog[currentSprint].sprintCost;
        sprintBacklog[currentSprint].sprintCost += increasePercent * sprintBacklog[currentSprint].sprintCost;
        if (sprintBacklog[currentSprint].sprintCost > getRemainingCost(plannedCost, sprintBacklog)) {
            sprintBacklog[currentSprint].sprintCost = getRemainingCost(plannedCost, sprintBacklog);
            increasePercent = (sprintBacklog[currentSprint].sprintCost - temp) / temp;
        }
        const eventLog = "Sprint cost is increased by " + increasePercent * 100 + "%";
        return {sprintBacklog, eventLog};
    }
};

// E-05
// randomly make team size decrease by 1
export const decreaseTeamSize = (scrumTeamSize) => {
    const decrement = Math.floor(0.2 * scrumTeamSize);
    if (scrumTeamSize > 1) {
        scrumTeamSize-=decrement;
    }
    return scrumTeamSize;
};