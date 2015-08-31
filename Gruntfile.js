/**
 * Grunt project configuration.
 */
module.exports = function(grunt) {
    // configuration for the plugins.
    grunt.initConfig({
        clean: {
            dist : [
                "lib/"
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
                        "node_modules/dts-generator/node_modules/typescript/bin/lib.core.d.ts",
                        "node_modules/dts-generator/node_modules/typescript/bin/lib.core.es6.d.ts",
                        "node_modules/dts-generator/node_modules/typescript/bin/lib.dom.d.ts",
                        "node_modules/dts-generator/node_modules/typescript/bin/lib.d.ts",
                        "node_modules/dts-generator/node_modules/typescript/bin/lib.es6.d.ts",
                        "node_modules/dts-generator/node_modules/typescript/bin/lib.scriptHost.d.ts",
                        "node_modules/dts-generator/node_modules/typescript/bin/lib.webworker.d.ts",
                        "node_modules/dts-generator/node_modules/typescript/bin/typescript.d.ts",
                        "node_modules/dts-generator/node_modules/typescript/bin/typescript_internal.d.ts",
                        "node_modules/dts-generator/node_modules/typescript/bin/typescriptServices.d.ts",
                        "node_modules/dts-generator/node_modules/typescript/bin/typescriptServices_internal.d.ts"
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
        }
    });

    // load NPM tasks:
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("dts-generator");

    // register our tasks:
    grunt.registerTask("default", ["clean", "typescript", "dtsGenerator"]);
};
