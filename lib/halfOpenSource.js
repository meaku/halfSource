"use strict";

var path = require("path"),
    fs = require("fs"),
    fsHelpers =  require("fshelpers"),
    Finder = fsHelpers.Finder;

function halfOpenSource(sourceDir, targetDir) {

    function onFileRead(filePath) {

        var fileSrc = fs.readFileSync(filePath, "utf-8");

        //check the destination dude!
        filePath = filePath.replace(sourceDir, targetDir);

        fsHelpers.makeDirSync(path.dirname(filePath));

        var halfSource = fileSrc.split(/\r?\n/).filter(function (str, i) { return i % 2; }).join("\n");

        fs.writeFileSync(filePath, halfSource, "utf-8");
    }

    function onError(err) {
        finder.reset(); // abort current operation
        throw err;
    }

    var finder = new Finder();

    finder
        .on("file", onFileRead)
        .on("error", onError)
        .walkSync(sourceDir, "utf-8");
}

halfOpenSource(path.resolve(__dirname, "../test/src"), path.resolve(__dirname,"../test/dest"));