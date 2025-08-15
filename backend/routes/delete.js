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
      if (Number.isNaN(publisherID)) {
        return res.status(400).json({ success: false, message: 'Invalid publisher id' });
      }
      await db.query('CALL sp_delete_publisher(?)', [publisherID]);
      res.json({ success: true, message: 'Publisher and related games removed' });
    } catch (e) {
      if (e && e.errno === 1644) { // SIGNAL from SP
        return res.status(404).json({ success: false, message: e.sqlMessage || 'Not found' });
      }
      console.error('Delete publisher error:', e);
      res.status(500).json({ success: false, error: e.sqlMessage || e.message || 'Failed' });
    }
  });

 
  // Delete Genre 
  router.delete('/genres/:id', async (req, res) => {
    try {
      const genreID = Number(req.params.id);
      if (Number.isNaN(genreID)) {
        return res.status(400).json({ success: false, message: 'Invalid genre id' });
      }
      await db.query('CALL sp_delete_genre(?)', [genreID]);
      res.json({ success: true, message: 'Genre removed (links cleared)' });
    } catch (e) {
      if (e && e.errno === 1644) { // SIGNAL from SP
        return res.status(404).json({ success: false, message: e.sqlMessage || 'Not found' });
      }
      console.error('Delete genre error:', e);
      res.status(500).json({ success: false, error: e.sqlMessage || e.message || 'Failed' });
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
      if (Number.isNaN(ratingID)) return res.status(400).json({ success:false, message:'Invalid rating id' });
      const [[dbInfo]] = await db.query('SELECT DATABASE() db');
      console.log('DELETE /ratings', { ratingID, db: dbInfo.db });
      await db.query('CALL sp_delete_rating(?)', [ratingID]);
      res.json({ success:true, message:'Rating and related games removed' });
    } catch (e) {
      if (e && e.errno === 1644) return res.status(404).json({ success:false, message: e.sqlMessage || 'Not found' });
      console.error('Delete rating error:', e);
      res.status(500).json({ success:false, error: e.sqlMessage || e.message || 'Failed' });
    }
  });

  return router;
};