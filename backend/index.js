import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import SimRoute from "./routes/SimRoute.js";

const app = express();
mongoose.connect('mongodb://localhost:27017/scrum_db',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database Connected...'));

app.use(cors());
app.use(express.json());
app.use(SimRoute);

app.listen(5000, ()=> console.log('Server up and running...'));