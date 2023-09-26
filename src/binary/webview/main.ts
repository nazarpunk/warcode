import {AcquireVscodeApi} from '../../utils/editor/model/acquire-vscode-api'
import BinaryMessage from '../model/binary-message'
import {ParsedPath} from 'path'
import {W3abdhqtu} from '../parser/w3abdhqtu/w3abdhqtu'
import {DataReader} from '../utils/data-reader/data-reader'
import {BinaryParser} from '../parser/binary-parser'


// @ts-ignore
const vscode: AcquireVscodeApi = acquireVsCodeApi()

const read = (list: Uint8Array, p: ParsedPath) => {
    document.body.textContent = ''

    const view = new DataReader(list)

    let parser: BinaryParser | undefined = undefined

    switch (p.ext) {
        case '.w3a':
        case '.w3d':
        case '.w3q':
            parser = new W3abdhqtu(view, true)
            break
        case '.w3b':
        case '.w3h':
        case '.w3t':
        case '.w3u':
            parser = new W3abdhqtu(view, false)
            break
        default:
            document.body.textContent = 'Unexpected file!'
    }

    if (!parser) {
        document.body.textContent = 'Undefined parser!'
        return
    }

    // errors
    if (parser.errors.length > 0) for (const error of parser.errors) {
        //console.log(error)
        const div = document.createElement('div')
        div.textContent = error.message
        document.body.appendChild(div)
        return
    }

    // render
    const div = document.createElement('div')
    div.classList.add('wrap')
    parser.toHTML(document, div)
    document.body.appendChild(div)
}

window.addEventListener('message', async e => {
    const {type, body} = e.data
    switch (type) {
        case 'init': {
            console.log('init')
        }
        // eslint-disable-next-line no-fallthrough
        case 'update': {
            console.log('update')
            //read(body.value, body.path)
            return
        }
        case 'getFileData': {
            //console.log('getFileData')
            return
        }
    }
})

vscode.postMessage({type: BinaryMessage.ready})
