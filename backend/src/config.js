module.exports = {
  port: parseInt(process.env.PORT, 10) || 5009,
  jwtSecret: process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNzgxNDYwNDc5LCJleHAiOjE3ODE0NjQwNzl9.ImEyCq18wHX-bZ2S4D7Kg2OmwiEndPGw5bDC7wkhMmA',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '10y',
  corsOrigin: process.env.CORS_ORIGIN || 'CORS_ORIGIN=https://jalvindercomputer.com,https://www.jalvindercomputer.com',
  adminEmail: process.env.ADMIN_EMAIL || 'jalvindercomputertechnology@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://mantujak_db_user:6R083TFQyGZmyYMU@jalvindarcomputer.4vet88h.mongodb.net/',
};
