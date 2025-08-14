
/* RESET */
DROP PROCEDURE IF EXISTS sp_reset_gamedb;
DELIMITER //

CREATE PROCEDURE sp_reset_gamedb()
BEGIN
  SET FOREIGN_KEY_CHECKS = 0;

  /* Drop child -> parent */
  DROP TABLE IF EXISTS CartItems;
  DROP TABLE IF EXISTS Carts;
  DROP TABLE IF EXISTS PurchaseItems;
  DROP TABLE IF EXISTS Purchases;
  DROP TABLE IF EXISTS LibraryItems;
  DROP TABLE IF EXISTS Libraries;
  DROP TABLE IF EXISTS GamePlatforms;
  DROP TABLE IF EXISTS GenreItems;
  DROP TABLE IF EXISTS Genres;
  DROP TABLE IF EXISTS Games;
  DROP TABLE IF EXISTS Ratings;
  DROP TABLE IF EXISTS Publishers;
  DROP TABLE IF EXISTS Platforms;
  DROP TABLE IF EXISTS Customers;

  /* Recreate schema  */

  CREATE TABLE Customers (
    customerID INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phoneNumber CHAR(10),
    dateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (customerID)
  );

  CREATE TABLE Platforms (
    platformID INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (platformID)
  );

  CREATE TABLE Publishers (
    publisherID INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (publisherID)
  );

  CREATE TABLE Ratings (
    ratingID INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL UNIQUE,
    minimumAge TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (ratingID)
  );

  CREATE TABLE Games (
    gameID INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    ratingID INT NOT NULL,
    releaseDate DATE NOT NULL,
    publisherID INT NOT NULL,
    PRIMARY KEY (gameID),
    FOREIGN KEY (publisherID) REFERENCES Publishers(publisherID) ON DELETE RESTRICT,
    FOREIGN KEY (ratingID)  REFERENCES Ratings(ratingID)      ON DELETE RESTRICT
  );

  CREATE TABLE GamePlatforms (
    gameID INT NOT NULL,
    platformID INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (gameID, platformID),
    FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE CASCADE,
    FOREIGN KEY (platformID) REFERENCES Platforms(platformID) ON DELETE CASCADE
  );

  CREATE TABLE Libraries (
    libraryID INT AUTO_INCREMENT,
    customerID INT UNIQUE,
    PRIMARY KEY (libraryID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE
  );

  CREATE TABLE LibraryItems (
    libraryID INT NOT NULL,
    gameID INT NOT NULL,
    PRIMARY KEY (libraryID, gameID),
    FOREIGN KEY (libraryID) REFERENCES Libraries(libraryID) ON DELETE CASCADE,
    FOREIGN KEY (gameID)    REFERENCES Games(gameID)        ON DELETE CASCADE
  );

  CREATE TABLE Purchases (
    purchaseID INT AUTO_INCREMENT NOT NULL,
    customerID INT,
    purchaseDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid BOOL NOT NULL,
    PRIMARY KEY (purchaseID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE SET NULL
  );

  CREATE TABLE PurchaseItems (
    purchaseID INT NOT NULL,
    gameID INT NOT NULL,
    platformID INT NOT NULL,
    totalPaid DECIMAL(19,2) NOT NULL,
    PRIMARY KEY (purchaseID, gameID, platformID),
    FOREIGN KEY (purchaseID) REFERENCES Purchases(purchaseID) ON DELETE CASCADE,
    FOREIGN KEY (gameID)     REFERENCES Games(gameID)         ON DELETE RESTRICT,
    FOREIGN KEY (platformID) REFERENCES Platforms(platformID) ON DELETE RESTRICT
  );

  CREATE TABLE Genres (
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (name)
  );

  CREATE TABLE GenreItems (
    gameID INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (gameID, name),
    FOREIGN KEY (gameID) REFERENCES Games(gameID) ON DELETE CASCADE,
    FOREIGN KEY (name)   REFERENCES Genres(name)  ON DELETE CASCADE
  );

  CREATE TABLE Carts (
    cartID INT AUTO_INCREMENT NOT NULL,
    customerID INT NOT NULL UNIQUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cartID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE
  );

  CREATE TABLE CartItems (
    cartID INT NOT NULL,
    gameID INT NOT NULL,
    platformID INT NOT NULL,
    PRIMARY KEY (cartID, gameID, platformID),
    FOREIGN KEY (cartID)    REFERENCES Carts(cartID)         ON DELETE CASCADE,
    FOREIGN KEY (gameID)    REFERENCES Games(gameID)         ON DELETE CASCADE,
    FOREIGN KEY (platformID) REFERENCES Platforms(platformID) ON DELETE CASCADE
  );

  /* Seed data  */

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
  ('Alien: Isolation',
    (SELECT ratingID FROM Ratings WHERE name = 'Mature 17+'),
    '2014-10-07',
    (SELECT publisherID FROM Publishers WHERE name = 'SEGA')),
  ('Fortnite',
    (SELECT ratingID FROM Ratings WHERE name = 'Teen'),
    '2017-07-25',
    (SELECT publisherID FROM Publishers WHERE name = 'Epic Games')),
  ('Elden Ring',
    (SELECT ratingID FROM Ratings WHERE name = 'Mature 17+'),
    '2022-02-25',
    (SELECT publisherID FROM Publishers WHERE name = 'FromSoftware'));

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

  INSERT INTO Libraries (customerID)
  SELECT customerID FROM Customers;

  INSERT INTO Carts (customerID)
  SELECT customerID FROM Customers;

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
  (2, (SELECT gameID FROM Games WHERE name = 'Fortnite'),       (SELECT platformID FROM Platforms WHERE name = 'PC'), 0.00),
  (2, (SELECT gameID FROM Games WHERE name = 'Elden Ring'),     (SELECT platformID FROM Platforms WHERE name = 'PlayStation 5'), 69.99),
  (3, (SELECT gameID FROM Games WHERE name = 'Elden Ring'),     (SELECT platformID FROM Platforms WHERE name = 'PC'), 59.99),
  (4, (SELECT gameID FROM Games WHERE name = 'Alien: Isolation'), (SELECT platformID FROM Platforms WHERE name = 'PlayStation 5'), 34.99);

  SET FOREIGN_KEY_CHECKS = 1;
END //
DELIMITER ;

---------------------
-- DELETE
---------------------

/* DELETE GAME via ID */
DROP PROCEDURE IF EXISTS sp_delete_game;
DELIMITER //

CREATE PROCEDURE sp_delete_game(IN p_gameID INT)
BEGIN
  DECLARE v_exists INT;

  SELECT COUNT(*) INTO v_exists FROM Games WHERE gameID = p_gameID;
  IF v_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Game not found';
  END IF;

  START TRANSACTION;

    -- Delete purchase line items for this game
    DELETE FROM PurchaseItems WHERE gameID = p_gameID;

    -- Delete purchases that now have no remaining items
    DELETE p FROM Purchases p
      LEFT JOIN PurchaseItems pi ON pi.purchaseID = p.purchaseID
      WHERE pi.purchaseID IS NULL;

    -- Delete the game (cascades handle: GamePlatforms, GenreItems, LibraryItems, CartItems)
    DELETE FROM Games WHERE gameID = p_gameID;

  COMMIT;

  -- Return summary
  SELECT 'OK' AS status;
END //
DELIMITER ;


/* DELETE GAME via Name */
DROP PROCEDURE IF EXISTS sp_delete_game_by_name;
DELIMITER //
CREATE PROCEDURE sp_delete_game_by_name(IN p_name VARCHAR(255))
BEGIN
  DECLARE v_id INT;
  SELECT gameID INTO v_id FROM Games WHERE name = p_name LIMIT 1;
  IF v_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Game not found';
  END IF;
  CALL sp_delete_game(v_id);
END //
DELIMITER ;


/* Delete Customer via ID */
DROP PROCEDURE IF EXISTS sp_delete_customer;
DELIMITER //

CREATE PROCEDURE sp_delete_customer(IN c_id INT)
BEGIN
  DECLARE v_exists INT;

  SELECT COUNT(*) INTO v_exists FROM Customers WHERE customerID = c_id;
  IF v_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer not found';
  END IF;

  START TRANSACTION;

    -- Deleting customer (Cascade handles: Library -> LibraryItem, Cart -> CartItems) .
    -- Will not remove customer purchases and instead set to cid from purchase to null.
    DELETE FROM Customers WHERE customerID = c_id;

  COMMIT;
END //
DELIMITER ;


---------------------
-- Create
---------------------

/* CREATE GAME (supports rating/publisher by ID or name; auto-creates publisher if missing) */
DROP PROCEDURE IF EXISTS sp_create_game;
DELIMITER //

CREATE PROCEDURE sp_create_game(
  IN p_name           VARCHAR(255),
  IN p_releaseDate    DATE,
  IN p_ratingID       INT,
  IN p_ratingName     VARCHAR(50),
  IN p_publisherID    INT,
  IN p_publisherName  VARCHAR(255)
)
BEGIN
  DECLARE v_ratingID INT;
  DECLARE v_publisherID INT;

  IF p_name IS NULL OR TRIM(p_name) = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Game name is required';
  END IF;

  IF p_releaseDate IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'releaseDate is required';
  END IF;

  START TRANSACTION;

    -- Resolve rating
    SET v_ratingID = NULL;
    IF p_ratingID IS NOT NULL THEN
      SELECT ratingID INTO v_ratingID FROM Ratings WHERE ratingID = p_ratingID;
    ELSEIF p_ratingName IS NOT NULL AND TRIM(p_ratingName) <> '' THEN
      SELECT ratingID INTO v_ratingID FROM Ratings WHERE name = p_ratingName;
    END IF;

    IF v_ratingID IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid or missing rating (by id or name)';
    END IF;

    -- Resolve or create publisher
    SET v_publisherID = NULL;
    IF p_publisherID IS NOT NULL THEN
      SELECT publisherID INTO v_publisherID FROM Publishers WHERE publisherID = p_publisherID;
      IF v_publisherID IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'publisherID not found';
      END IF;
    ELSE
      IF p_publisherName IS NULL OR TRIM(p_publisherName) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Publisher id or name is required';
      END IF;

      SELECT publisherID INTO v_publisherID FROM Publishers WHERE name = p_publisherName;
      IF v_publisherID IS NULL THEN
        INSERT INTO Publishers(name) VALUES (p_publisherName);
        SET v_publisherID = LAST_INSERT_ID();
      END IF;
    END IF;

    -- Optional duplicate protection (by name + publisher)
    IF EXISTS (SELECT 1 FROM Games WHERE name = p_name AND publisherID = v_publisherID) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Game already exists for this publisher';
    END IF;

    INSERT INTO Games (name, ratingID, releaseDate, publisherID)
    VALUES (p_name, v_ratingID, p_releaseDate, v_publisherID);

  COMMIT;

  SELECT LAST_INSERT_ID() AS gameID;
  -- Return summary
  SELECT 'OK' AS status;

END //
DELIMITER ;

---------------------
-- Update
---------------------

/* UPDATE GAME (partial update; resolves rating/publisher by id or name; creates publisher if name missing) */
DROP PROCEDURE IF EXISTS sp_update_game;
DELIMITER //

CREATE PROCEDURE sp_update_game(
  IN p_gameID         INT,
  IN p_name           VARCHAR(255),
  IN p_releaseDate    DATE,
  IN p_ratingID       INT,
  IN p_ratingName     VARCHAR(50),
  IN p_publisherID    INT,
  IN p_publisherName  VARCHAR(255)
)
BEGIN
  DECLARE v_exists INT;
  DECLARE v_name VARCHAR(255);
  DECLARE v_release DATE;
  DECLARE v_ratingID INT;
  DECLARE v_publisherID INT;

  SELECT COUNT(*) INTO v_exists FROM Games WHERE gameID = p_gameID;
  IF v_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Game not found';
  END IF;

  -- Start with current values
  SELECT name, releaseDate, ratingID, publisherID
    INTO v_name, v_release, v_ratingID, v_publisherID
  FROM Games WHERE gameID = p_gameID;

  -- Override if provided
  IF p_name IS NOT NULL AND TRIM(p_name) <> '' THEN SET v_name = p_name; END IF;
  IF p_releaseDate IS NOT NULL THEN SET v_release = p_releaseDate; END IF;

  -- Resolve rating
  IF p_ratingID IS NOT NULL THEN
    SELECT ratingID INTO v_ratingID FROM Ratings WHERE ratingID = p_ratingID;
    IF v_ratingID IS NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='ratingID not found'; END IF;
  ELSEIF p_ratingName IS NOT NULL AND TRIM(p_ratingName) <> '' THEN
    SELECT ratingID INTO v_ratingID FROM Ratings WHERE name = p_ratingName;
    IF v_ratingID IS NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='ratingName not found'; END IF;
  END IF;

  -- Resolve or create publisher
  IF p_publisherID IS NOT NULL THEN
    SELECT publisherID INTO v_publisherID FROM Publishers WHERE publisherID = p_publisherID;
    IF v_publisherID IS NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='publisherID not found'; END IF;
  ELSEIF p_publisherName IS NOT NULL AND TRIM(p_publisherName) <> '' THEN
    SELECT publisherID INTO v_publisherID FROM Publishers WHERE name = p_publisherName;
    IF v_publisherID IS NULL THEN
      INSERT INTO Publishers(name) VALUES (p_publisherName);
      SET v_publisherID = LAST_INSERT_ID();
    END IF;
  END IF;

  UPDATE Games
     SET name = v_name,
         releaseDate = v_release,
         ratingID = v_ratingID,
         publisherID = v_publisherID
   WHERE gameID = p_gameID;

  SELECT 'OK' AS status;
END //
DELIMITER ;


