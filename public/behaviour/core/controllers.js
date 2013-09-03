define(['angularjs'], function () {
    'use strict';

    var controllers = angular.module('controllers', []);

    controllers.controller('Tweets', ['$scope', function ($scope) {
        $scope.value = "word";
    }]);

    return controllers;
});
