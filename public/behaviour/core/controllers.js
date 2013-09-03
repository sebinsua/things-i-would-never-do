define('core/controllers', ['angularjs'], function () {
    'use strict';

    var controllers = angular.module('core/controllers', []);

    controllers.controller('Tweets', ['$scope', function ($scope) {
        $scope.value = Math.random();
    }]);

    return controllers;
});
