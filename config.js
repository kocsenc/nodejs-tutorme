module.exports = {
  mode: 'development',
  port: 3000,
  ssl: {
    enabled: false,
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
  },
  permissions: {
    all: ['/users/login', '/users/register', '/version']
  },
  apiVersion: '2' // don't touch!
}

