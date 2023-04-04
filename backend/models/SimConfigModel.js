import mongoose from "mongoose";

var SprintBacklogSchema = mongoose.Schema({
    sbId: String,
    sbHour: Number,
});

var ProductBacklogSchema = mongoose.Schema({
    pbId: String,
    pbPoint: Number,
    sprintBacklog: [SprintBacklogSchema]
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
});

export default mongoose.model('SimConfigModel', SimConfigSchema);