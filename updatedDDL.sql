SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS CartItems;
DROP TABLE IF EXISTS Carts;
DROP TABLE IF EXISTS GenreItems;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS PurchaseItems;
DROP TABLE IF EXISTS Purchases;
DROP TABLE IF EXISTS LibraryItems;
DROP TABLE IF EXISTS Libraries;
DROP TABLE IF EXISTS GamePlatforms;
DROP TABLE IF EXISTS Games;
DROP TABLE IF EXISTS Ratings;
DROP TABLE IF EXISTS Publishers;
DROP TABLE IF EXISTS Platforms;
DROP TABLE IF EXISTS Customers;

--
-- TABLE INITIALIZATION
-- 

-- Customers

/* Should assign LibraryID and CartID FK's to customer */
CREATE TABLE Customers (
    customerID INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phoneNumber CHAR(10),
    dateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (customerID)
    (`customerID`) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Platforms
CREATE TABLE Platforms (
    platformID INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (platformID)
);

-- Publishers
CREATE TABLE Publishers (
    publisherID INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (publisherID)
);

-- Ratings
CREATE TABLE Ratings (
    ratingID INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL UNIQUE,
    minimumAge TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (ratingID)
);

-- Games
CREATE TABLE Games (
    gameID INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    ratingID INT NOT NULL,
    releaseDate DATE NOT NULL,
    publisherID INT NOT NULL,
    PRIMARY KEY (gameID),
    FOREIGN KEY (publisherID) REFERENCES Publishers(publisherID) ON DELETE RESTRICT,
    FOREIGN KEY (ratingID) REFERENCES Ratings(ratingID) ON DELETE RESTRICT
);

-- GamePlatforms
CREATE TABLE GamePlatforms (
    gameID INT NOT NULL,
    platformID INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (gameID, platformID),
    FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE CASCADE,
    FOREIGN KEY (platformID) REFERENCES Platforms(platformID) ON DELETE CASCADE
);

-- Libraries
CREATE TABLE Libraries (
    libraryID INT AUTO_INCREMENT,
    customerID INT UNIQUE,
    PRIMARY KEY (libraryID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE
);

-- LibraryItems
CREATE TABLE LibraryItems (
    libraryID INT NOT NULL,
    gameID INT NOT NULL,
    PRIMARY KEY (libraryID, gameID),
    FOREIGN KEY (libraryID) REFERENCES Libraries(libraryID) ON DELETE CASCADE,
    FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE CASCADE
);

-- Purchases
CREATE TABLE Purchases (
    purchaseID INT AUTO_INCREMENT NOT NULL,
    customerID INT,
    purchaseDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid BOOL NOT NULL,
    PRIMARY KEY (purchaseID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE SET NULL
);

-- PurchaseItems
CREATE TABLE PurchaseItems (
      purchaseID INT NOT NULL,
      gameID INT NOT NULL,
      platformID INT NOT NULL,
      totalPaid DECIMAL(19,2) NOT NULL,
      PRIMARY KEY (purchaseID, gameID, platformID),
      FOREIGN KEY (purchaseID) REFERENCES Purchases(purchaseID) ON DELETE CASCADE,
      FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE RESTRICT,
      FOREIGN KEY (platformID) REFERENCES Platforms(platformID) ON
)

-- Genres
CREATE TABLE Genres (
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (name)
);

-- GenreItems
CREATE TABLE GenreItems (
    gameID INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (gameID, name),
    FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE CASCADE,
    FOREIGN KEY (name) REFERENCES Genres(name) ON DELETE CASCADE
);

-- Carts
CREATE TABLE Carts (
    cartID INT AUTO_INCREMENT NOT NULL,
    customerID INT NOT NULL UNIQUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cartID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE
);

-- CartItems
CREATE TABLE CartItems (
    cartID INT NOT NULL,
    gameID INT NOT NULL,
    platformID INT NOT NULL,
    PRIMARY KEY (cartID, gameID, platformID),
    FOREIGN KEY (cartID) REFERENCES Carts(cartID) ON DELETE CASCADE,
    FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE CASCADE,
    FOREIGN KEY (platformID) REFERENCES Platforms(platformID) ON DELETE CASCADE
);

-- 
-- SAMPLE DATA 
-- 

-- Insert Ratings
INSERT INTO Ratings (name, minimumAge) VALUES
('Mature 17+', 17),
('Teen', 13),
('Everyone', 0);

-- Insert Publishers
INSERT INTO Publishers (name) VALUES
('SEGA'),
('Epic Games'),
('FromSoftware');

-- Insert Platforms
INSERT INTO Platforms (name) VALUES
('PC'),
('PlayStation 5'),
('Xbox Series X');

-- Insert Genres
INSERT INTO Genres (name) VALUES
('Horror'),
('Sci-Fi'),
('Shooter'),
('RPG');

-- Insert Games
INSERT INTO Games (name, ratingID, releaseDate, publisherID) VALUES
(
  'Alien: Isolation',
  (SELECT ratingID FROM Ratings WHERE name = 'Mature 17+'),
  '2014-10-07',
  (SELECT publisherID FROM Publishers WHERE name = 'SEGA')
),
(
  'Fortnite',
  (SELECT ratingID FROM Ratings WHERE name = 'Teen'),
  '2017-07-25',
  (SELECT publisherID FROM Publishers WHERE name = 'Epic Games')
),
(
  'Elden Ring',
  (SELECT ratingID FROM Ratings WHERE name = 'Mature 17+'),
  '2022-02-25',
  (SELECT publisherID FROM Publishers WHERE name = 'FromSoftware')
);

-- Insert GenreItems
INSERT INTO GenreItems (gameID, name) VALUES
((SELECT gameID FROM Games WHERE name = 'Alien: Isolation'), 'Horror'),
((SELECT gameID FROM Games WHERE name = 'Alien: Isolation'), 'Sci-Fi'),
((SELECT gameID FROM Games WHERE name = 'Alien: Isolation'), 'Shooter'),

((SELECT gameID FROM Games WHERE name = 'Fortnite'), 'Shooter'),
((SELECT gameID FROM Games WHERE name = 'Fortnite'), 'RPG'),

((SELECT gameID FROM Games WHERE name = 'Elden Ring'), 'RPG');

-- Insert GamePlatforms
INSERT INTO GamePlatforms (gameID, platformID, price) VALUES
((SELECT gameID FROM Games WHERE name = 'Alien: Isolation'), (SELECT platformID FROM Platforms WHERE name = 'PC'), 29.99),
((SELECT gameID FROM Games WHERE name = 'Alien: Isolation'), (SELECT platformID FROM Platforms WHERE name = 'PlayStation 5'), 34.99),

((SELECT gameID FROM Games WHERE name = 'Fortnite'), (SELECT platformID FROM Platforms WHERE name = 'PC'), 0.00),
((SELECT gameID FROM Games WHERE name = 'Fortnite'), (SELECT platformID FROM Platforms WHERE name = 'Xbox Series X'), 0.00),

((SELECT gameID FROM Games WHERE name = 'Elden Ring'), (SELECT platformID FROM Platforms WHERE name = 'PC'), 59.99),
((SELECT gameID FROM Games WHERE name = 'Elden Ring'), (SELECT platformID FROM Platforms WHERE name = 'PlayStation 5'), 69.99);

-- Insert Customers
INSERT INTO Customers (name, email, phoneNumber) VALUES
('Amanda Ripley', 'amanda.ripley@example.com', '5551234567'),
('John Doe', 'john.doe@example.com', '5559876543');

-- Insert Libraries
INSERT INTO Libraries (customerID) VALUES
((SELECT customerID FROM Customers WHERE email = 'amanda.ripley@example.com')),
((SELECT customerID FROM Customers WHERE email = 'john.doe@example.com'));

-- Insert LibraryItems
INSERT INTO LibraryItems (libraryID, gameID) VALUES
(
  (SELECT libraryID FROM Libraries WHERE customerID = (SELECT customerID FROM Customers WHERE email = 'amanda.ripley@example.com')),
  (SELECT gameID FROM Games WHERE name = 'Alien: Isolation')
),
(
  (SELECT libraryID FROM Libraries WHERE customerID = (SELECT customerID FROM Customers WHERE email = 'john.doe@example.com')),
  (SELECT gameID FROM Games WHERE name = 'Fortnite')
);

-- Insert Carts
INSERT INTO Carts (customerID) VALUES
((SELECT customerID FROM Customers WHERE email = 'amanda.ripley@example.com')),
((SELECT customerID FROM Customers WHERE email = 'john.doe@example.com'));

-- Insert CartItems
INSERT INTO CartItems (cartID, gameID, platformID) VALUES
(
  (SELECT cartID FROM Carts WHERE customerID = (SELECT customerID FROM Customers WHERE email = 'amanda.ripley@example.com')),
  (SELECT gameID FROM Games WHERE name = 'Alien: Isolation'),
  (SELECT platformID FROM Platforms WHERE name = 'PC')
),
(
  (SELECT cartID FROM Carts WHERE customerID = (SELECT customerID FROM Customers WHERE email = 'john.doe@example.com')),
  (SELECT gameID FROM Games WHERE name = 'Elden Ring'),
  (SELECT platformID FROM Platforms WHERE name = 'PlayStation 5')
);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;