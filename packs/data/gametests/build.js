const json5 = require('json5');
const path = require('path');
const fs = require('fs');

// A simple esbuild plugin, that converts JSON5 to JSON before passing it to esbuild.
const json5Plugin = options => {
    return {
        name: 'json5',
        setup(build) {
            build.onResolve({ filter: /\.json$/ }, (args) => {
                return {
                    path: path.resolve(args.resolveDir, args.path),
                    namespace: 'json5'
                }
            })
            build.onLoad({ filter: /.*/, namespace: 'json5' }, (args) => {
                const result = fs.readFileSync(args.path, 'utf-8')
                const compiled = json5.parse(result)
                const stringed = JSON.stringify(compiled)
                return {
                    contents: stringed,
                    loader: 'json'
                }
            })
        }
    }
}

const settings = JSON.parse(process.env.settings);
const buildOptions = {...settings.buildOptions, plugins: [json5Plugin()]};

require("esbuild")
    .build(buildOptions)
    .catch((err) => {
        console.error(err.message);
        process.exit(1);
    });