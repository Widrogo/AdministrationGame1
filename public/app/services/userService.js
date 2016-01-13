/**
 * Created by Widrogo on 29/11/2015.
 */
(function() {
    var app = angular.module('userService', []);
        app.factory('User', function($http){
            var userFactory = {};
            //get a single user
            userFactory.get = function(id) {
                return $http.get('/api/users/' + id);
            };
            userFactory.getMe = function() {
                return $http.get('/api/me/');
            };
            // get all users
            userFactory.all = function() {
                return $http.get('/api/users/');
            };
            // create a user
            userFactory.create = function(userData) {
                return $http.post('/api/users/', userData);
            };
            // update a user
            userFactory.update = function(id, userData) {
                return $http.put('/api/users/' + id, userData);
            };
            // delete a user
            userFactory.delete = function(id) {
                return $http.delete('/api/users/' + id);
            };
            // return our entire userFactory object
            return userFactory;
        });
})();
