import SlkPostMessage from '../model/slk-post-message'
import {Slk} from '../parser/Slk'
import {AcquireVscodeApi} from '../../utils/editor/model/acquire-vscode-api'
import DataGridXLTheme from '../../utils/datagrid/theme'

// @ts-ignore
const vscode: AcquireVscodeApi = acquireVsCodeApi()

const grid = new DataGridXL('slk-table', {
    data: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 5, 6]
    ],
    theme: DataGridXLTheme
})

const update = (text: string) => {
    const slk = new Slk(text)

    if (slk.errors.length > 0) {
        for (const error of slk.errors) vscode.postMessage({type: SlkPostMessage.error, data: error.message})
        return
    }

    if (!slk.header) {
        vscode.postMessage({type: SlkPostMessage.error, data: 'Missing header.'})
        return
    }


}

window.addEventListener('message', (event: MessageEvent) => {
    const message = event.data
    switch (message.type) {
        case SlkPostMessage.update:
            update(message.text)
            return
    }
})

const state = vscode.getState()
if (state) update(state.text)
