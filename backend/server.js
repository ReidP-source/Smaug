// ########################################
// ########## SETUP

// Database
const db = require('./database/db-connector');

// Express
const express = require('express');
const app = express();

// Middleware
const cors = require('cors');
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests


const PORT = 9669;

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/games', async (req, res) => {
    try {
        const query1 = 'SELECT Games.name, Ratings.name AS "ESRB Rating", Games.releaseDate, Publishers.name AS "Publisher" \
            FROM Games INNER JOIN Ratings on Ratings.ratingID = Games.ratingID \
            INNER JOIN Publishers on Publishers.publisherID = Games.publisherID;'
        const query2 = 'SELECT * FROM Platforms;';
        
        const [games] = await db.query(query1);
        const [platforms] = await db.query(query2);
    
        res.status(200).json({ games, platforms });

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'Game Store API Server is running!',  
        endpoints: ['/games'],                         
        port: PORT 
    });
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});