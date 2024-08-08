/**  
 * |------------------------------------------------------|
 * |@function         |@version |@date                    |
 * |                  |         |                         |
 * |------------------------------------------------------| 
*/

const mysqlDB = require('../utils/sql');
const constants = require('../constants')

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

function createSuccesfulObjectResponse(response, data = null) {
    return (successObj = {
        code: response.code,
        message: response.message,
        data: !data ? {} : data
    })
}

function findMissingObligatoryFields(fields, obligatoryFields) {
    return obligatoryFields.filter(field => !fields.includes(field));
}

exports.handler = async (event) => {
    console.log('EVENT', event)
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
        let obligatoryFields = ['newName', 'newEmail', 'newNumber', 'newAge']
        const { email } = event.pathParameters;
        let data = JSON.parse(event.body);

        if (!event.pathParameters || !email) {
            return createResponse(200, constants.error_messages.business_errors.missing_parameters);
        }

        let missingFields = findMissingObligatoryFields(Object.getOwnPropertyNames(data), obligatoryFields);
        if (missingFields.length > 0) {
            return createResponse(200, { message: 'Faltan campos obligatorios: ' + missingFields.join(', ') });
        }

        let verifyOldEmail = await mysqlDB.userExistsInDB(connection, email);
        if (!verifyOldEmail) {
            return createResponse(200, constants.error_messages.business_errors.incorrect_email);
        }

        if (data.newEmail !== email) {
            let verifyNewEmail = await mysqlDB.userExistsInDB(connection, data.newEmail);
            if (verifyNewEmail) {
                return createResponse(200, constants.error_messages.business_errors.user_already_exist);
            }
        }
        
        const newUserDB = await mysqlDB.editUser(connection, data, email);
        console.log('newUserDB', newUserDB)

        return createResponse(200,
            createSuccesfulObjectResponse(
                constants.succesfull_response.success_edit,
            )
        );

    } catch (e) {
        console.error('Entra catch, error interno del servidor:', e);
        return createResponse(500, constants.error_messages.business_errors.internal_server_error);
    }
}