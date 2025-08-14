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


const PORT = 9661;

/* HELPER FUNCTIONS */

const normalizeDate = (v) => {
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const m = String(v).match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (m) {
    let [, mm, dd, yy] = m;
    if (yy.length === 2) {
      const n = Number(yy);
      yy = String(n >= 70 ? 1900 + n : 2000 + n);
    }
    return `${yy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`;
  }
  const d = new Date(v);
  if (!Number.isNaN(d.getTime())) {
    const y = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${y}-${mm}-${dd}`;
  }
  return v;
};

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
        
        const [games] = await db.query(query1)
        const [platforms] = await db.query(query2);
    
        res.status(200).json({ games, platforms });

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

//Carts Queries
app.get('/customers/:customerID/cart', async (req, res) => {
    try {
        const { customerID } = req.params;
        
        // Get customer name
        const customerQuery = `SELECT Customers.name 
                              FROM Customers 
                              WHERE Customers.customerID = ?`;
        
        // Get cart items with game details for the customer
        const cartQuery = `SELECT CartItems.gameID,
                                  Platforms.platformID,
                                  Games.name as "Game Name",
                                  Games.releaseDate as "Release Date",
                                  Platforms.name as "Platform Name"
                          FROM Carts 
                          JOIN CartItems ON Carts.cartID = CartItems.cartID
                          JOIN Games ON CartItems.gameID = Games.gameID
                          JOIN Platforms ON CartItems.platformID = Platforms.platformID
                          WHERE Carts.customerID = ?`;
        
        const [customerResult] = await db.query(customerQuery, [customerID]);
        const [cartItems] = await db.query(cartQuery, [customerID]);
        
        const customerName = customerResult.length > 0 ? customerResult[0].name : 'Unknown Customer';
        
        res.status(200).json({ 
            cartItems, 
            customerName 
        });
    } catch (error) {
        console.error("Error executing cart queries:", error);
        res.status(500).send("An error occurred while executing the cart database queries.");
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

app.get('/customers/:customerID/library', async (req, res) => {
    try {
        const { customerID } = req.params;
        
        // Single query to get customer name and library items
        const query = `
            SELECT 
                Customers.name AS customerName,
                LibraryItems.libraryID,
                Games.gameID,
                Games.name AS gameName,
                Games.releaseDate,
                Publishers.name AS publisher,
                Ratings.name AS rating
            FROM Customers
            JOIN Libraries ON Customers.customerID = Libraries.customerID
            LEFT JOIN LibraryItems ON Libraries.libraryID = LibraryItems.libraryID
            LEFT JOIN Games ON LibraryItems.gameID = Games.gameID
            LEFT JOIN Publishers ON Games.publisherID = Publishers.publisherID
            LEFT JOIN Ratings ON Games.ratingID = Ratings.ratingID
            WHERE Customers.customerID = ?
            ORDER BY Games.name;
        `;
        
        const [results] = await db.query(query, [customerID]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        
        const customerName = results[0].customerName;
        const libraryItems = results[0].gameID ? results : []; // If no games, return empty array
        
        res.status(200).json({ customerName,libraryItems });
        
    } catch (error) {
        console.error("Error executing library query:", error);
        res.status(500).json({ error: "An error occurred while retrieving the library data." });
    }
});

// Genre Queries
app.get('/genres', async (req, res) => {
    try {
        const query1 = 'SELECT Genres.name, Genres.genreID FROM Genres';
        
        
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
        const query1 = `SELECT Platforms.name, Platforms.platformID
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



/* CREATE Calls */

app.post('/games/create', async (req, res) => {
  try {
    const {
      name,
      releaseDate,
      ratingID = null,
      ratingName = null,
      publisherID = null,
      publisherName = null
    } = req.body || {};

    if (!name || !releaseDate) {
      return res.status(400).json({ success:false, message:'name and releaseDate are required' });
    }

    const [rows] = await db.query('CALL sp_create_game(?, ?, ?, ?, ?, ?)', [
      name,
      releaseDate,        // 'YYYY-MM-DD'
      ratingID,           // or null
      ratingName,         // or null
      publisherID,        // or null
      publisherName       // or null
    ]);

    // MySQL returns nested result sets from CALL; last SELECT is first element of rows
    const newId = rows?.[0]?.[0]?.gameID ?? null;
    return res.json({ success:true, gameID:newId });
  } catch (e) {
    console.error('Create game failed:', e);
    return res.status(500).json({ success:false, error: e.sqlMessage || e.message || 'Failed' });
  }
});


/* DELETE Calls */ 

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

app.delete('/customers/:id', async (req, res) => {
  try {
    const c_id = Number(req.params.id);
    const [[row]] = await db.query('SELECT customerID FROM Customers WHERE customerID=?',[c_id]);
    if (!row) return res.status(404).json({success:false,message: `Customer ${c_id} not found`});
    await db.query('CALL sp_delete_customer(?)', [c_id])
    res.json({success:true,message:'Customer and related data removed'});
  }catch(e){
    console.error('Delete Customer Error:', e);
    res.status(500).json({success:false,error:e.sqlMessage||'Failed'});
  }
});

/* UPDATE Calls */

app.put('/games/update/:id', async (req, res) => {
  try {
    const gameID = Number(req.params.id);
    if (Number.isNaN(gameID)) return res.status(400).json({ success:false, message:'Invalid game id' });

    // Accept both table  names and friendly aliases
    const body = req.body || {};
    const name = body.name ?? null;
    const releaseDate = normalizeDate(body.releaseDate ?? null);

    // rating may come as ratingID or esrbRating/ratingName
    const ratingID = body.ratingID ?? null;
    const ratingName = body.ratingName ?? body.esrbRating ?? null;

    // publisher may come as publisherID or publisher/publisherName
    const publisherID = body.publisherID ?? null;
    const publisherName = body.publisherName ?? body.publisher ?? null;

    // Ensure row exists
    const [[row]] = await db.query('SELECT gameID FROM Games WHERE gameID=?', [gameID]);
    if (!row) return res.status(404).json({ success:false, message:'Game not found' });

    // Call the SP (any NULLs mean "keep current value")
    await db.query('CALL sp_update_game(?, ?, ?, ?, ?, ?, ?)', [
      gameID, name, releaseDate, ratingID, ratingName, publisherID, publisherName
    ]);

    res.json({ success:true });
  } catch (e) {
    console.error('Update game failed:', e);
    res.status(500).json({ success:false, error: e.sqlMessage || e.message || 'Failed' });
  }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});