
fast-live-reload -ep "tsc --watch src/test/core/LinkedHashMapTest.ts --outdir target/test --module commonjs"\
    target/test -e "mocha target/test/test/core/LinkedHashMapTest.js"

