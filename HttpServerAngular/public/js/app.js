'use strict';
var app = angular.module('app', ['ngRoute', 'controllers', 'directives']);

/**
 * app config route
 ***************************/

app.config(['$routeProvider',
    function($routeProvider) {
        var path = 'views/';
        $routeProvider.
            when('/Home', {
                templateUrl: path + 'Home.html',
                controller: 'masterCtrl'
            }).
            otherwise({
                redirectTo: '/Home',
            });
    }
]);
