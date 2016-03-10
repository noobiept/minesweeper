module.exports = function( grunt )
{
var root = '../';
var dest = '../release/<%= pkg.name %> <%= pkg.version %>/';

grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

        eslint: {
            options: {
                configFile: root + '.eslintrc.json'
            },
            target: [ root + 'js' ]
        },

            // delete the destination folder
        clean: {
            options: {
                force: true
            },
            release: [
                dest
            ]
        },

            // copy the images and libraries files
        copy: {
            release: {
                expand: true,
                cwd: root,
                src: [
                    'images/*.png',
                    'libraries/**',
                    'background.js',
                    'manifest.json'
                ],
                dest: dest
            }
        },

        uglify: {
            release: {
                files: {
                    '../release/<%= pkg.name %> <%= pkg.version %>/min.js': [
                            // the order matters, since some classes inherit from others, so the base ones need to be defined first
                            // this is based on the order in index.html
                        '../scripts/utilities.js',
                        '../scripts/square.js',
                        '../scripts/timer.js',
                        '../scripts/high_score.js',
                        '../scripts/grid.js',
                        '../scripts/minesweeper.js',
                        '../scripts/main.js'
                    ]
                }
            }
        },

        cssmin: {
            release: {
                files: [{
                    expand: true,
                    cwd: root + 'css',
                    src: '*.css',
                    dest: dest + 'css'
                }]
            }
        },

        processhtml: {
            release: {
                files: [{
                    expand: true,
                    cwd: root,
                    src: 'index.html',
                    dest: dest
                }]
            }
        }
    });

    // load the plugins
grunt.loadNpmTasks( 'grunt-contrib-copy' );
grunt.loadNpmTasks( 'grunt-contrib-uglify' );
grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
grunt.loadNpmTasks( 'grunt-contrib-clean' );
grunt.loadNpmTasks( 'grunt-processhtml' );

    // tasks
grunt.registerTask( 'default', [ 'eslint', 'clean', 'copy', 'uglify', 'cssmin', 'processhtml' ] );
};