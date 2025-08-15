// ========================================
// routes/update.js - ALL UPDATE OPERATIONS
// ========================================

const express = require('express');
const router = express.Router();

// Helper function for date normalization
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

module.exports = (db) => {
  // Update Game
  router.put('/games/update/:id', async (req, res) => {
    try {
      const gameID = Number(req.params.id);
      if (Number.isNaN(gameID)) return res.status(400).json({ success:false, message:'Invalid game id' });

      const body = req.body || {};
      const name = body.name ?? null;
      const releaseDate = normalizeDate(body.releaseDate ?? null);
      const ratingID = body.ratingID ?? null;
      const ratingName = body.ratingName ?? body.esrbRating ?? null;
      const publisherID = body.publisherID ?? null;
      const publisherName = body.publisherName ?? body.publisher ?? null;

      const [[row]] = await db.query('SELECT gameID FROM Games WHERE gameID=?', [gameID]);
      if (!row) return res.status(404).json({ success:false, message:'Game not found' });

      await db.query('CALL sp_update_game(?, ?, ?, ?, ?, ?, ?)', [
        gameID, name, releaseDate, ratingID, ratingName, publisherID, publisherName
      ]);

      res.json({ success:true });
    } catch (e) {
      console.error('Update game failed:', e);
      res.status(500).json({ success:false, error: e.sqlMessage || e.message || 'Failed' });
    }
  });

  // Update Customer
  router.put('/customers/update/:id', async (req, res) => {
    try {
      const customerID = Number(req.params.id);
      if (Number.isNaN(customerID)) {
        return res.status(400).json({ success: false, message: 'Invalid customer ID' });
      }
      
      const { name, email } = req.body;
      
      const [[row]] = await db.query('SELECT customerID FROM Customers WHERE customerID=?', [customerID]);
      if (!row) return res.status(404).json({ success: false, message: 'Customer not found' });
      
      await db.query('UPDATE Customers SET name=?, email=? WHERE customerID=?', [name, email, customerID]);
      res.json({ success: true });
    } catch (error) {
      console.error('Update customer failed:', error);
      res.status(500).json({ success: false, error: error.sqlMessage || error.message || 'Failed' });
    }
  });

  // Update Publisher
  router.put('/publishers/update/:id', async (req, res) => {
    try {
      const publisherID = Number(req.params.id);
      if (Number.isNaN(publisherID)) {
        return res.status(400).json({ success: false, message: 'Invalid publisher ID' });
      }
      
      const { name } = req.body;
      
      const [[row]] = await db.query('SELECT publisherID FROM Publishers WHERE publisherID=?', [publisherID]);
      if (!row) return res.status(404).json({ success: false, message: 'Publisher not found' });
      
      await db.query('UPDATE Publishers SET name=? WHERE publisherID=?', [name, publisherID]);
      res.json({ success: true });
    } catch (error) {
      console.error('Update publisher failed:', error);
      res.status(500).json({ success: false, error: error.sqlMessage || error.message || 'Failed' });
    }
  });


// Update Genre 
router.put('/genres/update/:id', async (req, res) => {
  try {
    
    const currentName = req.params.id;
    const { name: newName } = req.body;
    
    if (!newName || !newName.trim()) {
      return res.status(400).json({ success: false, message: 'Genre name is required' });
    }
    
    // Check if current genre exists
    const [[row]] = await db.query('SELECT name FROM Genres WHERE name=?', [currentName]);
    if (!row) return res.status(404).json({ success: false, message: 'Genre not found' });
    
    // If the name is changing, we need to update it
    if (currentName !== newName.trim()) {
      // Check if new name already exists
      const [[existingRow]] = await db.query('SELECT name FROM Genres WHERE name=?', [newName.trim()]);
      if (existingRow) {
        return res.status(400).json({ success: false, message: 'A genre with that name already exists' });
      }
    }
    
    // Update the genre name
    await db.query('UPDATE Genres SET name=? WHERE name=?', [newName.trim(), currentName]);
    res.json({ success: true });
  } catch (error) {
    console.error('Update genre failed:', error);
    res.status(500).json({ success: false, error: error.sqlMessage || error.message || 'Failed' });
  }
});

  // Update Platform
  router.put('/platforms/update/:id', async (req, res) => {
    try {
      const platformID = Number(req.params.id);
      if (Number.isNaN(platformID)) {
        return res.status(400).json({ success: false, message: 'Invalid platform ID' });
      }
      
      const { name } = req.body;
      
      const [[row]] = await db.query('SELECT platformID FROM Platforms WHERE platformID=?', [platformID]);
      if (!row) return res.status(404).json({ success: false, message: 'Platform not found' });
      
      await db.query('UPDATE Platforms SET name=? WHERE platformID=?', [name, platformID]);
      res.json({ success: true });
    } catch (error) {
      console.error('Update platform failed:', error);
      res.status(500).json({ success: false, error: error.sqlMessage || error.message || 'Failed' });
    }
  });

  // Update Rating
  router.put('/ratings/update/:id', async (req, res) => {
    try {
      const ratingID = Number(req.params.id);
      if (Number.isNaN(ratingID)) {
        return res.status(400).json({ success: false, message: 'Invalid rating ID' });
      }
      
      const { name } = req.body;
      
      const [[row]] = await db.query('SELECT ratingID FROM Ratings WHERE ratingID=?', [ratingID]);
      if (!row) return res.status(404).json({ success: false, message: 'Rating not found' });
      
      await db.query('UPDATE Ratings SET name=? WHERE ratingID=?', [name, ratingID]);
      res.json({ success: true });
    } catch (error) {
      console.error('Update rating failed:', error);
      res.status(500).json({ success: false, error: error.sqlMessage || error.message || 'Failed' });
    }
  });

  return router;
};