/**  
 * |------------------------------------------------------|
 * |@function         |@version |@date                    |
 * |                  |         |                         |
 * |------------------------------------------------------| 
*/


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
    try {
        const allowedUsername = 'usuario';
        const allowedPassword = 'contraseña';

        if (event.queryStringParameters) {
            const { username, password } = event.queryStringParameters;

            if (username && password) {
                if (username === allowedUsername && password === allowedPassword) {
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
        console.error(e);
        return createResponse(500, { message: 'Error interno del servidor' });
    }
};