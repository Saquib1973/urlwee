import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { customNotification } from '@/lib/customNotification';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const backend = import.meta.env.VITE_BACKEND_URL
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : localStorage.getItem('token') === undefined ? null : null);
    useEffect(() => {
        setUser(localStorage.getItem('token'));
        console.log('token updated')
    }, [user])


    const login = async (username, password) => {
        try {

            const response = await axios.post(`${backend}/api/users/login`, { username, password });
            setUser(response.data.token);
            if (response.data.token) customNotification('Login Success 🎉');
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard')
        } catch (error) {
            console.log(error)
            customNotification('Error', 'Some error occured please try again later')

        }
    };

    const signup = async (username, password) => {
        try {
            const response = await axios.post(`${backend}/api/users/register`, { username, password });
            console.log("response", response)
            if (response.data.message) customNotification('Registerd Successfully 🎉');
            navigate('/login')

        } catch (error) {
            console.log(error)
            customNotification('Error', 'Some error occured please try again later')
        }
    };

    const logout = () => {
        setUser(null);
        customNotification('Logged Out 👋');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
