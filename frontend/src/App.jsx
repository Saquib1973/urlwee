import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Navbar from "./helpComp/Navbar";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Progress } from "./components/ui/progress";

const ITEMS_PER_PAGE = 5;

const App = () => {
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
            const response = await axios.get('http://localhost:3000/getAllUrls');
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
            const response = await axios.post('http://localhost:3000/shortUrl', { full: urlInput });
            setShortenedUrl(response.data.newUrl.shortUrl);
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
            fetchUrls();
        } catch (error) {
            console.error('Error deleting URL:', error);
        }
        setLoading(false);
    };

    const handleCopy = (shortUrl) => {
        navigator.clipboard.writeText(shortUrl);
    };

    const totalPages = Math.ceil(urls.length / ITEMS_PER_PAGE);
    const paginatedUrls = urls.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    return (
        <div className="min-h-screen flex flex-col gap-4 justify-start items-center">
            <Navbar />
            <div className="flex gap-4 max-md:px-4 w-full items-center justify-center my-10">
                <Input type="text" placeholder="Enter a URL" className="md:w-3/5" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
                <Button onClick={createShortenedUrl} disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
            </div>
            {shortenedUrl &&
                <div className="flex items-center flex-col gap-4 p-4 rounded-md shadow-md bg-gradient-to-t px-6 text-white active:scale-90 transition-all duration-500 select-none cursor-pointer from-lime-400 to-green-400">
                    <Link to={shortenedUrl} target="_blank" className="text-sm flex">Open Shortened URL <p className="text-blue-400 ml-2" >{shortenedUrl}</p></Link>
                </div>
            }

            {loading ? (
                <div className="flex items-center flex-col gap-4 w-1/3">
                    <Progress value={100} />
                    Loading...
                </div>
            ) : (
                <>
                    <Table className="max-md:text-xs mx-auto w-2/3">
                        <TableCaption>Recently created URLs.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="md:w-[100px] p-1">No.</TableHead>
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
                                    <TableCell className="max-md:w-[200px] p-1">
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
                                                <Button onClick={() => handleDelete(url.shortUrl)} className="bg-red-500 hover:bg-red-400 max-md:text-xs max-md:font-extralight">Delete</Button>
                                                <Button className="max-md:text-xs max-md:font-extralight" onClick={() => handleCopy(url.shortUrl)}>Copy</Button>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4 items-center gap-4">
                            <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                            </Button>
                            <p>{totalPages}</p>
                            <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default App;
