import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

/** @typedef {import('vite').UserConfig} UserConfig  */

const merge = (target, source) => {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object) Object.assign(source[key], merge(target[key], source[key]))
    }
    Object.assign(target || {}, source)
    return target
}
/**
 * @param c {UserConfig}
 * @return {UserConfig}
 */
const c = c => {
    // noinspection JSValidateTypes
    /** @type {UserConfig} */
    const d = {
        build: {
            emptyOutDir: process.env.V === '1',
            outDir: 'out',
            target: 'modules',
            rollupOptions: {
                external: ['vscode', 'fs', 'path', 'process'],
                preserveEntrySignatures: 'strict',
                output: {
                    entryFileNames: '[name].js',
                }
            }
        }
    }
    return merge(d, c)
}


// noinspection JSUnusedGlobalSymbols
export default defineConfig(() => {
    switch (process.env.V) {
        case '1':
            return c({
                build: {
                    rollupOptions: {
                        input: {extension: 'src/extension.ts'},
                        output: {
                            format: 'commonjs',
                        }
                    }
                }
            })
        case '2':
            return {
                plugins: [react()],
                build: {
                    target: 'esnext',
                    outDir: 'out/slk',
                    rollupOptions: {
                        input: 'src/slk/webview/main.tsx',
                        output: {
                            entryFileNames: `[name].js`,
                            chunkFileNames: `[name].js`,
                            assetFileNames: `[name].[ext]`,
                        },
                    },
                },
            }
        case '3':
            return c({
                build: {
                    rollupOptions: {
                        input: {BinaryEditor: 'src/binary/js/main.ts'},
                        output: {
                            format: 'cjs'
                        }
                    }
                }
            })
    }
})
