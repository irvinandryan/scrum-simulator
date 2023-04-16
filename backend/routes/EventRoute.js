import express from "express";
import {
    getEvents,
    getEventById,
    saveEvent,
    updateEvent,
    deleteEvent
} from "../controllers/EventController.js"; // import the controller functions

const router = express.Router();

router.get('/events', getEvents); // GET all events
router.get('/events/:id', getEventById); // GET an event by id
router.post('/events', saveEvent); // POST an event
router.patch('/events/:id', updateEvent); // PATCH an event by id
router.delete('/events/:id', deleteEvent); // DELETE an event by id

export default router;