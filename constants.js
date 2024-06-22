module.exports.error_messages = {
    format_errors: {
       wrong_password_extension: {
            code: 'FE01',
            message: 'La contraseña no puede tener más de 120 caracteres'
       }
    },
    logic_errors: {
       
    },
    business_errors: {
        internal_server_error: {
            code: 'BE01',
            message: 'Error interno del servidor'
        },
        missing_parameters: {
            code: 'BE02',
            message: 'Se requiere email y contraseña'
        },
        incorrect_credentials: {
            code: 'BE03',
            message: 'Email o contraseña incorrectos'
        },
        missing_query_parameters: {
            code: 'BE04',
            message: 'No se proporcionaron parámetros en el query string'
        }
    }

}

module.exports.succesfull_response = {
    success_login: {
        code: 'SR01',
        message: 'Login exitoso',
    },
    success_register: {
        code: 'SR02',
        message: 'Usuario creado exitosamente'
    }
}