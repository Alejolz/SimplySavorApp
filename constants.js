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
        incorrect_email: {
            code: 'BE03',
            message: 'Email incorrecto'
        },
        incorrect_password: {
            code: 'BE04',
            message: 'Contraseña incorrecta'
        },
        missing_query_parameters: {
            code: 'BE05',
            message: 'No se proporcionaron parámetros en el query string'
        },
        user_already_exist: {
            code: 'BE06',
            message: 'Email ya se encuentra registrado'
        },
        
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

module.exports.recipes_response = {
    get_all_recipies_correct: {
        message: 'Se obtuvo la lista de recetas correctamente'
    }
}