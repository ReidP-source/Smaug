
// Imports sql connection from DBconnector
const db = require('./db-connector');
const MY_ONID = "pettibor"; 

// Express library used to create a web server that will listen and respond to API calls from the frontend
const express = require('express');

// Instantiate an express object to interact with the server
const app = express();

// Middleware to allow cross-origin requests
const cors = require('cors');

// Set a port in the range: 1024 < PORT < 65535
const PORT = 6996;

// If on FLIP or classwork, use cors() middleware to allow cross-origin requests from the frontend with your port number:
// EX (local): http://localhost:5173
// EX (FLIP/classwork) http://classwork.engr.oregonstate.edu:5173
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests, good thing to know
            
// Route handler 
app.get('/', async (req, res) => {
    try {
        // Define queries
        const query1 = 'DROP TABLE IF EXISTS diagnostic;';
        const query2 = 'CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);';
        const query3 = `INSERT INTO diagnostic (text) VALUES ("MySQL and React is working for ${MY_ONID}!")`;
        const query4 = 'SELECT * FROM diagnostic;';

        // Execute the queries
        await db.query(query1);
        await db.query(query2);
        await db.query(query3);

        // Get the results
        const [rows] = await db.query(query4);

        // Send back the results in JSON
        res.status(200).json(rows)

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

// Tell express what port to listen on 
app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});