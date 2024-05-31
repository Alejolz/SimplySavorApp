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

module.exports.userExistsInDB = async (connection, username) => {
    const [rows] = await connection.execute('SELECT * FROM APRENDICES WHERE USER_NAME = ?', [username]);
    return rows.length > 0;
}

module.exports.createUser = async (connection, user) => {
    const [rows] = await connection.execute('INSERT INTO APRENDICES (NAME, USER_NAME, PASSWORD, EMAIL) VALUES (?, ?, ?, ?)', [user.name, user.username, user.password, user.email]);
    return rows.affectedRows > 0;
}