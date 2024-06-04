/**  
 * |------------------------------------------------------|
 * |@function         |@version |@date                    |
 * |                  |         |                         |
 * |------------------------------------------------------| 
*/

const mysqlDB = require('../utils/sql');
const bcrypt = require('bcryptjs');
// const crypto = require('crypto');

// const key = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);

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

function isNullOrEmpty(obj) {
    return obj === undefined || obj === null || obj == NaN || obj === '';
}

function findMissingObligatoryFields(fields, obligatoryFields) {
    return obligatoryFields.filter(field => !fields.includes(field));
}

// async function encrypt(password) {
//     let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
//     let encrypted = cipher.update(password);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     return encrypted.toString('hex');

// }

async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

async function makeUser(user) {
    return {
        name: user.name,
        username: user.username,
        password: await hashPassword(user.password),
        email: user.email
    };
}

exports.handler = async (event, context, callback) => {

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
        let user = JSON.parse(event.body);
        let obligatoryFields = ['name', 'username', 'password', 'email']

        if (!isNullOrEmpty(user)) {

            const tableExistsResult = await mysqlDB.tableExists(connection, 'APRENDICES');
            if (!tableExistsResult) {
                return createResponse(404, { message: 'La tabla APRENDICES no existe en la base de datos' });
            }

            if (user.password.trim().length > 120) {
                return createResponse(400, { message: 'La contraseña no puede tener más de 120 caracteres' });
            }
            let existUserName = await mysqlDB.userExistsInDB(connection, user.username);
            if (existUserName) {
                return createResponse(400, { message: 'El usuario ya existe' });
            }

            let missingFields = findMissingObligatoryFields(Object.getOwnPropertyNames(user), obligatoryFields);

            if (missingFields.length > 0) {
                return createResponse(400, { message: 'Faltan campos obligatorios: ' + missingFields.join(', ') });
            }


        } else {

            return createResponse(400, { message: 'No se encontro body en el request enviado' });
        }

        console.log('Paso validaciones')

        const userDB = await mysqlDB.createUser(connection, await makeUser(user));

        if (userDB) {
            return createResponse(200, { message: 'Usuario creado exitosamente' });
        } else {
            return createResponse(400, { message: 'Error al crear el usuario' });
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
