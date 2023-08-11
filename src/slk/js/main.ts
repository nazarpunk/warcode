import SlkPostMessage from '../model/slk-post-message'
import {Slk} from '../parser/Slk'
import {AcquireVscodeApi} from '../../utils/editor/model/acquire-vscode-api'
import {Tabulator} from 'tabulator-tables'

// @ts-ignore
const vscode: AcquireVscodeApi = acquireVsCodeApi()

const update = (text: string) => {

}

const updateContent1 = (text: string) => {
    document.body.textContent = ''
    const slk = new Slk(text)
    if (slk.errors.length > 0) {
        for (const error of slk.errors) {
            document.body.innerHTML += `<div>${error}</div>`
        }
        return
    }

    if (!slk.header) {
        document.body.innerHTML += '<div>Missing header</div>'
        return
    }

    const table = document.createElement('table')
    document.body.appendChild(table)

    // head
    const thead = document.createElement('thead')
    table.appendChild(thead)
    const theadRow = document.createElement('tr')
    thead.appendChild(theadRow)
    for (const v of slk.header) {
        const th = document.createElement('th')
        theadRow.appendChild(th)
        if (v) th.textContent = v.toString()
    }

    // body
    const tbody = document.createElement('tbody')
    table.appendChild(tbody)
    for (const list of slk.list) {
        const tr = document.createElement('tr')
        tbody.appendChild(tr)
        for (let i = 0; i < slk.header.length; i++) {
            const td = document.createElement('td')
            td.textContent = list?.[i]?.toString() ?? ''
            tr.appendChild(td)
        }
    }
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

const state = vscode.getState()
if (state) update(state.text)

const data = []

for (let i = 0; i < 90; i++) {
    data.push({id: i, name: 'Billy Bob', age: 'age: ' + i, gender: 'male', height: 1, col: 'red', dob: '', cheese: 1},)
}

const table = new Tabulator('#slk-table', {
    height: '100%',
    layout: 'fitDataFill',
    maxHeight: '100%',
    columns: [
        {title: 'Name', field: 'name'},
        {title: 'Age', field: 'age'},
        {title: 'Gender', field: 'gender'},
        {title: 'Height', field: 'height'},
        {title: 'Favourite Color', field: 'col'},
        {title: 'Date Of Birth', field: 'dob'},
        {title: 'Cheese Preference', field: 'cheese'},
    ],
    data: data,
})

