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
        const query1 = 
        'SELECT Games.name, Ratings.name AS "ESRB Rating", \
        DATE_FORMAT(Games.releaseDate, \'%m/%d/%y\') AS releaseDate, \
        Publishers.name AS "Publisher" \
        FROM Games INNER JOIN Ratings on Ratings.ratingID = Games.ratingID \
        INNER JOIN Publishers on Publishers.publisherID = Games.publisherID;';
        
        const query2 = 'SELECT * FROM Platforms;';
        
        const [games] = await db.query(query1);
        const [platforms] = await db.query(query2);
    
        res.status(200).json({ games, platforms });

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

// Customers Queries
app.get('/customers', async (req, res) => {
    try {
        const query1 = 'SELECT Customers.customerID, Customers.name, Customers.email FROM Customers;';
        
        
        const [customers] = await db.query(query1);

        res.status(200).json({ customers });
    } catch (error){
        console.error("Error executing customer queries:", error);
        res.status(500).send("An error occurred while executing the customer database queries.");
    }
});

// Genre Queries
app.get('/genres', async (req, res) => {
    try {
        const query1 = 'SELECT Genres.name FROM Genres';
        
        
        const [genres] = await db.query(query1);

        res.status(200).json({ genres });
    } catch (error){
        console.error("Error executing genre queries:", error);
        res.status(500).send("An error occurred while executing the genre database queries.");
    }
});

// Purchase Queries
app.get('/purchases', async (req, res) => {
    try {
        const query1 = `SELECT Purchases.purchaseID,  
                               Platforms.name AS platform, 
                               Games.name AS game, 
                               PurchaseItems.totalPaid, 
                               Purchases.purchaseDate
                        FROM PurchaseItems
                        JOIN Purchases ON PurchaseItems.purchaseID = Purchases.purchaseID
                        JOIN Games ON PurchaseItems.gameID = Games.gameID
                        JOIN Platforms ON PurchaseItems.platformID = Platforms.platformID;`;
        
        
        const [purchases] = await db.query(query1);

        res.status(200).json({ purchases });
    } catch (error){
        console.error("Error executing genre queries:", error);
        res.status(500).send("An error occurred while executing the genre database queries.");
    }
});

//Platforms
app.get('/platforms', async (req, res) => {
    try {
        const query1 = `SELECT Platforms.name
                        FROM Platforms`;
        
        
        const [platforms] = await db.query(query1);

        res.status(200).json({ platforms });
    } catch (error){
        console.error("Error executing genre queries:", error);
        res.status(500).send("An error occurred while executing the genre database queries.");
    }
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'Game Store API Server is running!',  
        endpoints: ['/games', '/customers'],                         
        port: PORT 
    });
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});