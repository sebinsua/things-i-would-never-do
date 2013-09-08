define('core/controllers', ['angularjs'], function () {
    'use strict';

    var controllers = angular.module('core/controllers', []);

    controllers.controller('TwitterCtrl', ['$scope', 'twitter', function ($scope, twitter) {
        $scope.tweets = [];

        $scope.statusClass = "status"
        $scope.statusMessage = "Loading tweets...";

        twitter.query().success(function (tweets) {
            $scope.tweets = tweets;
        }).error(function (err) {
            $scope.statusClass = "error";
            $scope.statusMessage = "Error loading tweets."
        });
    }]);

    return controllers;
});
