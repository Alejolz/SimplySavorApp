/**  
 * |------------------------------------------------------|
 * |@function         |@version |@date                    |
 * |                  |         |                         |
 * |------------------------------------------------------| 
*/

const mysqlDB = require('../utils/sql');

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
        connection = await mysqlDB.createConnection(connectionConfig);

        const tableExistsResult = await mysqlDB.tableExists(connection, 'APRENDICES');
        if (!tableExistsResult) {
            return createResponse(404, { message: 'La tabla APRENDICES no existe en la base de datos' });
        }

        if (event.queryStringParameters) {
            const { username, password } = event.queryStringParameters;

            if (username && password) {
                const userExistsResult = await mysqlDB.userExists(connection, username, password);
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
