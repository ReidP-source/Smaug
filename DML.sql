-- ========================================
-- READ ROUTES 
-- ========================================

-- /ratings
SELECT ratingID, name FROM Ratings;

-- /publishers
SELECT publisherID, name FROM Publishers;

-- /games 
SELECT
  G.gameID AS gameID,
  G.name   AS name,
  R.name   AS esrbRating,
  DATE_FORMAT(G.releaseDate, '%m/%d/%y') AS releaseDate,
  P.name   AS publisher
FROM Games G
JOIN Ratings    R ON R.ratingID = G.ratingID
JOIN Publishers P ON P.publisherID = G.publisherID;

SELECT * FROM Platforms;

-- /customers
SELECT Customers.customerID, Customers.name, Customers.email
FROM Customers;

-- /customers/:customerID/cart
SET @customerID := 1;  -- change for testing

SELECT Customers.name
FROM Customers
WHERE Customers.customerID = @customerID;

SELECT
  CartItems.gameID,
  Platforms.platformID,
  Games.name      AS "Game Name",
  Games.releaseDate AS "Release Date",
  Platforms.name  AS "Platform Name"
FROM Carts
JOIN CartItems ON Carts.cartID = CartItems.cartID
JOIN Games     ON CartItems.gameID = Games.gameID
JOIN Platforms ON CartItems.platformID = Platforms.platformID
WHERE Carts.customerID = @customerID;

-- /customers/:customerID/library
SET @customerID := 1;  -- change for testing

SELECT 
  Customers.name AS customerName,
  LibraryItems.libraryID,
  Games.gameID,
  Games.name AS gameName,
  Games.releaseDate,
  Publishers.name AS publisher,
  Ratings.name AS rating
FROM Customers
JOIN Libraries     ON Customers.customerID = Libraries.customerID
LEFT JOIN LibraryItems ON Libraries.libraryID = LibraryItems.libraryID
LEFT JOIN Games        ON LibraryItems.gameID = Games.gameID
LEFT JOIN Publishers   ON Games.publisherID = Publishers.publisherID
LEFT JOIN Ratings      ON Games.ratingID = Ratings.ratingID
WHERE Customers.customerID = @customerID
ORDER BY Games.name;

-- /genres
SELECT name FROM Genres;

-- /purchases
SELECT Purchases.purchaseID,  
       Platforms.name AS platform, 
       Games.name     AS game, 
       PurchaseItems.totalPaid, 
       Purchases.purchaseDate
FROM PurchaseItems
JOIN Purchases ON PurchaseItems.purchaseID = Purchases.purchaseID
JOIN Games     ON PurchaseItems.gameID     = Games.gameID
JOIN Platforms ON PurchaseItems.platformID = Platforms.platformID;

-- /platforms
SELECT Platforms.name, Platforms.platformID
FROM Platforms;