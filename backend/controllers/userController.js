import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

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

// Login User
export const loginUser = async (req, res) => {
    const { username, password } = req.body;
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

// Update Username
export const updateUsername = async (req, res) => {
    try {
        const { userId } = req.user;  // Extracted from JWT token
        const { newUsername } = req.body;

        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = newUsername;
        await user.save();

        res.status(200).json({ message: 'Username updated successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurred");
    }
};

// Update Password
export const updatePassword = async (req, res) => {
    try {
        const { userId } = req.user;  // Extracted from JWT token
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurred");
    }
};


// Check Username Availability
export const checkUsernameAvailability = async (req, res) => {
    const { username } = req.query;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ available: false });
        }
        res.status(200).json({ available: true });
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occurred");
    }
};
