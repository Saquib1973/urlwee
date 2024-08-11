import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customToast } from '@/lib/toast';
import { backend } from './Dashboard';

const UpdateProfileForm = () => {
    const [newUsername, setNewUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState(true)
    const token = localStorage.getItem('token');

    const updateUsername = async () => {
        try {
            const response = await axios.put(`${backend}/api/users/update-username`, {
                newUsername
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            customToast(response.data.message, 'success');
        } catch (error) {
            customToast(error.response.data.message, 'error');
        }
    };

    const updatePassword = async () => {
        try {
            const response = await axios.put(`${backend}/api/users/update-password`, {
                oldPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            customToast(response.data.message, 'success');
        } catch (error) {
            customToast(error.response.data.message, 'error');
        }
    };



    const checkUsernameAvailability = async (username) => {
        try {
            const response = await axios.get(`${backend}/api/users/check-username?username=${username}`);
            setUsernameAvailable(response.data.available);
        } catch (error) {
            setUsernameAvailable(error.response.data.available);
            console.error('Error checking username availability:', error);
        }
    };
    console.log(usernameAvailable)
    useEffect(() => {
        const getData = setTimeout(() => {
            if (newUsername) {
                checkUsernameAvailability(newUsername);
            }
        }, 0)

        return () => clearTimeout(getData)
    }, [newUsername]);
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl">Update Username</h2>
            <Input
                type="text"
                placeholder="New Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
            />
            {
                !usernameAvailable && <p className="text-red-600 -mt-2 text-sm ml-auto">Username already taken</p>}
            <Button onClick={updateUsername}>Update Username</Button>

            <h2 className="text-2xl">Update Password</h2>
            <Input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
            />
            <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <Button onClick={updatePassword}>Update Password</Button>
        </div>
    );
};

export default UpdateProfileForm;
