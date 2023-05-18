import { getAveragePbPoint, getCurrentSprintReview, getRandomBetween, getRemainingCost } from './Utils';

// E-01
// randomly choose a sprint backlog item in current sprint and make isSbDone false
export const rejectSb = (sprintBacklog, productBacklog) => {
    const currentSprint = getCurrentSprintReview(sprintBacklog)-1;
    const randomSbIndex = Math.floor(getRandomBetween(0, sprintBacklog[currentSprint].sprintBacklogItem.length-1));
    sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].isSbDone = false;
    const rbIndex = sprintBacklog[currentSprint].releaseBacklog.findIndex(rb => rb.rbId === sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].relatedPbId);
    if (rbIndex !== -1) {
        sprintBacklog[currentSprint].releaseBacklog[rbIndex].isRbDone = false;
        const pbIndex = productBacklog.findIndex(pb => pb.pbId === sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].relatedPbId);
        productBacklog[pbIndex].isPbDone = false;
        const eventLog = "Sprint backlog " + sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].sbId + ", related with release backlog " + sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].relatedPbId + ", cannot be completed";
        return {sprintBacklog, productBacklog, eventLog};
    } else {
        const eventLog = "Sprint backlog " + sprintBacklog[currentSprint].sprintBacklogItem[randomSbIndex].sbId + " cannot be completed";
        return {sprintBacklog, productBacklog, eventLog};
    }
};

// E-02
// randomly choose a release backlog in current sprint and make isRbDone false
export const rejectRb = (sprintBacklog, productBacklog) => {
    const currentSprint = getCurrentSprintReview(sprintBacklog)-1;
    const randomRbIndex = Math.floor(getRandomBetween(0, sprintBacklog[currentSprint].releaseBacklog.length-1));
    sprintBacklog[currentSprint].releaseBacklog[randomRbIndex].isRbDone = false;
    const pbIndex = productBacklog.findIndex(pb => pb.pbId === sprintBacklog[currentSprint].releaseBacklog[randomRbIndex].rbId);
    productBacklog[pbIndex].isPbDone = false;
    const eventLog = "Release backlog " + sprintBacklog[currentSprint].releaseBacklog[randomRbIndex].rbId + " is rejected by the product owner";
    return {sprintBacklog, eventLog};
};

// E-03
// randomly generate a new product backlog item and add it to the product backlog
export const addPb = (productBacklog) => {
    const newPb = {
        pbId: "PB-"+(productBacklog.length+1),
        pbPoint: Math.floor(Math.random() * getAveragePbPoint(productBacklog))+1,
        isPbDone: false,
    };
    productBacklog.push(newPb);
    const eventLog = "Product owner add a new item " + productBacklog[productBacklog.length-1].pbId + " in product backlog with " + productBacklog[productBacklog.length-1].pbPoint + " story points";
    return {productBacklog, eventLog};
};

// E-04
// randomly add sprint cost between 1-25% to the current sprint
export const addSprintCost = (sprintBacklog, plannedCost) => {
    const currentSprint = getCurrentSprintReview(sprintBacklog)-1;
    let increasePercent = getRandomBetween(1.01, 1.25).toFixed(2);
    let percent = (increasePercent * 100) - 100;
    let currentCost = sprintBacklog[currentSprint].sprintCost;
    let newCost = (increasePercent * currentCost);

    if (newCost > getRemainingCost(plannedCost, sprintBacklog)) {
        increasePercent = (getRemainingCost(plannedCost, sprintBacklog) - currentCost) / currentCost;
        newCost = getRemainingCost(plannedCost, sprintBacklog);
    }
    sprintBacklog[currentSprint].sprintCost = newCost;
    const eventLog = "Sprint cost is increased by " + parseFloat(percent).toFixed(2) + "%";
    return {sprintBacklog, eventLog};
};

// E-05
// randomly make team size decrease by 20-40% of current team size
export const decreaseTeamSize = (scrumTeamSize) => {
    let percentDecrement = getRandomBetween(0.2, 0.4);
    const decrement = Math.floor(percentDecrement * scrumTeamSize);
    if (scrumTeamSize > decrement && decrement > 0) {
        let currentTeamSize = scrumTeamSize - decrement;
        const eventLog = decrement + " team member cannot work in this sprint";
        return {currentTeamSize, eventLog};
    }
};