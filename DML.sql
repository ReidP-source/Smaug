SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

INSERT INTO Ratings (name, minimumAge) VALUES
('Mature 17+', 17),
('Teen', 13),
('Everyone', 0);

INSERT INTO Publishers (name) VALUES
('SEGA'),
('Epic Games'),
('FromSoftware');

INSERT INTO Platforms (name) VALUES
('PC'),
('PlayStation 5'),
('Xbox Series X');

INSERT INTO Genres (name) VALUES
('Horror'),
('Sci-Fi'),
('Shooter'),
('RPG');

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

INSERT INTO GenreItems (gameID, name) VALUES
((SELECT gameID FROM Games WHERE name = 'Alien: Isolation'), 'Horror'),
((SELECT gameID FROM Games WHERE name = 'Alien: Isolation'), 'Sci-Fi'),
((SELECT gameID FROM Games WHERE name = 'Alien: Isolation'), 'Shooter'),
((SELECT gameID FROM Games WHERE name = 'Fortnite'), 'Shooter'),
((SELECT gameID FROM Games WHERE name = 'Fortnite'), 'RPG'),
((SELECT gameID FROM Games WHERE name = 'Elden Ring'), 'RPG');

INSERT INTO GamePlatforms (gameID, platformID, price) VALUES
((SELECT gameID FROM Games WHERE name = 'Alien: Isolation'), (SELECT platformID FROM Platforms WHERE name = 'PC'), 29.99),
((SELECT gameID FROM Games WHERE name = 'Alien: Isolation'), (SELECT platformID FROM Platforms WHERE name = 'PlayStation 5'), 34.99),
((SELECT gameID FROM Games WHERE name = 'Fortnite'), (SELECT platformID FROM Platforms WHERE name = 'PC'), 0.00),
((SELECT gameID FROM Games WHERE name = 'Fortnite'), (SELECT platformID FROM Platforms WHERE name = 'Xbox Series X'), 0.00),
((SELECT gameID FROM Games WHERE name = 'Elden Ring'), (SELECT platformID FROM Platforms WHERE name = 'PC'), 59.99),
((SELECT gameID FROM Games WHERE name = 'Elden Ring'), (SELECT platformID FROM Platforms WHERE name = 'PlayStation 5'), 69.99);

INSERT INTO Customers (name, email, phoneNumber) VALUES
('Amanda Ripley', 'amanda.ripley@example.com', '5551234567'),
('John Doe', 'john.doe@example.com', '5559876543'),
('Sarah Connor', 'sarah.connor@example.com', '5551112222'),
('Master Chief', 'chief@unsc.mil', '5553334444'),
('Lara Croft', 'lara.croft@example.com', '5555556666');

INSERT INTO Libraries (customerID) VALUES
((SELECT customerID FROM Customers WHERE email = 'amanda.ripley@example.com')),
((SELECT customerID FROM Customers WHERE email = 'john.doe@example.com')),
((SELECT customerID FROM Customers WHERE email = 'sarah.connor@example.com')),
((SELECT customerID FROM Customers WHERE email = 'chief@unsc.mil')),
((SELECT customerID FROM Customers WHERE email = 'lara.croft@example.com'));

INSERT INTO LibraryItems (libraryID, gameID) VALUES
(
  (SELECT libraryID FROM Libraries WHERE customerID = (SELECT customerID FROM Customers WHERE email = 'amanda.ripley@example.com')),
  (SELECT gameID FROM Games WHERE name = 'Alien: Isolation')
),
(
  (SELECT libraryID FROM Libraries WHERE customerID = (SELECT customerID FROM Customers WHERE email = 'john.doe@example.com')),
  (SELECT gameID FROM Games WHERE name = 'Fortnite')
),
(
  (SELECT libraryID FROM Libraries WHERE customerID = (SELECT customerID FROM Customers WHERE email = 'john.doe@example.com')),
  (SELECT gameID FROM Games WHERE name = 'Elden Ring')
),
(
  (SELECT libraryID FROM Libraries WHERE customerID = (SELECT customerID FROM Customers WHERE email = 'chief@unsc.mil')),
  (SELECT gameID FROM Games WHERE name = 'Alien: Isolation')
);

INSERT INTO Carts (customerID) VALUES
((SELECT customerID FROM Customers WHERE email = 'amanda.ripley@example.com')),
((SELECT customerID FROM Customers WHERE email = 'john.doe@example.com')),
((SELECT customerID FROM Customers WHERE email = 'sarah.connor@example.com')),
((SELECT customerID FROM Customers WHERE email = 'chief@unsc.mil')),
((SELECT customerID FROM Customers WHERE email = 'lara.croft@example.com'));

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
),
(
  (SELECT cartID FROM Carts WHERE customerID = (SELECT customerID FROM Customers WHERE email = 'sarah.connor@example.com')),
  (SELECT gameID FROM Games WHERE name = 'Elden Ring'),
  (SELECT platformID FROM Platforms WHERE name = 'PC')
),
(
  (SELECT cartID FROM Carts WHERE customerID = (SELECT customerID FROM Customers WHERE email = 'sarah.connor@example.com')),
  (SELECT gameID FROM Games WHERE name = 'Fortnite'),
  (SELECT platformID FROM Platforms WHERE name = 'PC')
),
(
  (SELECT cartID FROM Carts WHERE customerID = (SELECT customerID FROM Customers WHERE email = 'chief@unsc.mil')),
  (SELECT gameID FROM Games WHERE name = 'Alien: Isolation'),
  (SELECT platformID FROM Platforms WHERE name = 'PlayStation 5')
),
(
  (SELECT cartID FROM Carts WHERE customerID = (SELECT customerID FROM Customers WHERE email = 'lara.croft@example.com')),
  (SELECT gameID FROM Games WHERE name = 'Elden Ring'),
  (SELECT platformID FROM Platforms WHERE name = 'PlayStation 5')
);

INSERT INTO Purchases (customerID, purchaseDate, paid) VALUES
(
  (SELECT customerID FROM Customers WHERE email = 'amanda.ripley@example.com'),
  '2024-12-30 14:30:00',
  TRUE
),
(
  (SELECT customerID FROM Customers WHERE email = 'john.doe@example.com'),
  '2025-01-05 09:15:00',
  TRUE
),
(
  (SELECT customerID FROM Customers WHERE email = 'sarah.connor@example.com'),
  '2025-01-06 16:45:00',
  FALSE
),
(
  (SELECT customerID FROM Customers WHERE email = 'chief@unsc.mil'),
  '2024-12-15 11:20:00',
  TRUE
);

INSERT INTO PurchaseItems (purchaseID, gameID, platformID, totalPaid) VALUES
(1, (SELECT gameID FROM Games WHERE name = 'Alien: Isolation'), (SELECT platformID FROM Platforms WHERE name = 'PC'), 29.99),
(2, (SELECT gameID FROM Games WHERE name = 'Fortnite'), (SELECT platformID FROM Platforms WHERE name = 'PC'), 0.00),
(2, (SELECT gameID FROM Games WHERE name = 'Elden Ring'), (SELECT platformID FROM Platforms WHERE name = 'PlayStation 5'), 69.99),
(3, (SELECT gameID FROM Games WHERE name = 'Elden Ring'), (SELECT platformID FROM Platforms WHERE name = 'PC'), 59.99),
(4, (SELECT gameID FROM Games WHERE name = 'Alien: Isolation'), (SELECT platformID FROM Platforms WHERE name = 'PlayStation 5'), 34.99);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;