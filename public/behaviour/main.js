'use strict';

define('main', ['core/app'], function (app) {
    var $d = app.angular.element(document);
    $d.ready(function () {
        app.init();
    });
});
