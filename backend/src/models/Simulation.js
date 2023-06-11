import mongoose from "mongoose";

var ProductBacklogSchema = mongoose.Schema({
    pbId: String,
    pbPoint: Number,
    isPbDone: Boolean,
});

var SprintBacklogItemSchema = mongoose.Schema({
    sbId: String,
    sbPlannedHour: Number,
    sbActualHour: Number,
    relatedPbId: String,
    isSbDone: Boolean,
});

var ReleaseBacklogSchema = mongoose.Schema({
    rbId: String,
    isRbDone: Boolean,    
});

var SprintBacklogSchema = mongoose.Schema({
    sprintId: Number,
    releaseBacklog: [ReleaseBacklogSchema],
    sprintBacklogItem: [SprintBacklogItemSchema],
    sprintCost: Number,
    currentTeamSize: Number,
    sprintTimeSpent: Number,
    isSprintDone: Boolean,
    eventLog: [String],
    responseLog: [String],
});

var SimConfigSchema = mongoose.Schema({
    creator: String,
    scrumTeamSize: Number,
    scrumTeamRate: Number,
    scrumTeamHour: Number,
    plannedCost: Number,
    sprintLength: Number,
    plannedSprint: Number,
    startDate: Date,
    productBacklog : [ProductBacklogSchema],
    sprintBacklog: [SprintBacklogSchema],
    eventProbability: Number,
});

export default mongoose.model('SimConfigModel', SimConfigSchema);