import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    urls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShortUrl',
    }],
});

export default mongoose.model('User', userSchema);
