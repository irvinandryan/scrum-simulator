import express from "express";
import {
    getSimConfigs,
    getSimConfigById,
    saveSimConfig,
    updateSimConfig,
    deleteSimConfig
} from "../controllers/SimController.js"; // import the controller functions

const router = express.Router();

router.get('/simConfigs/:token', getSimConfigs); // GET all simConfigs by username
router.get('/simConfigs/:token/:id', getSimConfigById); // GET a simConfig by id
router.post('/simConfigs/:token', saveSimConfig); // POST a simConfig
router.patch('/simConfigs/:token/:id', updateSimConfig); // PATCH a simConfig by id
router.delete('/simConfigs/:token/:id', deleteSimConfig); // DELETE a simConfig by id

export default router;