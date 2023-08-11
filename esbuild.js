const {build} = require('esbuild')

//@ts-check
/** @typedef {import('esbuild').BuildOptions} BuildOptions **/

/** @type BuildOptions */ const config = {
    bundle: true,
    minify: process.env.NODE_ENV === 'production',
    sourcemap: process.env.NODE_ENV !== 'production',
    external: ['vscode', 'fs'],
};

(async () => {
    try {
        await build({
            ...config,
            target: 'esnext',
            platform: 'node',
            mainFields: ['module', 'main'],
            format: 'cjs',
            entryPoints: ['./src/extension.ts'],
            outfile: './out/extension.js',
        })

        await build({
            ...config,
            target: 'esnext',
            platform: 'node',
            format: 'esm',
            entryPoints: {
                SlkGrid: 'src/slk/js/main.ts',
                BinaryEditor: 'src/binary/js/main.ts',
            },
            outdir: 'out',
        })
        console.log('build complete')
    } catch (err) {
        process.stderr.write(err.stderr)
        process.exit(1)
    }
})()
