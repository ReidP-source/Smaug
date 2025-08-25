// ########################################
// ########## SETUP

// Database
const db = require('./database/db-connector');
const createRoutes = require('./routes/create');
const updateRoutes = require('./routes/update');
const deleteRoutes = require('./routes/delete');
const readRoutes = require('./routes/read');

// Express
const express = require('express');
const app = express();

// Middleware
const cors = require('cors');
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests

// Route handlers
app.use('/', readRoutes(db));
app.use('/', createRoutes(db));
app.use('/', updateRoutes(db));
app.use('/', deleteRoutes(db));

const PORT = 9680;

// ########################################
// ########## ADMIN ROUTES

// RESET
app.post('/admin/reset-db', async (req, res) => {
  try {
    console.log('RESET: calling sp_reset_gamedb');
    await db.query('CALL sp_reset_gamedb()');
    res.json({ success: true, message: 'Database reset & seeded.' });
  } catch (err) {
    console.error('RESET ERROR:', err);
    res.status(500).json({ success: false, error: 'Reset failed' });
  }
});

app.get('/__db', async (_req, res) => {
  try {
    const [[row]] = await db.query('SELECT DATABASE() db, USER() user');
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



// ########################################
// ########## LISTENER

app.listen(PORT, function () {
  console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});