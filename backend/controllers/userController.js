import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Registered successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurred");
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    console.log("started")
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ token });
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurred");
    }
};
