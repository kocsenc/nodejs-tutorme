var config = {
  mode: 'development',
  port: 3000,
  ssl: {
    key:  'ssl/key.pem',
    cert: 'ssl/cert.pem'
  },
  syncOptions: {
    force: true
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
  },
  permissions: {
    all: ['/users/login', '/users/register', '/api/version']
  },
  apiVersion: '2' // don't touch!
}

module.exports = config;
