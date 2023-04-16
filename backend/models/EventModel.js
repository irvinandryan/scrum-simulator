import mongoose from "mongoose";

var EventSchema = mongoose.Schema({
    eventId: String,
    eventRelatedVar: String,
});

export default mongoose.model('EventModel', EventSchema);