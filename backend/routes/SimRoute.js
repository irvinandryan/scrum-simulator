import express from "express";
import {
    getSimConfigs,
    getSimConfigById,
    saveSimConfig,
    updateSimConfig,
    deleteSimConfig
} from "../controllers/SimController.js"; // import the controller functions

const router = express.Router();

router.get('/simConfigs', getSimConfigs); // GET all simConfigs
router.get('/simConfigs/:id', getSimConfigById); // GET a simConfig by id
router.post('/simConfigs', saveSimConfig); // POST a simConfig
router.patch('/simConfigs/:id', updateSimConfig); // PATCH a simConfig by id
router.delete('/simConfigs/:id', deleteSimConfig); // DELETE a simConfig by id

export default router;