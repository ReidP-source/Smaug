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


const PORT = 9624;

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/games', async (req, res) => {
    try {
        const query1 = `
          SELECT G.gameID AS gameID,
                G.name   AS name,
                R.name   AS esrbRating,
                DATE_FORMAT(G.releaseDate, '%m/%d/%y') AS releaseDate,
                P.name   AS publisher
          FROM Games G
          JOIN Ratings R ON R.ratingID = G.ratingID
          JOIN Publishers P ON P.publisherID = G.publisherID;`;
        
        const query2 = 'SELECT * FROM Platforms;';
        
        const [games] = await db.query(query1);
        console.log('DEBUG /games first row keys:', games[0] && Object.keys(games[0]));
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


// RESET
app.post('/admin/reset-db', async (req, res) => {
  try {
    console.log('RESET: calling sp_reset_gamedb');
    await db.query('CALL sp_reset_gamedb()');
    res.json({ success: true, message: 'Database reset & seeded.' });
  } catch (err) {
    console.error('RESET ERROR:', err);
    res.status(500).json({ success: false, error: 'Reset failed' });
  }
});

app.delete('/games/:id', async (req, res) => {
  try {
    const gameID = Number(req.params.id);
    const [[row]] = await db.query('SELECT gameID FROM Games WHERE gameID=?',[gameID]);
    if (!row) return res.status(404).json({success:false,message:'Game not found'});
    await db.query('CALL sp_delete_game(?)',[gameID]);
    res.json({success:true,message:'Game and related purchase history removed'});
  } catch (e) {
    console.error('Delete game error:', e);
    res.status(500).json({success:false,error:e.sqlMessage||'Failed'});
  }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});