/**  
 * |------------------------------------------------------|
 * |@function         |@version |@date                    |
 * |                  |         |                         |
 * |------------------------------------------------------| 
*/

const mysqlDB = require('../utils/sql');
const bcrypt = require('bcryptjs');
const constants = require ('../constants')

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

function createSuccesfulObjectResponse(response, data = null){
    return (successObj = {
       code: response.code,
       message: response.message,
       data: !data ? {}: data
    })
}

function isNullOrEmpty(obj) {
    return obj === undefined || obj === null || obj == NaN || obj === '';
}

function findMissingObligatoryFields(fields, obligatoryFields) {
    return obligatoryFields.filter(field => !fields.includes(field));
}

async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

async function makeUser(user) {
    return {
        name: user.name,
        password: await hashPassword(user.password),
        email: user.email,
        identificationType: user.identificationType,
        identificationNumber: user.identificationNumber,
        age: user.age,
        number: user.number,
        birthdate: user.birthdate
    };
}

exports.handler = async (event, context, callback) => {

    console.log ('EVENT', event)
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
        let user = JSON.parse(event.body);
        let obligatoryFields = ['name', 'password', 'email', 'identificationType', 'identificationNumber', 'age', 'number', 'birthdate']

        if (!isNullOrEmpty(user)) {

            if (user.password.trim().length > 120) {
                return createResponse(200, constants.error_messages.format_errors.wrong_password_extension);
            }
            let existUserName = await mysqlDB.userExistsInDB(connection, user.email);
            if (existUserName) {
                return createResponse(200, { message: 'Email ya se encuentra registrado' });
            }

            let missingFields = findMissingObligatoryFields(Object.getOwnPropertyNames(user), obligatoryFields);

            if (missingFields.length > 0) {
                return createResponse(200, { message: 'Faltan campos obligatorios: ' + missingFields.join(', ') });
            }


        } else {

            return createResponse(200, { message: 'No se encontro body en el request enviado' });
        }

        console.log('Paso validaciones')

        const userDB = await mysqlDB.createUser(connection, await makeUser(user));

        if (userDB) {
            return createResponse(200, 
                createSuccesfulObjectResponse(
                    constants.succesfull_response.success_register,
                    userData
                )
            );
        } else {
            return createResponse(200, { message: 'Error al crear el usuario' });
        }

    } catch (e) {
        console.error('Entra catch, error interno del servidor:', e);
        return createResponse(500, constants.error_messages.business_errors.internal_server_error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};
