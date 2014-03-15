var config = {
  port: 3000,
  ssl: {
    key:  'ssl/key.pem',
    cert: 'ssl/cert.pem'
  },
  syncOptions: {
    force: false
  }
}

module.exports = config;
