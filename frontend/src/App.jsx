import './App.css';
import { useState, useEffect } from 'react';  // Importing useState for managing state in the component

// Define the backend port and URL for API requests
const backendPort = 6996;  // Use the port you assigned to the backend server, this would normally go in .env file
const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}/`;

function App() {

    // Set up a state variable `message` to store and display the backend response
    const [message, setMessage] = useState([]);

    // Get the data from the database
    const getData = async function () {
        if (message.length > 0) return; // Skip if data is already fetched
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL);
            
            // Convert the response into JSON format
            const rows = await response.json();
            
            // Update the message state with the response data
            setMessage(JSON.stringify(rows));
            
        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(error);
        }
    };

    // Load table on page load
    useEffect(() => {
        getData();
    }, []);

  return (
    <>
          <h1>MySQL Results:</h1>
          <p>{message}</p>
    </>
  );

} export default App;