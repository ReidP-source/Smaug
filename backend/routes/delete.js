// ========================================
// routes/delete.js - ALL DELETE OPERATIONS
// ========================================

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Delete Game
  router.delete('/games/:id', async (req, res) => {
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

  // Delete Customer
  router.delete('/customers/:id', async (req, res) => {
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

  // Delete Publisher
  router.delete('/publishers/:id', async (req, res) => {
    try {
      const publisherID = Number(req.params.id);
      const [[row]] = await db.query('SELECT publisherID FROM Publishers WHERE publisherID=?', [publisherID]);
      if (!row) return res.status(404).json({ success: false, message: 'Publisher not found' });
      
      await db.query('DELETE FROM Publishers WHERE publisherID=?', [publisherID]);
      res.json({ success: true, message: 'Publisher removed' });
    } catch (e) {
      console.error('Delete publisher error:', e);
      res.status(500).json({ success: false, error: e.sqlMessage || 'Failed' });
    }
  });

 
// Delete Genre 
router.delete('/genres/:id', async (req, res) => {
  try {
    
    const genreName = req.params.id;
    
    const [[row]] = await db.query('SELECT name FROM Genres WHERE name=?', [genreName]);
    if (!row) return res.status(404).json({ success: false, message: 'Genre not found' });
    
    await db.query('DELETE FROM Genres WHERE name=?', [genreName]);
    res.json({ success: true, message: 'Genre removed' });
  } catch (e) {
    console.error('Delete genre error:', e);
    res.status(500).json({ success: false, error: e.sqlMessage || 'Failed' });
  }
});

  // Delete Platform
  router.delete('/platforms/:id', async (req, res) => {
    try {
      const platformID = Number(req.params.id);
      const [[row]] = await db.query('SELECT platformID FROM Platforms WHERE platformID=?', [platformID]);
      if (!row) return res.status(404).json({ success: false, message: 'Platform not found' });
      
      await db.query('DELETE FROM Platforms WHERE platformID=?', [platformID]);
      res.json({ success: true, message: 'Platform removed' });
    } catch (e) {
      console.error('Delete platform error:', e);
      res.status(500).json({ success: false, error: e.sqlMessage || 'Failed' });
    }
  });

  // Delete Rating
  router.delete('/ratings/:id', async (req, res) => {
    try {
      const ratingID = Number(req.params.id);
      const [[row]] = await db.query('SELECT ratingID FROM Ratings WHERE ratingID=?', [ratingID]);
      if (!row) return res.status(404).json({ success: false, message: 'Rating not found' });
      
      await db.query('DELETE FROM Ratings WHERE ratingID=?', [ratingID]);
      res.json({ success: true, message: 'Rating removed' });
    } catch (e) {
      console.error('Delete rating error:', e);
      res.status(500).json({ success: false, error: e.sqlMessage || 'Failed' });
    }
  });

  return router;
};