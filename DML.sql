/*
  Queries
*/

-- Select Games, ratings, and publisher for games based on IDs
SELECT 
    Games.name, 
    Ratings.name AS "ESRB Rating",
    DATE_FORMAT(Games.releaseDate, '%m/%d/%y') AS releaseDate,
    Publishers.name AS "Publisher"
FROM Games
INNER JOIN Ratings ON Ratings.ratingID = Games.ratingID
INNER JOIN Publishers ON Publishers.publisherID = Games.publisherID;

-- Select Customers ID, name, email, **LibraryID, CartID** TO DO
SELECT Customers.customerID, Customers.name, Customers.email FROM Customers;

-- Viewing a customers library of games.
SELECT Games.*
FROM LibraryItems
JOIN Libraries ON LibraryItems.libraryID = Libraries.libraryID
JOIN Games ON LibraryItems.gameID = Games.gameID
WHERE Libraries.customerID = @customerID

-- Selecting the list of purchases from all customers.
SELECT Purchases.purchaseID,  
        Platforms.name AS platform, 
        Games.name AS game, 
        PurchaseItems.totalPaid, 
        Purchases.purchaseDate
FROM PurchaseItems
JOIN Purchases ON PurchaseItems.purchaseID = Purchases.purchaseID
JOIN Games ON PurchaseItems.gameID = Games.gameID
JOIN Platforms ON PurchaseItems.platformID = Platforms.platformID;


/*
  Stored Procedures
*/

----------------------
-- Create Customer TBC
----------------------

DELIMITER //

CREATE PROCEDURE sm_CreateCustomer (
  IN c_firstname
)

DELIMITER ;

