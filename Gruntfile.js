const Path = require("path");
const Fs = require("fs");

const Package = JSON.parse(Fs.readFileSync("package.json", "utf8"));
const ROOT = "./";
const DEST = `./release/${Package.name} ${Package.version}/`;

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // delete the destination folder and the previously compiled javascript files
        clean: {
            release: [DEST, Path.join(ROOT, "scripts/**/*.js")],
            libraries: [Path.join(ROOT, "libraries/**")],
        },

        // copy the images and libraries files
        copy: {
            libraries: {
                files: [
                    {
                        expand: true,
                        cwd: Path.join(ROOT, "node_modules/easeljs/lib/"),
                        src: "easeljs.min.js",
                        dest: Path.join(ROOT, "libraries/"),
                    },
                    {
                        expand: true,
                        cwd: Path.join(ROOT, "node_modules/preloadjs/lib/"),
                        src: "preloadjs.min.js",
                        dest: Path.join(ROOT, "libraries/"),
                    },
                ],
            },
            release: {
                expand: true,
                cwd: ROOT,
                src: ["images/*.png", "libraries/**"],
                dest: DEST,
            },
        },

        cssmin: {
            release: {
                files: [
                    {
                        expand: true,
                        cwd: ROOT + "css",
                        src: "*.css",
                        dest: DEST + "css",
                    },
                ],
            },
            options: {
                advanced: false,
            },
        },
    });

    // load the plugins
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-clean");

    // tasks
    grunt.registerTask("update_libraries", [
        "clean:libraries",
        "copy:libraries",
    ]);
    grunt.registerTask("default", ["clean", "copy", "cssmin"]);
};
