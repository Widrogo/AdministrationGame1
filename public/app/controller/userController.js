/**
 * Created by Widrogo on 29/11/2015.
 */
(function(){
    angular.module('userCtrl', ['userService','ngFileUpload'])
        // create a controller and inject the Stuff factory
        .controller('userController', function(User) {
            var vm = this;
            // set a processing variable to show loading things
            vm.processing = true;
            // get all the stuff
            User.all()
                // promise object
                .success(function(data) {
                    // when all the users come back, remove the processing variable
                    vm.processing = false;
                    // bind the data to a controller variable
                    // this comes from the stuffService
                    vm.user = data;
                });
        })
        .controller('userSingleController', function ($scope, $routeParams, User) {
            var Id = $routeParams.id;
            $scope.data = {};
            $scope.data = User.get(Id).success(function(datos){
                $scope.data = datos;
            });

        })
        .controller('userCreateController', function(User, $scope, $location, Upload) {
            var vm = this;
            var userData = {};

            vm.submit = function(){
                if (vm.upload_form.file.$valid && vm.file) {
                    $scope.processing = true;
                    $scope.message = '';
                    vm.upload(vm.file, vm.nombre, vm.email, vm.contrasena);
                } else if  (vm.nombre_contenido != '' && vm.texto != ''){
                    vm.message_error = 'No se subio revise los datos';
                    console.log('sdasdasdas');
                } else {
                    console.log('subir');
                }
            };


            vm.upload = function (file, nombre, email, contrasena) {
                Upload.upload({
                    url: '/api/upload', //webAPI exposed to upload the file
                    data:{
                        file: file
                    } //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
                    if(resp.data.error_code === 0) { //validate success
                        var img = '/assets/img/uploads/' + resp.data.storage;
                        userData = {
                            email: email,
                            contrasena: contrasena,
                            nombre: nombre,
                            foto_perfil: img
                        }
                        User.create(userData)
                            .success(function(data) {
                                $scope.processing = false;
                                $scope.email = '';
                                $scope.contrasena = '';
                                $scope.nombre = '';
                                $scope.message = 'Usuario Creado exitosamente';
                                //$location.path('/users'+data.insertId);
                            });
                    } else {
                        console.log('No se puede Procesar la imagen hubo un error');
                    }
                }, function (resp) { //catch error
                    console.log('Error status: ' + resp.status);

                }, function (evt) {
                    console.log(evt);
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                });
            };
        })
        .controller('userEditController', function($routeParams, User) {
            var vm = this;
            // variable to hide/show elements of the view
            // differentiates between create or edit pages
            vm.type = 'edit';
            // get the user data for the user you want to edit
            // $routeParams is the way we grab data from the URL
            User.get($routeParams.user_id)
                .success(function(data) {
                    vm.userData = data;
                });
            // function to save the user
            vm.saveUser = function() {
                vm.processing = true;
                vm.message = '';
                // call the userService function to update
                User.update($routeParams.user_id, vm.userData)
                .success(function(data) {
                    vm.processing = false;
                    // clear the form
                    vm.userData = {};
                    // bind the message from our API to vm.message
                    vm.message = data.message;
                });
            };
        });
})();
