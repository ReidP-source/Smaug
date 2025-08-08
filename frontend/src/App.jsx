import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Games from './pages/Games';
import DBCustomers from './pages/Customers'
import DBGenres from './pages/Genres'
import DBPurchases from './pages/Purchases'
import DBPlatforms from './pages/Platforms'

// Components
import Navigation from './components/Navigation';

// Define the backend port and URL for API requests
const backendPort = 9624;  // Use the port you assigned to the backend server, this would normally go in a .env file
const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}`;

function App() {

    return (
        <>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home backendURL={backendURL}/>} />
                <Route path="/Games" element={<Games backendURL={backendURL} />} />
                <Route path="/Customers" element={<DBCustomers backendURL={backendURL} />} />
                <Route path="/Purchases" element={<DBPurchases backendURL={backendURL} />} />
                <Route path="/Platforms" element={<DBPlatforms backendURL={backendURL} />} />
                <Route path="/Genres" element={<DBGenres backendURL={backendURL} />} />
            </Routes>
        </>
    );

} export default App;