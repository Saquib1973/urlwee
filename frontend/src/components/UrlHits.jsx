import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UrlHits = ({ shortUrl }) => {
    const [hits, setHits] = useState([]);

    useEffect(() => {
        const fetchHits = async () => {
            try {
                const response = await axios.get(`/api/urls/${shortUrl}/hits`);
                setHits(response.data);
            } catch (error) {
                console.error('Error fetching URL hits', error);
            }
        };

        fetchHits();
    }, [shortUrl]);

    return (
        <div>
            <h2>URL Hits</h2>
            <ul>
                {hits.map((hit, index) => (
                    <li key={index}>
                        {new Date(hit.timestamp).toLocaleString()} - {hit.location.country}, {hit.location.region}, {hit.location.city}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UrlHits;
