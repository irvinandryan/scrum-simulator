import SimConfigModel from "../models/Simulation.js";
import jwt from "jsonwebtoken";

export const getSimConfigs = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                res.status(401).json({message: err.message});
            } else {
                const simConfigs = await SimConfigModel.find({creator: decoded.username});
                res.json(simConfigs);
            }
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getSimConfigById = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                res.status(401).json({message: err.message});
            } else {
                const simConfig = await SimConfigModel.findById(req.params.id);
                res.json(simConfig);
            }
        });
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const saveSimConfig = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                res.status(401).json({message: err.message});
            } else {
                const simConfig = new SimConfigModel(req.body);
                const insertedSimConfig = await simConfig.save();
                res.status(201).json(insertedSimConfig);
            }
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const updateSimConfig = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                res.status(401).json({message: err.message});
            } else {
                const updatedSimConfig = await SimConfigModel.updateOne({_id:req.params.id}, {$set: req.body});
                res.status(200).json(updatedSimConfig);
            }
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const deleteSimConfig = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                res.status(401).json({message: err.message});
            } else {
                const deletedSimConfig = await SimConfigModel.deleteOne({_id:req.params.id});
                res.status(200).json(deletedSimConfig);
            }
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}