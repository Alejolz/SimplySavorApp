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

module.exports.tableExists = async (connection, tableName) => {
    const [rows] = await connection.execute(`SHOW TABLES LIKE '${tableName}'`);
    return rows.length > 0;
};

module.exports.userExists = async (connection, username, password) => {
    const [rows] = await connection.execute('SELECT * FROM APRENDICES WHERE USER_NAME = ? AND PASSWORD = ?', [username, password]);
    return rows.length > 0;
};