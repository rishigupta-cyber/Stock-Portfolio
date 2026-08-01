const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
require('dotenv').config();

const { initDb } = require('./config/db');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

async function start() {
  await initDb();

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  const sessionStore = new MySQLStore({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stockportfolio',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
  });

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }
  }));

  app.use('/', require('./routes/authRoutes'));
  app.use('/profile', require('./routes/profileRoutes'));
  app.use('/portfolio', require('./routes/portfolioRoutes'));
  app.use('/dashboard', require('./routes/dashboardRoutes'));

  app.get('/', (req, res) => {
    if (req.session.userId) {
      res.redirect('/dashboard');
    } else {
      res.redirect('/login');
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.log('Could not start the server:', err.message || err.code || err);
  if (err.errors) {
    err.errors.forEach((e) => console.log('  -', e.message));
  }
});
