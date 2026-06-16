const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const app = require('./app');
const config = require('./config');
const { connectDB } = require('./db');

// Connect to MongoDB
connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`✓ Jalvindar API running on http://localhost:${config.port}`);
  });
});



