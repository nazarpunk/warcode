import SlkPostMessage from '../model/slk-post-message'
import {Slk} from '../parser/Slk'
import {AcquireVscodeApi} from '../../utils/editor/model/acquire-vscode-api'
import {ColumnDefinition, TabulatorFull as Tabulator} from 'tabulator-tables'

// @ts-ignore
const vscode: AcquireVscodeApi = acquireVsCodeApi()

const table = new Tabulator('#slk-table', {
    height: '100%',
    layout: 'fitDataFill',
    maxHeight: '100%',
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

    // columns
    const columns: ColumnDefinition[] = []
    for (const item of slk.header) {
        columns.push({title: item as string, field: item as string})
    }
    table.setColumns(columns)

    // data
    const data = []

    for (const item of slk.list) {
        const obj: Record<string, any> = {}
        for (let i = 0; i < slk.header.length; i++) {
            const index = slk.header[i]
            if (index == null) continue
            obj[index] = item[i] ?? slk.def
        }
        data.push(obj)
    }

    table.setData(data).then()
}

window.addEventListener('message', (event: MessageEvent) => {
    const message = event.data
    switch (message.type) {
        case SlkPostMessage.update:
            const text = message.text
            update(text)
            vscode.setState({text})
            return
    }
})

/*
const state = vscode.getState()
if (state) update(state.text)

 */
