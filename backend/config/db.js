import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE, {
            autoIndex: true,
        });
        console.log("Db connection established");
    } catch (error) {
        console.log(error.message);
    }
};