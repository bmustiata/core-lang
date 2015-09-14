/**
 * Grunt project configuration.
 */
module.exports = function(grunt) {
    // configuration for the plugins.
    grunt.initConfig({
        clean: {
            dist : [
                "lib/"
            ],

            test : [
                "target/test"
            ]
        },

        typescript: {
            "dist" : {
                options: {
                    module : "commonjs",
                    sourceMap: true,
                    declaration: true,
                },
                files: [{
                    dest: "lib/",
                    src: [
                        "src/main/core/**/*.ts",
                        "src/main/core/**/*.d.ts"
                    ]
                }]
            },

            "test" : {
                options: {
                    module : "commonjs",
                    sourceMap: true,
                    declaration: true,
                },
                files: [{
                    dest: "target/test/",
                    src: [
                        "src/test/core/**/*.ts",
                        "src/test/core/**/*.d.ts"
                    ]
                }]
            }
        },

        dtsGenerator : {
            "dist" : {
                options: {
                    name: "core-lang",
                    baseDir: ".",
                    out: "core-lang.d.ts",
                    main: "core-lang/lib/Iterable",
                    excludes: [
                        "node_modules/**/*.d.ts",
                        "typings/**/*.d.ts",
                    ]
                },

                files : [
                    {
                        expand: true,
                        src: [
                            "lib/*.d.ts"
                        ]
                    }
                ]
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                    captureFile: "target/test/tests_results.txt"
                },
                src: ["target/test/**/*.js"]
            }
        }
    });

    // load NPM tasks:
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("ciplogic-dts-generator");
    grunt.loadNpmTasks("grunt-mocha-test");

    grunt.registerTask("dist", ["clean:dist", "typescript:dist", "dtsGenerator:dist"]);
    grunt.registerTask("test", ["clean:test", "typescript:test", "mochaTest:test"]);

    // register our tasks:
    grunt.registerTask("default", ["dist", "test"]);
};
