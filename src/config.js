module.exports = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_TOKEN: process.env.API_TOKEN || 'my-secret',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/noteful',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/noteful'
};