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

const PORT = 9670;

/* HELPER FUNCTIONS */

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

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
  console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});