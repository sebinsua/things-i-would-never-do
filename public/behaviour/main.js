define('main', ['core/app', 'core/controllers'], function (app) {
    'use strict';

    for (var i = 0, moduleNames = []; i < arguments.length; i++) {
        moduleNames.push(arguments[i].name);
    }
    app.init(moduleNames);
});
