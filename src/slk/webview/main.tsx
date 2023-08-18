import {Component, FC, StrictMode, useEffect, useRef, useState} from 'react'
import {createRoot} from 'react-dom/client'

import '@glideapps/glide-data-grid/dist/index.css'
import './main.css'

import SlkPostMessage from '../model/slk-post-message'
import {Slk} from '../parser/Slk'
import {AcquireVscodeApi} from '../../utils/editor/model/acquire-vscode-api'

import {
    DataEditor, DataEditorRef,
    GridCell,
    GridCellKind,
    GridColumn,
    Item
} from '@glideapps/glide-data-grid'

// @ts-ignore
const vscode: AcquireVscodeApi = acquireVsCodeApi()

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

    console.log('---- update')

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

const data = [
    {
        firstName: 'John',
        lastName: 'Doe'
    },
    {
        firstName: 'Maria',
        lastName: 'Garcia'
    },
    {
        firstName: 'Nancy',
        lastName: 'Jones'
    },
    {
        firstName: 'James',
        lastName: 'Smith'
    }
]

function getData([col, row]: Item): GridCell {
    const person = data[row]

    if (col === 0) {
        return {
            kind: GridCellKind.Text,
            data: person.firstName,
            allowOverlay: false,
            displayData: person.firstName
        }
    } else if (col === 1) {
        return {
            kind: GridCellKind.Text,
            data: person.lastName,
            allowOverlay: false,
            displayData: person.lastName
        }
    } else {
        throw new Error()
    }
}

const columns: GridColumn[] = [
    {title: 'First Name', width: 100},
    {title: 'Last Name', width: 100}
]

const Example: FC = () => {
    const ref = useRef<DataEditorRef | null>(null)

    console.log('+++++++ render')

    //data[0].firstName = 'Fuck!!!!!'
    //ref.current?.updateCells([{cell: [0, 0]}])

    return <DataEditor
        ref={ref}
        columns={columns}
        getCellContent={getData}
        width="100%"
        height="100%"
        rows={data.length}
        theme={{
            accentColor: '#8c96ff',
            accentLight: 'rgba(202, 206, 255, 0.253)',

            textDark: '#ffffff',
            textMedium: '#b8b8b8',
            textLight: '#a0a0a0',
            textBubble: '#ffffff',

            bgIconHeader: '#b8b8b8',
            fgIconHeader: '#000000',
            textHeader: '#a1a1a1',
            textHeaderSelected: '#000000',

            bgCell: '#16161b',
            bgCellMedium: '#202027',
            bgHeader: '#212121',
            bgHeaderHasFocus: '#474747',
            bgHeaderHovered: '#404040',

            bgBubble: '#212121',
            bgBubbleSelected: '#000000',

            bgSearchResult: '#423c24',

            borderColor: 'rgba(225,225,225,0.2)',
            drilldownBorder: 'rgba(225,225,225,0.4)',

            linkColor: '#4F5DFF',

            headerFontStyle: 'bold 14px',
            baseFontStyle: '13px',
        }}
    />
}

createRoot(document.getElementById('app')!).render(
    <StrictMode>
        <Example></Example>
    </StrictMode>
)
