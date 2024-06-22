/**  
 * |------------------------------------------------------|
 * |@function         |@version |@date                    |
 * |                  |         |                         |
 * |------------------------------------------------------| 
*/

const mysqlDB = require('../utils/recipesSql');
const constants = require('../constants')

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

function createSuccesfulObjectResponse(response, data = null){
    return (successObj = {
       message: response.message,
       data: !data ? {}: data
    })
}

exports.handler = async (event) => {

    console.log('EVENT', event)
    try {

        const connectionConfig = {
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            port: DB_PORT
        };

        let connection;

        connection = await mysqlDB.createConnection(connectionConfig);

        const allRecipes = await mysqlDB.getAllRecipes(connection);

        console.log('Recetas ', allRecipes)

        if (connection) {
            await connection.end();
        }

        return createResponse(
            200,
            createSuccesfulObjectResponse(
                constants.recipes_response.get_all_recipies_correct.message,
                allRecipes
            )
        )

    } catch (e){
        console.error('Entra catch, error interno del servidor:', e);
        return createResponse(500, constants.error_messages.business_errors.internal_server_error);
    } 
}