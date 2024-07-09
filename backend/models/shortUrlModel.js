import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    hits: [
        {
            timestamp: {
                type: Date,
                default: Date.now
            },
            location: {
                country: String,
                region: String,
                city: String
            }
        }
    ]
});

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

export default ShortUrl;
