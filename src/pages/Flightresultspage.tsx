import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FlightResults from './FlightResults';

const FlightResultsPage = () => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useState({
        from: '',
        to: '',
        date: '',
        passengers: ''
    });

    useEffect(() => {
        // Get search params from location state or URL params
        const params = location.state || {
            from: 'Dubai',
            to: 'Mumbai, India',
            date: '2024-12-25',
            passengers: '2 Adults'
        };

        setSearchParams(params);
    }, [location]);

    return (
        <div>
            <FlightResults searchParams={searchParams} />
        </div>
    );
};

export default FlightResultsPage;