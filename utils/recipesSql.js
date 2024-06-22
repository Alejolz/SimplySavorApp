/**  
 * |------------------------------------------------------|
 * |@function         |@version |@date                    |
 * |                  |         |                         |
 * |------------------------------------------------------| 
*/


const mysql = require('mysql2/promise');

module.exports.createConnection = async (config) => {
    return await mysql.createConnection(config);
};

module.exports.getAllRecipes = async (connection) => {
    const [rows, fields] = await connection.execute('SELECT * FROM RECETAS');
    return rows.length > 0 ? rows : [];
};