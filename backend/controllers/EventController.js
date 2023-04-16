import EventModel from "../models/EventModel.js";

export const getEvents = async (req, res) => {
    try {
        const events = await EventModel.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getEventById = async (req, res) => {
    try {
        const event = await EventModel.findById(req.params.id);
        res.json(event);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const saveEvent = async (req, res) => {
    const event = new EventModel(req.body);
    try {
        const insertedEvent = await event.save();
        res.status(201).json(insertedEvent);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const updateEvent = async (req, res) => {
    try {
        const updatedEvent = await EventModel.updateOne({_id:req.params.id}, {$set: req.body});
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await EventModel.deleteOne({_id:req.params.id});
        res.status(200).json(deletedEvent);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}