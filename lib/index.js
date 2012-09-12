"use strict";

var path = require("path"),
    fs = require("fs"),
    fsHelpers =  require("fshelpers"),
    Finder = fsHelpers.Finder;

/**
 * Release have of your source - every second line - as open-source
 * Simply pass your source and target-dir and you are done!
 *
 * Example: halfSource(path.resolve(__dirname, "../test/src"), path.resolve(__dirname,"../test/dest"));
 *
 * @param {!String} sourceDir
 * @param {!String} targetDir
 */
function halfSource(sourceDir, targetDir) {

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

module.exports = halfSource;