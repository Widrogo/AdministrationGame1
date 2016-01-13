/**
 * Created by Widrogo on 28/11/2015.
 */
(function(){
    angular.module('myApp', [
        'ngAnimate',
        'app.routes',
        'mainCtrl',
        'userCtrl',
        'mapCtrl',
        'paginaCtrl',
        'categoriaCtrl',
        'presentacionCtrl',
        'contenidoCtrl',
        'userService',
        'paginaService',
        'categoriaService',
        'presentacionService',
        'contenidoService',
        'notaService',
        'authService'
    ])
    // application configuration to integrate token into requests
    .config(function($httpProvider) {
        // attach our auth interceptor to the http requests
        $httpProvider.interceptors.push('AuthInterceptor');
    });
})();