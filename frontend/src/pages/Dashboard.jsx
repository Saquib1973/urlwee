import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../common/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { customToast } from '@/lib/toast';
import { handleCopy } from "./Home"
import Loader from '@/components/Loader';
import { customNotification } from '@/lib/customNotification';
import { Link } from 'react-router-dom';
import UrlHits from '@/components/UrlHits';
import WorldMap from '@/components/WorldMap';


const backend = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchUrls();
        }
    }, [user]);

    const fetchUrls = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${backend}/api/urls/getUserUrls`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUrls(response.data);
        } catch (error) {
            console.error('Error fetching URLs:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (shortUrl) => {
        setLoading(true);
        customNotification("Deleting",

            <div className='flex gap-1'>
                <Loader sz={"sm"} />
                Deleting ${shortUrl}
            </div>
        )
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${backend}/api/urls/delete`, { shortUrl }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            customNotification("Deleted",

                <div className='text-red-500 flex gap-1'>
                    {shortUrl} deleted
                </div>
            )
            setUrls(urls.filter(url => url.shortUrl !== shortUrl));
        } catch (error) {
            customNotification("Error",

                'Some error occurred while deleting URL. Please try again later.'
            )
            console.error('Error deleting URL:', error);
        }
        setLoading(false);
    };



    return (
        <div>
            <div className='flex justify-between items-center mb-10'>

                <h1>Dashboard</h1>
                <Button onClick={logout} className="!bg-red-500 !py-2 text-white">Logout</Button>
            </div>
            <div>
                {loading ? (
                    <div className='w-full flex items-center justify-center'><Loader sz={"lg"} /></div>
                ) : (
                    <Table className="max-md:text-xs mx-auto w-full">
                        <TableCaption>All URLs created by you.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="p-1">No.</TableHead>
                                <TableHead className="p-1">Original URL</TableHead>
                                <TableHead className="p-1">Short URL</TableHead>
                                {/* <TableHead className="text-center p-1">Clicks</TableHead> */}
                                <TableHead className="text-center p-1">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {urls.map((url, index) => (
                                <TableRow key={url._id}>
                                    <TableCell className="font-medium p-1">{index + 1}</TableCell>
                                    <TableCell className="text-ellipsis line-clamp-1 p-1 flex items-center mt-2 max-md:w-[200px]">{url.full}</TableCell>
                                    <TableCell className="p-1">{url.shortUrl}</TableCell>
                                    <TableCell className="text-center p-1">
                                        {/* <Popover> */}
                                        {/* <PopoverTrigger> */}
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer"> */}
                                        {/* <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /> */}
                                        {/* </svg> */}
                                        {/* </PopoverTrigger> */}
                                        {/* <PopoverContent className="flex flex-col gap-2 max-md:w-[100px] max-md:p-2 p-2 px-3 w-[150px] text-base"> */}
                                        <Dialog>
                                            <DialogTrigger>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                                </svg>
                                            </DialogTrigger>
                                            <DialogContent className="p-4 ">
                                                <DialogHeader>
                                                    {/* <DialogTitle className="mb-2 underline underline-offset-4">QR for {url.shortUrl}</DialogTitle> */}
                                                    <DialogDescription className="flex justify-around gap-2">
                                                        <div>

                                                            <QRCode
                                                                className="mx-auto bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shadow-md"
                                                                value={url.shortUrl}
                                                                bgColor="#FFFFFF"
                                                                fgcolor="#000000"
                                                                size={256}
                                                            />
                                                            <p className="text-center mt-2">Scan QR code</p>
                                                        </div>
                                                        <div className='flex flex-col justify-start items-start'>

                                                            <h1 className="text-gray-500 text-base max-md:text-xs max-md:font-extralight underline underline-offset-4 mb-4">Details</h1>
                                                            <p className="text-left">No. of clicks : {url.clicks}</p>

                                                            <Link to={url.shortUrl} className="mb-2 underline underline-offset-4 hover:text-blue-500 text-xs" target='_blank'>{url.shortUrl}</Link>
                                                            <div className='flex flex-wrap mt-2 gap-2 justify-start'>
                                                                <Button className="max-md:text-xs max-md:font-extralight" onClick={() => handleCopy(url.shortUrl)}>Copy</Button>
                                                                <Button onClick={() => handleDelete(url.shortUrl)} className="bg-red-500 dark:text-white hover:bg-red-400 max-md:text-xs max-md:font-extralight">Delete</Button>
                                                                <UrlHits shortUrl={url.shortUrl} />
                                                            </div>

                                                        </div>
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                        {/* </PopoverContent> */}
                                        {/* </Popover> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
            {/* <WorldMap /> */}
        </div>
    );
};

export default Dashboard;
