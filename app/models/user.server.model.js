//creamos un objeto para ir almacenando todo lo que necesitemos
var userModel = {};
var config = require('./../../config');
var connection = config.iniciar_conexcion();
var bcrypt = require('bcrypt-nodejs');
//obtenemos todos los usuarios
userModel.getUsers = function(callback)
{
    if (connection)
    {
        connection.query('SELECT * FROM usuarios ORDER BY id', function(error, rows) {
            if(error)
            {
                throw error;
            }
            else
            {
                callback(null, rows);
            }
        });
    }
}

//obtenemos un usuario por su id
userModel.getUser = function(id,callback)
{
    if (connection)
    {
        var sql = 'SELECT * FROM usuarios WHERE id = ' + connection.escape(id);
        connection.query(sql, function(error, row)
        {
            if(error)
            {
                throw error;
            }
            else
            {
                callback(null, row);
            }
        });
    }
}
//obtenemos un usuario por su email
userModel.getUserEmail = function(email,callback)
{
    if (connection)
    {
        var sql = 'SELECT * FROM usuarios WHERE email = ' + connection.escape(email);
        connection.query(sql, function(error, row)
        {
            if(error)
            {
                throw error;
            }
            else
            {
                callback(null, row);
            }
        });
    }
}
//añadir un nuevo usuario
userModel.insertUser = function(userData, callback)
{
    if (connection)
    {
        bcrypt.hash(userData.contrasena, null, null, function(err, hash) {
            if (err) return next(err);
            // change the password to the hashed version
            userData.contrasena = hash;
            connection.query('INSERT INTO usuarios SET ?', userData, function(error, result)
            {
                if(error)
                {
                    throw error;
                }
                else
                {
                    //devolvemos la última id insertada
                    callback(null,{"insertId" : result.insertId});
                }
            });
        });
    }
}

//actualizar un usuario
userModel.updateUser = function(userData, callback)
{
    //console.log(userData); return;
    if(connection)
    {
        var sql = 'UPDATE usuarios SET nombreusuario = ' + connection.escape(userData.username) + ',' +
            'email = ' + connection.escape(userData.email) +
            'WHERE id = ' + userData.id;

        connection.query(sql, function(error, result)
        {
            if(error)
            {
                throw error;
            }
            else
            {
                callback(null,{"msg":"success"});
            }
        });
    }
}

//eliminar un usuario pasando la id a eliminar
userModel.deleteUser = function(id, callback)
{
    if(connection)
    {
        var sqlExists = 'SELECT * FROM usuarios WHERE id = ' + connection.escape(id);
        connection.query(sqlExists, function(err, row)
        {
            //si existe la id del usuario a eliminar
            if(row)
            {
                var sql = 'DELETE FROM usuarios WHERE id = ' + connection.escape(id);
                connection.query(sql, function(error, result)
                {
                    if(error)
                    {
                        throw error;
                    }
                    else
                    {
                        callback(null,{"msg":"deleted"});
                    }
                });
            }
            else
            {
                callback(null,{"msg":"notExist"});
            }
        });
    }
}

userModel.compareUser = function(userData, callback){
    if(connection) {
        var sqlExists = 'SELECT * FROM usuarios WHERE email = ' + connection.escape(userData.email);
        connection.query(sqlExists, function (err, result) {
            //si existe la id del usuario a comparar
            if (result) {
                if (bcrypt.compareSync(userData.contrasena, result['0'].contrasena)){
                    callback(null, {"msg": "contrasena correcta", "id": result['0'].id, "email": result['0'].email});
                }else{
                    callback(null, {"msg": "contrasena incorrecta"});
                }
            }
            else {
                callback(null, {"msg": "not Exist email"});
            }
        });
    }
};

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = userModel;