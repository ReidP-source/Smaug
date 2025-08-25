const express = require('express');

module.exports = function(db) {
  const router = express.Router();

  // ########################################
  // ########## READ ROUTES

  // Ratings
  router.get('/ratings', async (req, res) => {
    try {
      const query = `SELECT ratingID, name FROM Ratings;`;
      const [ratings] = await db.query(query);
      res.status(200).json({ ratings });
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).send("An error occurred while fetching ratings.");
    }
  });

  // Publishers
  router.get('/publishers', async (req, res) => {
    try {
      const query = `SELECT publisherID, name FROM Publishers;`;
      const [publishers] = await db.query(query);
      res.status(200).json({ publishers });
    } catch (error) {
      console.error("Error fetching publishers:", error);
      res.status(500).send("An error occurred while fetching publishers.");
    }
  });

  // Games
  router.get('/games', async (req, res) => {
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

  // Cart Queries
  router.get('/customers/:customerID/cart', async (req, res) => {
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

  // Customers
  router.get('/customers', async (req, res) => {
    try {
      const query1 = 'SELECT Customers.customerID, Customers.name, Customers.email FROM Customers;';
      const [customers] = await db.query(query1);
      res.status(200).json({ customers });
    } catch (error){
      console.error("Error executing customer queries:", error);
      res.status(500).send("An error occurred while executing the customer database queries.");
    }
  });

  // Customer Library
  router.get('/customers/:customerID/library', async (req, res) => {
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
      
      res.status(200).json({ customerName, libraryItems });
      
    } catch (error) {
      console.error("Error executing library query:", error);
      res.status(500).json({ error: "An error occurred while retrieving the library data." });
    }
  });

  // Genres
  router.get('/genres', async (req, res) => {
    try {
      const query1 = 'SELECT name FROM Genres';
      const [genres] = await db.query(query1);
      
      const transformedGenres = genres.map(genre => ({
        genreID: genre.name,
        name: genre.name
      }));
      
      res.status(200).json({ genres: transformedGenres });
    } catch (error) {
      console.error("Error executing genre queries:", error);
      res.status(500).send("An error occurred while executing the genre database queries.");
    }
  });

  // Purchases
  router.get('/purchases', async (req, res) => {
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
      console.error("Error executing purchase queries:", error);
      res.status(500).send("An error occurred while executing the purchase database queries.");
    }
  });

  // Platforms
  router.get('/platforms', async (req, res) => {
    try {
      const query1 = `SELECT Platforms.name, Platforms.platformID
                      FROM Platforms`;
      
      const [platforms] = await db.query(query1);
      res.status(200).json({ platforms });
    } catch (error){
      console.error("Error executing platform queries:", error);
      res.status(500).send("An error occurred while executing the platform database queries.");
    }
  });

  // Root endpoint
  router.get('/', (req, res) => {
    res.json({ 
      message: 'Game Store API Server is running!',  
      endpoints: [
        '/games',
        '/customers',
        '/ratings',
        '/publishers',
        '/genres',
        '/platforms',
        '/purchases'
      ],
      port: process.env.PORT || 9670
    });
  });

  return router;
};