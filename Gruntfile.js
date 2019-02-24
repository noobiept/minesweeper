module.exports = function(grunt) {
    var root = "./";
    var dest = "./release/<%= pkg.name %> <%= pkg.version %>/";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // delete the destination folder
        clean: {
            release: [dest],
        },

        // copy the images and libraries files
        copy: {
            release: {
                expand: true,
                cwd: root,
                src: ["images/*.png", "libraries/**"],
                dest: dest,
            },
        },

        cssmin: {
            release: {
                files: [
                    {
                        expand: true,
                        cwd: root + "css",
                        src: "*.css",
                        dest: dest + "css",
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
    grunt.registerTask("default", ["clean", "copy", "cssmin"]);
};
