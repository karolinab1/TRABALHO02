
const knex = require('knex');
const config = require('../../knexfile.js'); // Ajuste o caminho se necessário

module.exports = knex(config.development);