// ========================================
// routes/create.js - ALL CREATE OPERATIONS
// ========================================

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Create Game
  router.post('/games/create', async (req, res) => {
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
        releaseDate,
        ratingID,
        ratingName,
        publisherID,
        publisherName
      ]);

      const newId = rows?.[0]?.[0]?.gameID ?? null;
      return res.json({ success:true, gameID:newId });
    } catch (e) {
      console.error('Create game failed:', e);
      return res.status(500).json({ success:false, error: e.sqlMessage || e.message || 'Failed' });
    }
  });

  // Create Customer
  router.post('/customers/create', async (req, res) => {
    try {
      const { name, email } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ success: false, message: 'name and email are required' });
      }
      
      const [result] = await db.query('INSERT INTO Customers (name, email) VALUES (?, ?)', [name, email]);
      res.json({ success: true, customerID: result.insertId });
    } catch (error) {
      console.error('Create customer failed:', error);
      res.status(500).json({ success: false, error: error.sqlMessage || error.message || 'Failed' });
    }
  });

  // Create Publisher
  router.post('/publishers/create', async (req, res) => {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ success: false, message: 'name is required' });
      }
      
      const [result] = await db.query('INSERT INTO Publishers (name) VALUES (?)', [name]);
      res.json({ success: true, publisherID: result.insertId });
    } catch (error) {
      console.error('Create publisher failed:', error);
      res.status(500).json({ success: false, error: error.sqlMessage || error.message || 'Failed' });
    }
  });

  // Create Genre
  router.post('/genres/create', async (req, res) => {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ success: false, message: 'name is required' });
      }
      
      const [result] = await db.query('INSERT INTO Genres (name) VALUES (?)', [name]);
      res.json({ success: true, genreID: result.insertId });
    } catch (error) {
      console.error('Create genre failed:', error);
      res.status(500).json({ success: false, error: error.sqlMessage || error.message || 'Failed' });
    }
  });

  // Create Platform
  router.post('/platforms/create', async (req, res) => {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ success: false, message: 'name is required' });
      }
      
      const [result] = await db.query('INSERT INTO Platforms (name) VALUES (?)', [name]);
      res.json({ success: true, platformID: result.insertId });
    } catch (error) {
      console.error('Create platform failed:', error);
      res.status(500).json({ success: false, error: error.sqlMessage || error.message || 'Failed' });
    }
  });

  // Create Rating
  router.post('/ratings/create', async (req, res) => {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ success: false, message: 'name is required' });
      }
      
      const [result] = await db.query('INSERT INTO Ratings (name) VALUES (?)', [name]);
      res.json({ success: true, ratingID: result.insertId });
    } catch (error) {
      console.error('Create rating failed:', error);
      res.status(500).json({ success: false, error: error.sqlMessage || error.message || 'Failed' });
    }
  });

  return router;
};
