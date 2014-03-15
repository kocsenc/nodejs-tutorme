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
      name: 'tutorme_dev',
      user: 'devUser',
      password: 'dev-pass'
    },
    production: {
      name: 'tutorme_prod',
      user: 'prodUser',
      password: ''
    }
  }
}

module.exports = config;
