/* jslint node: true */
'use strict';

var express = require("express"),
    stylus = require("stylus"),
    jade = require("jade"),
    nib = require("nib");

var baseDir = __dirname + "/..";

module.exports = function () {
    this.use(express.logger());

    this.engine('jade', jade.__express);
    this.set("view engine", "jade");
    this.set("views", baseDir + "/views");

    this.use(stylus.middleware(
        {
            "src":  baseDir + "/public/style/",
            "compile": function compile (str, path) {
                return stylus(str).set("filename", path).use(nib())
            }
        }
    ));
    this.use(express.static(baseDir + "/public"));
};
