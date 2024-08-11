import Loader from '@/components/Loader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customNotification } from '@/lib/customNotification';
import { customToast } from '@/lib/toast';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../common/AuthContext';
import { backend } from './Dashboard';

const AuthForm = ({ type }) => {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState(true);
    const { login, signup } = useAuth();

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
            if (username && type === 'signup') {
                checkUsernameAvailability(username);
            }
        }, 2000)

        return () => clearTimeout(getData)
    }, [username]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        customNotification('Login', <div><Loader /></div>);
        if (type === 'login') {
            await login(username, password);
        } else {
            if (usernameAvailable) {
                await signup(username, password);
            } else {
                customToast('Username already taken', 'error');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-md:px-4 mt-10 md:w-[500px] mx-auto">
            <h1 className='capitalize text-3xl '>{type}</h1>
            <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-xl p-4 dark:border-white/60 remove-ring "
            />
            {
                !usernameAvailable && <p className="text-red-600 -mt-4 text-sm ml-auto">Username already taken</p>}
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-xl p-4 dark:border-white/60 remove-ring "
            />
            <Button type="submit" className="button">{type === 'login' ? 'Login' : 'Signup'}</Button>
        </form>
    );
};

export default AuthForm;
