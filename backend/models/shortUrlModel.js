// shortUrlModel.js
import mongoose from "mongoose";
const shortUrlSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
export default mongoose.model('ShortUrl', shortUrlSchema);
