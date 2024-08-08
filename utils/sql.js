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

module.exports.getUser = async (connection, email) => {
    const [rows] = await connection.execute('SELECT * FROM APRENDICES WHERE EMAIL = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
}

module.exports.userExistsInDB = async (connection, email) => {
    const [rows] = await connection.execute('SELECT * FROM APRENDICES WHERE EMAIL = ?', [email]);
    return rows.length > 0;
}

module.exports.createUser = async (connection, user) => {
    const [rows] = await connection.execute('INSERT INTO APRENDICES (NAME, PASSWORD, EMAIL, TIPO_IDENTIFICACION, NUMERO_IDENTIFICACION, EDAD, TELEFONO, FECHA_NACIMIENTO) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user.name, user.password, user.email, user.identificationType, user.identificationNumber, user.age, user.number, user.birthdate]);
    return rows.affectedRows > 0;
}

module.exports.editUser = async (connection, user, oldEmail) => {
    const [rows] = await connection.execute('UPDATE APRENDICES SET NAME = ?, EMAIL = ?, TELEFONO = ?, EDAD = ?  WHERE EMAIL = ?', 
        [user.newName, user.newEmail, user.newNumber, user.newAge, oldEmail ]);
    return rows.affectedRows > 0;
}


