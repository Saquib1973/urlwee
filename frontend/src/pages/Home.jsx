import {
    Dialog, DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { customToast } from "../lib/toast";
import QRCode from "react-qr-code";


const ITEMS_PER_PAGE = 8;
const backend = "https://short-url-backend-5dmi.onrender.com/"
// const backend = "http://localhost:4444/"

const Home = () => {
    const [urlInput, setUrlInput] = useState("");
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backend}getAllUrls`);
            setUrls(response.data);
        } catch (error) {
            console.error('Error fetching URLs:', error);
        }
        setLoading(false);
    };

    const createShortenedUrl = async () => {
        setLoading(true);
        if (!urlInput) {
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post(`${backend}shortUrl`, { full: urlInput });
            console.log(response)
            setShortenedUrl(response.data);
            customToast(`Url Shortened`)
            setUrlInput("");
            fetchUrls();
        } catch (error) {
            console.error('Error creating shortened URL:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (urlId) => {
        let shortUrl = urlId;
        setLoading(true);
        try {
            await axios.delete(shortUrl);
            customToast(`Url '${shortUrl}' Deleted`)
            fetchUrls();
        } catch (error) {
            console.error('Error deleting URL:', error);
            customToast(`Some error occured .Please try again later.`)
        }
        setLoading(false);
    };

    const handleCopy = (shortUrl) => {
        navigator.clipboard.writeText(shortUrl);
        customToast(`Copied URL: ${shortUrl}`)
    };

    const totalPages = Math.ceil(urls.length / ITEMS_PER_PAGE);
    const paginatedUrls = urls.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    return (
        <>
            {/* <Navbar /> */}
            <div className="flex gap-4 max-md:px-4 w-full items-center justify-center my-10 ">
                <Input type="text" placeholder="Enter a URL" className="w-full py-6 text-lg" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
                <Button onClick={createShortenedUrl} disabled={loading}>{loading ? 'Wait...' : 'Create'}</Button>
            </div>
            {shortenedUrl?.newUrl?.shortUrl &&
                <div className="flex items-center justify-between border bg-white dark:bg-gray-900 gap-4 p-4 rounded-md shadow-md px-6 active:scale-95 transition-all duration-500 w-[95%] md:w-[60%] select-none cursor-pointer relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-6 w-6 absolute -top-2 -right-2" onClick={() => setShortenedUrl("")}>
                        <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                    <p className="max-md:hidden">{shortenedUrl?.newUrl?.full}</p>
                    <div className="flex gap-4 items-center">

                        <Link to={shortenedUrl?.newUrl?.shortUrl} target="_blank" className="text-sm flex text-blue-400">{shortenedUrl?.newUrl?.shortUrl}</Link>
                        <QR shortenedUrl={shortenedUrl} />

                        <Link to={'/dashboard'} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                        </svg>
                        </Link>
                        <button className="hover:bg-white hover:text-black p-1 px-2 transition-all rounded-lg" onClick={() => handleCopy(shortenedUrl?.newUrl?.shortUrl)} >Copy</button>
                    </div>

                </div>
            }

            {loading ? (
                <div className="flex items-center flex-col gap-4 w-1/3">

                    Loading...
                </div>
            ) : (
                <>
                    <Table className="max-md:text-xs mx-auto w-full">
                        <TableCaption>Recently created URLs.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className=" p-1">No.</TableHead>
                                <TableHead className="p-1">Original URL</TableHead>
                                <TableHead className="p-1">Short URL</TableHead>
                                <TableHead className="text-center p-1">Clicks</TableHead>
                                <TableHead className="text-center p-1">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedUrls.map((url, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium p-1">{index + 1}</TableCell>
                                    <TableCell className="text-ellipsis line-clamp-1 p-1 flex items-center mt-2 max-md:w-[200px]">
                                        {url.full}
                                    </TableCell>
                                    <TableCell className=" p-1">
                                        {url.shortUrl}
                                    </TableCell>
                                    <TableCell className="text-center p-1">{url.clicks}</TableCell>
                                    <TableCell className="text-center p-1">
                                        <Popover>
                                            <PopoverTrigger>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                                </svg>
                                            </PopoverTrigger>
                                            <PopoverContent className="flex flex-col gap-2 max-md:w-[100px] max-md:p-2 p-2 px-3 w-[150px] text-base">
                                                <h1 className="text-gray-500 text-base max-md:text-xs max-md:font-extralight">Edit Options</h1>
                                                <Button onClick={() => handleDelete(url.shortUrl)} className="bg-red-500 dark:text-white hover:bg-red-400 max-md:text-xs max-md:font-extralight">Delete</Button>
                                                <Button className="max-md:text-xs max-md:font-extralight" onClick={() => handleCopy(url.shortUrl)}>Copy</Button>
                                            </PopoverContent>
                                        </Popover>

                                        {/* ONLY COPY */}

                                        {/* <button className="bg-white text-black p-2 text-xs py-1 rounded-lg active:scale-95 max-md:font-extralight" onClick={() => handleCopy(url.shortUrl)}>Copy</button> */}

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4 items-center gap-4">
                            <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="md:w-6 md:h-6 h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                            </Button>
                            <p>{totalPages}</p>
                            <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="md:w-6 md:h-6 h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                            </Button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default Home;


const QR = ({ shortenedUrl }) => {
    return (
        <>
            <Dialog>
                <DialogTrigger>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-6 w-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                    </svg>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="mb-2 underline underline-offset-4">Qr for generated Url</DialogTitle>
                        <DialogDescription>

                            <QRCode
                                className="mx-auto bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shadow-md"
                                value={shortenedUrl}
                                bgColor="#FFFFFF"
                                fgcolor="#000000"
                                size={256}
                            />
                            <p className="text-center mt-2">Scan qr code</p>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </>
    )
}
