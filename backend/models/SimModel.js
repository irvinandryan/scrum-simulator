import mongoose from "mongoose";

var ProductBacklogSchema = mongoose.Schema({
    pbId: String,
    pbPoint: Number,
    isPbDone: Boolean,
});

var SprintBacklogItemSchema = mongoose.Schema({
    sbId: String,
    sbHour: Number,
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
    isSprintDone: Boolean,
});

var SimConfigSchema = mongoose.Schema({
    scrumTeamSize: Number,
    scrumTeamRate: Number,
    scrumTeamHour: Number,
    plannedCost: Number,
    sprintLength: Number,
    plannedSprint: Number,
    startDate: Date,
    productBacklog : [ProductBacklogSchema],
    sprintBacklog: [SprintBacklogSchema],
});

export default mongoose.model('SimConfigModel', SimConfigSchema);