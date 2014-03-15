var config = {
  mode: 'development',
  port: 3000,
  ssl: {
    key:  'ssl/key.pem',
    cert: 'ssl/cert.pem'
  },
  syncOptions: {
    force: false
  },
  db: { 
    development: {
      name: '',
      user: '',
      password: ''
    },
    production: {
      name: '',
      user: '',
      password: ''
    }
  }
}

module.exports = config;
