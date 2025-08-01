import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Games from './pages/Games';

// Components
import Navigation from './components/Navigation';

// Define the backend port and URL for API requests
const backendPort = 9669;  // Use the port you assigned to the backend server, this would normally go in a .env file
const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}`;

function App() {

    return (
        <>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Games" element={<Games backendURL={backendURL} />} />
            </Routes>
        </>
    );

} export default App;