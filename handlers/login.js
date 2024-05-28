/**  
 * |------------------------------------------------------|
 * |@function         |@version |@date                    |
 * |                  |         |                         |
 * |------------------------------------------------------| 
*/

const mysql = require('mysql2/promise');

function createResponse(statusCode, message) {
    return {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(message)
    };
}

async function tableExists(connection, tableName) {
    const [rows] = await connection.execute(`SHOW TABLES LIKE '${tableName}'`);
    return rows.length > 0;
}

async function userExists(connection, username, password) {
    const [rows] = await connection.execute('SELECT * FROM APRENDICES WHERE USER_NAME = ? AND PASSWORD = ?', [username, password]);
    return rows.length > 0;
}

exports.handler = async (event) => {
    const connectionConfig = {
        host: 'monorail.proxy.rlwy.net',
        user: 'root',
        password: 'pYsEeaEJbAWyAUBDStfstBKVXyRdOrtK',
        database: 'railway',
        port: '27406'
    };

    let connection;
    
    try {
        connection = await mysql.createConnection(connectionConfig);

        const tableExistsResult = await tableExists(connection, 'APRENDICES');
        console.log('TABLE APRENDICES EXIST!')
        if (!tableExistsResult) {
            return createResponse(404, { message: 'La tabla APRENDICES no existe en la base de datos' });
        }

        // const allowedUsername = 'usuario';
        // const allowedPassword = 'contraseña';

        if (event.queryStringParameters) {
            const { username, password } = event.queryStringParameters;

            if (username && password) {
                const userExistsResult = await userExists(connection, username, password);
                if (userExistsResult) {
                    return createResponse(200, { message: 'Login exitoso' });
                } else {
                    return createResponse(400, { message: 'Nombre de usuario o contraseña incorrectos' });
                }
            } else {
                return createResponse(400, { message: 'Se requiere nombre de usuario y contraseña' });
            }
        } else {
            return createResponse(200, { message: 'No se proporcionaron parámetros en el query string' });
        }
    } catch (e) {
        console.error('Error durante la conexión a la base de datos o procesamiento:', e);
        return createResponse(500, { message: 'Error interno del servidor al ejecutar' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};