/**  
 * |------------------------------------------------------|
 * |@function         |@version |@date                    |
 * |                  |         |                         |
 * |------------------------------------------------------| 
*/

const mysqlDB = require('../utils/sql');
const bcrypt = require('bcryptjs');
const constants = require('../constants')
const uuid = require('uuid');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

function createResponse(statusCode, response) {
    return {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(response)
    };
}

function createSuccesfulObjectResponse(response, data = null) {
    return (successObj = {
        code: response.code,
        message: response.message,
        data: !data ? {} : data
    })
}

function createErrorObjectResponse(code, message) {
    return (errorObj = {
        code: code,
        message: message
    })
}

async function verifyPassword(password, storedHash) {
    return bcrypt.compare(password, storedHash);
}

exports.handler = async (event) => {
    console.log('EVENT', event);

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

        if (!event.queryStringParameters) {
            return createResponse(200, constants.error_messages.business_errors.missing_query_parameters);
        }

        const { email, password } = event.queryStringParameters;

        if (!email || !password) {
            return createResponse(200, constants.error_messages.business_errors.missing_parameters);
        }

        let existUserName = await mysqlDB.userExistsInDB(connection, email);
        if (!existUserName) {
            return createResponse(200, constants.error_messages.business_errors.incorrect_email);
        }

        const userExistsResult = await mysqlDB.getUser(connection, email);

        if (!userExistsResult || !await verifyPassword(password, userExistsResult.PASSWORD)) {
            return createResponse(200, constants.error_messages.business_errors.incorrect_password);
        }

        const userData = makeUserResponse(userExistsResult);
        return createResponse(200,
            createSuccesfulObjectResponse(
                constants.succesfull_response.success_login,
                userData
            )
        );
    } catch (e) {
        console.error('Entra catch, error interno del servidor:', e);
        return createResponse(500, constants.error_messages.business_errors.internal_server_error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

function makeUserResponse(user) {
    const userResponse = {
        sessionKey: uuid.v4(),
        user: {
            userName: user.NAME,
            userAge: user.EDAD,
            userEmail: user.EMAIL,
            userBirthdate: user.FECHA_NACIMIENTO,
            userIdentification: user.NUMERO_IDENTIFICACION,
            userPhone: user.TELEFONO,
        }
    };
    return userResponse;
}
