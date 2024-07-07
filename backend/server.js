// server.js
import express from 'express';
import ShortUrl from './models/shortUrlModel.js';
import { v4 as uuidv4 } from 'uuid';
import { connectDB } from './config/db.js';
import cors from "cors";
import dotenv from "dotenv";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
dotenv.config();
connectDB();
app.get('/', async (req, res) => {
    res.send('Home Route Url Shortner API');
});
app.get('/getAllUrls', async (req, res) => {
    try {
        let allUrls = await ShortUrl.find();
        res.status(200).send(allUrls);
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurred");
    }
});

app.delete('/:shortUrl', async (req, res) => {
    const shortUrl = `${req.protocol}://${req.get('host')}/${req.params.shortUrl}`;
    try {
        await ShortUrl.findOneAndDelete({ shortUrl });
        console.log(`deleted ${shortUrl}`)
        res.status(204).send("Deleted");
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurred");
    }
});

const deleteAfterTime = async (shortUrl, deletionTime) => {
    setTimeout(async () => {
        try {
            await ShortUrl.findOneAndDelete({ shortUrl });
        } catch (error) {
            console.log(error);
        }
    }, deletionTime * 1000);
};

app.post('/shortUrl', async (req, res) => {
    const { full, deletionTime } = req.body;
    try {
        const uniqueId = uuidv4().substring(0, 5);
        const shortUrl = `${req.protocol}://${req.get('host')}/${uniqueId}`;
        const newUrl = new ShortUrl({
            full,
            shortUrl,
        });
        await newUrl.save();
        const timeInSec = (parseInt(deletionTime) >= 3600) ? parseInt(deletionTime) : 3600;
        deleteAfterTime(shortUrl, timeInSec);
        res.status(200).send({ newUrl });
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurred");
    }
});


app.get('/:shortUrl', async (req, res) => {
    const shortUrl = req.params.shortUrl;
    console.log(shortUrl)
    try {
        const url = await ShortUrl.findOne({ shortUrl: `${req.protocol}://${req.get('host')}/${shortUrl}` });
        if (!url) {
            return res.status(404).send('URL not found');
        }
        url.clicks += 1;
        await url.save();
        res.redirect(url.full);
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurred");
    }
});

app.listen(process.env.PORT || 4444, () => {
    console.log('Server is running on port 4444');
});