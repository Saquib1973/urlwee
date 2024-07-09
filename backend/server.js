import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import urlRoutes from './routes/urlRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/urls', urlRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    // console.log()
    res.send(`{Home Route Url Shortner API ${req.ip}}`);
});

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
