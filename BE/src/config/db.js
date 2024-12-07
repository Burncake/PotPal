const knex = require('knex');
const knexConfig = require('../../knexfile');
// Sử dụng cấu hình 'development' từ knexfile.js
const db = knex(knexConfig.development);

const checkDbConnection = async () => {
    try {
        await db.raw('SELECT 1');
        console.log('Database connection successful');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};
module.exports = {db, checkDbConnection};