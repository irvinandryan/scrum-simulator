import express from "express";
import {
    getSimConfigs,
    getSimConfigById,
    saveSimConfig,
    updateSimConfig,
    deleteSimConfig,
} from "../controllers/SimController.js"; // import the controller functions

import {
    register,
    login,
} from "../controllers/UserController.js"; // import the controller functions

const router = express.Router();

router.get('/simconfigs/', getSimConfigs); // GET all simConfigs by username
router.get('/simconfigs/:id', getSimConfigById); // GET a simConfig by id
router.post('/simconfigs', saveSimConfig); // POST a simConfig
router.patch('/simconfigs/:id', updateSimConfig); // PATCH a simConfig by id
router.delete('/simconfigs/:id', deleteSimConfig); // DELETE a simConfig by id
router.post('/register', register); // POST a user
router.post('/login', login); // POST a user

export default router;