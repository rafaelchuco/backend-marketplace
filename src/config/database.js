const { Sequelize } = require('sequelize');
require('dotenv').config();

const hasPlaceholder = (value) => value && value.includes('${{');

if (hasPlaceholder(process.env.DB_URL) || hasPlaceholder(process.env.DB_HOST) || hasPlaceholder(process.env.DB_PORT)) {
  throw new Error('Configura en .env los datos publicos reales de Railway: DB_URL o DB_HOST y DB_PORT.');
}

if (!process.env.DB_URL && (!process.env.DB_HOST || !process.env.DB_PORT)) {
  throw new Error('Falta configurar la conexion publica de Railway en .env: usa DB_URL o DB_HOST y DB_PORT.');
}

const options = {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL, options)
  : new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      ...options,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    }
  );

module.exports = sequelize;
