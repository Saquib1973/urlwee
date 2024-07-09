import ShortUrl from '../models/shortUrlModel.js';
import User from '../models/userModel.js';
import { v4 as uuidv4 } from 'uuid';
import geoip from 'geoip-lite';

export const getAllUrls = async (req, res) => {
    try {
        const allUrls = await ShortUrl.find();
        res.status(200).send(allUrls);
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurred");
    }
};

export const deleteUrl = async (req, res) => {
    const { shortUrl, userId } = req.body;
    try {
        const url = await ShortUrl.findOne({ shortUrl });
        if (!url) {
            return res.status(404).send('URL not found');
        }
        if (url.user.toString() !== userId._id.toString()) {
            return res.status(403).send('Unauthorized to delete this URL');
        }
        await ShortUrl.findOneAndDelete({ shortUrl });
        await User.findByIdAndUpdate(userId, { $pull: { urls: url._id } });
        res.status(204).send("Deleted");
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurred");
    }
};


const deleteAfterTime = async (shortUrl, deletionTime, userId) => {
    setTimeout(async () => {
        try {
            const url = await ShortUrl.findOneAndDelete({ shortUrl });
            if (url) {
                await User.findByIdAndUpdate(userId, { $pull: { urls: url._id } });
            }
        } catch (error) {
            console.log(error);
        }
    }, deletionTime * 1000);
};

export const createShortUrl = async (req, res) => {
    const { full, deletionTime, userId } = req.body;
    try {
        const uniqueId = uuidv4().substring(0, 5);
        const shortUrl = `${req.protocol}://${req.get('host')}/api/urls/${uniqueId}`;
        const newUrl = new ShortUrl({
            full,
            shortUrl,
            user: userId
        });
        await newUrl.save();
        await User.findByIdAndUpdate(userId, { $push: { urls: newUrl._id } });
        const timeInSec = (parseInt(deletionTime) >= 3600) ? parseInt(deletionTime) : 3600;
        deleteAfterTime(shortUrl, timeInSec, userId);
        res.status(200).send({ newUrl });
    } catch (error) {
        console.log('error in creating url', error);
        res.status(500).send("Some error occurred");
    }
};

export const redirectUrl = async (req, res) => {
    const shortUrl = `${req.protocol}://${req.get('host')}/api/urls/${req.params.shortUrl}`;
    try {
        const url = await ShortUrl.findOne({ shortUrl });
        if (!url) {
            return res.status(404).send('URL not found');
        }
        url.clicks += 1;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log("ip", ip)
        for (let i = 0; i < ip.length; i++) {
            const geo = geoip.lookup(ip[i]);
            console.log("geo", geo)
            const location = {
                country: geo ? geo.country : 'unknown',
                region: geo ? geo.region : 'unknown',
                city: geo ? geo.city : 'unknown'
            };
            if (location.country || location.region || location.city) {

                url.hits.push({ location });
                await url.save();

                console.log(`URL hit from ${location.country}, ${location.region}, ${location.city}`);
                res.redirect(url.full);
            }
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurred");
    }
};

export const getUrlHits = async (req, res) => {
    const { shortUrl } = req.params;
    try {
        const url = await ShortUrl.findOne({ shortUrl });
        if (!url) {
            return res.status(404).send('URL not found');
        }
        res.status(200).send(url.hits);
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurred");
    }
};

export const getUserUrls = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).populate('urls').exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.urls);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching URLs', error });
    }
}