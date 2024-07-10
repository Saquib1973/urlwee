import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WorldMap from './WorldMap';
import Flag from 'react-world-flags';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const UrlHits = ({ shortUrl }) => {
    const [hits, setHits] = useState([]);
    const [logDialogOpen, setLogDialogOpen] = useState(false);
    useEffect(() => {
        const fetchHits = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/urls/hits`, {
                    params: { shortUrl },
                });
                setHits(response.data);
            } catch (error) {
                console.error('Error fetching URL hits', error);
            }
        };

        fetchHits();
    }, [shortUrl]);

    const createCountriesData = (hits) => {
        const countryCounts = hits.reduce((acc, hit) => {
            const countryCode = hit.location.country;
            if (countryCode) {
                acc[countryCode] = (acc[countryCode] || 0) + 1;
            }
            return acc;
        }, {});

        return countryCounts;
    };

    const countriesData = createCountriesData(hits);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Check Out Map</Button>
                </DialogTrigger>
                <DialogContent className="h-auto w-screen">
                    <DialogHeader>
                        <DialogTitle>Maps/Logs</DialogTitle>
                        <DialogDescription className="w-full">
                            <h2 className="text-lg font-semibold mb-4">Countries link hits</h2>
                            <ul className='grid grid-cols-3 mx-auto'>
                                {Object.entries(countriesData).map(([countryCode, count]) => (
                                    <li key={countryCode} className="flex items-center mb-2">
                                        <Flag code={countryCode} className="mr-2 w-6 h-4" alt={`Flag of ${countryCode}`} />
                                        <span className="font-medium">{countryCode}</span> - {count} hits
                                    </li>
                                ))}
                            </ul>
                            <div className='w-full flex justify-end'>

                                <Button variant="outline" onClick={() => setLogDialogOpen(true)}>View Logs</Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <WorldMap countriesData={countriesData} />
                    <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
                        <DialogContent >
                            <DialogHeader>
                                <DialogTitle>URL Hit Logs</DialogTitle>
                            </DialogHeader>
                            <DialogDescription className="max-h-[50vh] overflow-y-auto">
                                <ul className="mb-6">
                                    {hits.map((hit, index) => (
                                        <li key={index} className="-mb-1 text-[0.65rem]">
                                            {new Date(hit.timestamp).toLocaleString()} - {hit.location.country}, {hit.location.region}, {hit.location.city}
                                        </li>
                                    ))}
                                </ul>
                            </DialogDescription>

                        </DialogContent>
                    </Dialog>

                </DialogContent>
            </Dialog>

        </>
    );
};

export default UrlHits;
