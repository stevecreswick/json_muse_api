const path = require('path');
const BASE_PATH = path.join(__dirname, 'db');
var pg = require('pg');

if (process.env.NODE_ENV === 'production') {
  pg.defaults.ssl = true;
}

module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost:5432/prompts_api_test',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },

  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/prompts_api',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },

  production: {
    client: 'pg',

    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE
    },

    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds', 'production')
    },
    useNullAsDefault: true
  }
};
