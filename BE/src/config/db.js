const knex = require('knex');
const knexConfig = require('../../knexfile');

const db = knex(knexConfig.development);

const checkDbConnection = async () => {
    try {
        await db.raw('SELECT 0');
        console.log('Database connection successful');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = {db, checkDbConnection};