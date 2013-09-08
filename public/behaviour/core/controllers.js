define('core/controllers', ['angularjs'], function () {
    'use strict';

    var controllers = angular.module('core/controllers', []);

    controllers.controller('TwitterCtrl', ['$scope', 'twitter', function ($scope, twitter) {
        $scope.tweets = [];
        $scope.loadingTweets = true;
        $scope.statusMessage = "Loading tweets..."

        twitter.query().success(function (tweets) { 
            $scope.tweets = tweets;
        }).error(function (err) {
            $scope.statusMessage = "Error loading tweets."
        });
    }]);

    return controllers;
});
