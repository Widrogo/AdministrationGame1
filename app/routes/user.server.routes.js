/**
 * Created by Widrogo on 28/11/2015.
 */
//obtenemos el modelo UserModel con toda la funcionalidad
var UserModel = require('../models/user.server.model');
var jwt = require('jsonwebtoken');
var superSecret = 'ilovesescucharrockandrollandthesuperlifeinstarcraft';
//creamos el ruteo de la aplicación

module.exports = function(app, apiRouter)
{
    //API Router
    /*
     * Methodos para la api users
     *
     */
    //obtenemos el modelo UserModel con toda la funcionalidad
    apiRouter.get("/user/update/:id", function(req, res){
        var id = req.params.id;
        //solo actualizamos si la id es un número
        if(!isNaN(id))
        {
            UserModel.getUser(id,function(error, data)
            {
                //si existe el usuario mostramos el formulario
                if (typeof data !== 'undefined' && data.length > 0)
                {
                    res.render("index",{
                        title : "Formulario",
                        info : data
                    });
                }
                //en otro caso mostramos un error
                else
                {
                    res.json(404,{"msg":"notExist"});
                }
            });
        }
        //si la id no es numerica mostramos un error de servidor
        else
        {
            res.json(500,{"msg":"The id must be numeric"});
        }
    });

    //formulario para crear un nuevo usuario
    apiRouter.get("/create", function(req, res){
        res.render("new",{
            title : "Formulario para crear un nuevo recurso"
        });
    });

    //formulario para eliminar un usuario
    apiRouter.get("/delete", function(req, res){
        res.render("delete",{
            title : "Formulario para eliminar un recurso"
        });
    });

    //mostramos todos los usuarios
    apiRouter.get("/users", function(req,res){
        UserModel.getUsers(function(error, data)
        {
            res.json(200,data);
        });
    });

    //obtiene un usuario por su id
    apiRouter.get("/users/:id", function(req,res)
    {
        //id del usuario
        var id = req.params.id;
        //solo actualizamos si la id es un número
        if(!isNaN(id))
        {
            UserModel.getUser(id,function(error, data)
            {
                //si el usuario existe lo mostramos en formato json
                if (typeof data !== 'undefined' && data.length > 0)
                {
                    res.json(200,data);
                }
                //en otro caso mostramos una respuesta conforme no existe
                else
                {
                    res.json(404,{"msg":"notExist"});
                }
            });
        }
        //si hay algún error
        else
        {
            res.json(500,{"msg":"Error"});
        }
    });
    //obtiene un usuario por su email
    apiRouter.get("/users/:email", function(req,res)
    {
        //email del usuario
        var email = req.params.email;
        //solo actualizamos si la id es un número
        if(!isNaN(email))
        {
            UserModel.getUserEmail(email,function(error, data)
            {
                //si el usuario existe lo mostramos en formato json
                if (typeof data !== 'undefined' && data.length > 0)
                {
                    res.json(200,data);
                }
                //en otro caso mostramos una respuesta conforme no existe
                else
                {
                    res.json(404,{"msg":"notExist"});
                }
            });
        }
        //si hay algún error
        else
        {
            res.json(500,{"msg":"Error"});
        }
    });
    //crear usuario
    apiRouter.post("/users", function(req,res)
    {
        //creamos un objeto con los datos a insertar del usuario
        created = new Date();
        var userData = {
            id : null,
            email : req.body.email,
            contrasena : req.body.contrasena,
            nombre : req.body.nombre,
            date : created,
            update : null
        };
        UserModel.insertUser(userData, function(error, data)
        {
            //si el usuario se ha insertado correctamente mostramos su info
            if(data && data.insertId)
            {
                //res.redirect("/users/" + data.insertId);
                res.json(data);
            }
            else
            {
                res.json(500,{"msg":"Error"});
            }
        });
    });

//función que usa el verbo http put para actualizar usuarios
    apiRouter.put("/users", function(req,res)
    {
        //almacenamos los datos del formulario en un objeto
        var userData = {id:req.param('id'),username:req.param('username'),email:req.param('email')};
        UserModel.updateUser(userData,function(error, data)
        {
            //si el usuario se ha actualizado correctamente mostramos un mensaje
            if(data && data.msg)
            {
                res.json(200,data);
            }
            else
            {
                res.json(500,{"msg":"Error"});
            }
        });
    });

//utilizamos el verbo delete para eliminar un usuario
    apiRouter.delete("/users", function(req,res)
    {
        //id del usuario a eliminar
        var id = req.param('id');
        UserModel.deleteUser(id,function(error, data)
        {
            if(data && data.msg === "deleted" || data.msg === "notExist")
            {
                res.json(200,data);
            }
            else
            {
                res.json(500,{"msg":"Error"});
            }
        });
    });
    apiRouter.post("/authenticate", function(req, res)
    {
        var userData = {
            email : req.body.email,
            contrasena : req.body.contrasena
        };
        if(userData.email == '' || userData.contrasena == '' || userData.email == undefined || userData.contrasena == undefined){
            res.json({
                success: false,
                message: 'Autentificacion fallo. Usuario no encontrado.'
            });
        } else if (userData) {
            var validPassword = UserModel.compareUser(userData, function(error, data)
            {
                if(data && data.msg === "contrasena correcta")
                {
                    console.log(data)
                    var token = jwt.sign({
                        id: data.id,
                        email: data.email
                    }, superSecret, {
                        expiresIn: 1440 // expires in 24 hours
                    });
                    res.json({
                        success: true,
                        message: 'token activado!',
                        token: token
                    });
                }
                else
                {
                    if (!validPassword) {
                        res.json({
                            success: false,
                            message: 'Autentificacion fallo. Contraseña mal.'
                        });
                    }
                }
            });

        }
    });

    apiRouter.use(function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, superSecret, function(err, decoded) {
                if (err) {
                    return res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
        // next() used to be here
    });

    // api endpoint to get user information
    apiRouter.get('/me', function(req, res) {
        res.send(req.decoded);
    });
    apiRouter.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });
    app.use('/api', apiRouter);
    return apiRouter;
};