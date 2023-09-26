import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'


/** @typedef {import('vite').UserConfig} UserConfig  */

// noinspection JSUnusedGlobalSymbols
/** */
export default defineConfig(() => {
    switch (process.env.v) {
        case 'ext':
            return {
                build: {
                    outDir: 'out',
                    target: 'esnext',
                    emptyOutDir: true,
                    rollupOptions: {
                        external: ['vscode', 'fs', 'path', 'process'],
                        preserveEntrySignatures: 'strict',
                        input: {
                            extension: 'src/extension.ts',
                        },
                        output: {
                            format: 'commonjs',
                            entryFileNames: '[name].js',
                        }
                    }
                }
            }
        case 'bin':
            return {
                build: {
                    emptyOutDir: false,
                    outDir: 'out',
                    target: 'esnext',
                    rollupOptions: {
                        external: ['vscode', 'fs', 'path', 'process'],
                        preserveEntrySignatures: 'strict',
                        input: {
                            binary: 'src/binary/webview/main.ts',
                        },
                        output: {
                            format: 'commonjs',
                            entryFileNames: '[name].js',
                        }
                    }
                }
            }
        case 'slk':
            return {
                plugins: [react()],
                build: {
                    emptyOutDir: false,
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
    }
})
