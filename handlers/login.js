/**  
 * |------------------------------------------------------|
 * |@function         |@version |@date                    |
 * |                  |         |                         |
 * |------------------------------------------------------| 
*/

const mysqlDB = require('../utils/sql');
const bcrypt = require('bcryptjs');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

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

async function verifyPassword(password, storedHash) {
    return bcrypt.compare(password, storedHash);
}

exports.handler = async (event) => {
    const connectionConfig = {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: DB_PORT
    };

    let connection;

    try {
        connection = await mysqlDB.createConnection(connectionConfig);

        // const tableExistsResult = await mysqlDB.tableExists(connection, 'APRENDICES');
        // if (!tableExistsResult) {
        //     return createResponse(404, { message: 'La tabla APRENDICES no existe en la base de datos' });
        // }

        if (event.queryStringParameters) {
            const { email, password } = event.queryStringParameters;

            if (email && password) {
                const userExistsResult = await mysqlDB.getUser(connection, email);
                // console.log('userExistsResult:', userExistsResult)

                if (userExistsResult && await verifyPassword(password, userExistsResult.PASSWORD)) {
                    return createResponse(200, { message: 'Login exitoso' });
                } else {
                    return createResponse(200, { message: 'Email o contraseña incorrectos' });
                }
            } else {
                return createResponse(200, { message: 'Se requiere email y contraseña' });
            }
        } else {
            return createResponse(200, { message: 'No se proporcionaron parámetros en el query string' });
        }
    } catch (e) {
        console.error('Error durante la conexión a la base de datos o procesamiento:', e);
        return createResponse(500, { message: 'Error interno del servidor' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};
