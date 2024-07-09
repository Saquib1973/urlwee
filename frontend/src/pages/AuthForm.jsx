import React, { useState } from 'react';
import { useAuth } from '../common/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { customToast } from '@/lib/toast';
import Loader from '@/components/Loader';
import { customNotification } from '@/lib/customNotification';
const AuthForm = ({ type }) => {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // customNotification('Login Request', 'Request Pending', 'Wait...')
        customNotification('Login', <div>
            <Loader />
        </div>)
        if (type === 'login') {
            await login(username, password);
        } else {
            await signup(username, password);
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


