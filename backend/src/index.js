import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import SimulatorRouter from "./routes/SimulatorRouter.js";
import dotenv from "dotenv";
import config from "./config/Config.js";

dotenv.config();

const app = express();
mongoose.connect(config.mongo.uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database Connected...'));

app.use(cors());
app.use(express.json());
app.use(SimulatorRouter);

app.listen(config.port, ()=> console.log('Server up and running...'));