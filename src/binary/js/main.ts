import {AcquireVscodeApi} from '../../utils/editor/model/acquire-vscode-api'
import BinaryMessage from '../model/binary-message'
import {ParsedPath} from 'path'
import {W3abdhqtu} from '../parser/w3abdhqtu/w3abdhqtu'
import {DataReader} from '../utils/data-reader/data-reader'

{
    // @ts-ignore
    const vscode: AcquireVscodeApi = acquireVsCodeApi()

    const read = (list: Uint8Array, p: ParsedPath) => {
        document.body.textContent = ''

        const view = new DataReader(document, list)

        let errors: Error[] = []

        switch (p.ext) {
            case '.w3a':
            case '.w3d':
            case '.w3q':
                errors = (new W3abdhqtu(view, true)).errors
                break
            case '.w3b':
            case '.w3h':
            case '.w3t':
            case '.w3u':
                errors = (new W3abdhqtu(view, false)).errors
                break
            default:
                document.body.textContent = 'Unexpected file!'
        }

        // errors
        if (errors.length > 0) for (const error of errors) {
            //console.log(error)
            const div = document.createElement('div')
            div.textContent = error.message
            document.body.appendChild(div)
        }
    }

    window.addEventListener('message', async e => {
        const {type, body} = e.data
        switch (type) {
            case 'init': {
                //console.log('init')
            }
            // eslint-disable-next-line no-fallthrough
            case 'update': {
                read(body.value, body.path)
                return
            }
            case 'getFileData': {
                console.log('getFileData')
                return
            }
        }
    })

    vscode.postMessage({type: BinaryMessage.ready})
}
