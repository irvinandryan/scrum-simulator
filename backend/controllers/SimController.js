import SimConfigModel from "../models/SimModel.js";
import jwt_decode from "jwt-decode";

export const getSessionUsername = (token) => {
    const decoded = jwt_decode(token);
    return decoded.username;
}

export const getSimConfigs = async (req, res) => {
    try {
        const simConfigs = await SimConfigModel.find({creator: getSessionUsername(req.params.token)});
        res.json(simConfigs);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getSimConfigById = async (req, res) => {
    try {
        const simConfig = await SimConfigModel.findById(req.params.id);
        res.json(simConfig);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const saveSimConfig = async (req, res) => {
    const simConfig = new SimConfigModel(req.body);
    try {
        const insertedSimConfig = await simConfig.save();
        res.status(201).json(insertedSimConfig);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const updateSimConfig = async (req, res) => {
    try {
        const updatedSimConfig = await SimConfigModel.updateOne({_id:req.params.id}, {$set: req.body});
        res.status(200).json(updatedSimConfig);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const deleteSimConfig = async (req, res) => {
    try {
        const deletedSimConfig = await SimConfigModel.deleteOne({_id:req.params.id});
        res.status(200).json(deletedSimConfig);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}