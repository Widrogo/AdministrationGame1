/**
 * Created by Widrogo on 28/11/2015.
 */
(function(){
    angular.module('app.routes', ['ngRoute'])
        .config(function($routeProvider, $locationProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
            $routeProvider
                .when('/', {
                    templateUrl: '/app/views/pages/home.html',
                    controller: 'MapController',
                    controllerAs: 'map'
                })
                .when('/notas', {
                    templateUrl: '/app/views/pages/notas.html',
                    controller: 'NotasController'
                })
                .when('/fastnote/:id_user', {
                    templateUrl: '/app/views/pages/notarapida.html',
                    controller: 'NotasRapidaController'
                })
                .when('/misfastnotes/:id_user', {
                    templateUrl: '/app/views/pages/nota/notebyuser.html',
                    controller: 'NotasUserController'
                })
                .when('/login', {
                    templateUrl: '/app/views/pages/login.html',
                    controller: 'mainController',
                    controllerAs: 'main'
                })
                .when('/usuario/:id', {
                    templateUrl:  '/app/views/pages/usuarios/userSingle.html',
                    controller:   'userSingleController'
                })
                //ojo para web
                .when('/users/:id', {
                    templateUrl:  '/app/views/pages/usuarios/single.html',
                    controller:   'userSingleController'
                })
                //crear usuario
                .when('/newUsuario', {
                    templateUrl:  '/app/views/pages/usuarios/crearUser.html'
                })
                .when('/pagina/:id', {
                    templateUrl:  '/app/views/pages/paginas/paginaSimple.html',
                    controller:   'paginaController'
                })
                .when('/newPagina/:presentaciones_id', {
                    templateUrl:  '/app/views/pages/paginas/crearPagina.html',
                    controller: 'crearPaginaController'
                })
                .when('/verPagina/:pagina_id', {
                    templateUrl:  '/app/views/pages/paginas/paginaSimple.html',
                    controller: 'verPaginaController'
                })
                .when('/newPresentacion', {
                    templateUrl: '/app/views/pages/presentacion/crearPresentacion.html',
                    controller: 'newPresentacionController'
                })
                .when('/presentacionUsuario/:id_user', {
                    templateUrl: '/app/views/pages/presentacion/presentacionByUser.html',
                    controller: 'userPresentacion'
                })
                .when('/newCategoria', {
                    templateUrl: '/app/views/pages/categorias/createCategoria.html',
                    controller: 'createCategoria'
                })
                .when('/newContenido/:id_pagina/presentacion/:id_presentacion', {
                    templateUrl: '/app/views/pages/contenido/crearContenido.html'
                })
                .when('/presentacion/:id_presentacion', {
                    templateUrl: '/app/views/pages/presentacion/paginaPresenacion.html',
                    controller: 'pagPresentacionController'
                });
        });
})();
