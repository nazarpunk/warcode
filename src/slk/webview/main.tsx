import {StrictMode, useCallback, useRef, useState} from 'react'
import {createRoot} from 'react-dom/client'

import '@glideapps/glide-data-grid/dist/index.css'
import './main.css'

import SlkPostMessage from '../model/slk-post-message'
import {Slk, SlkValue} from '../parser/Slk'
import {AcquireVscodeApi} from '../../utils/editor/model/acquire-vscode-api'

import {
    DataEditor,
    DataEditorRef,
    EditableGridCell,
    GridCell,
    GridCellKind,
    GridColumn,
    Item
} from '@glideapps/glide-data-grid'
import GetDataGridTheme from '../../utils/data-grid/data-grid-theme'

// @ts-ignore
const vscode: AcquireVscodeApi = acquireVsCodeApi()

const App = ({slk}: { slk: Slk }) => {
    const ref = useRef<DataEditorRef | null>(null)

    // https://github.com/quicktype/glide-data-grid/blob/main/packages/core/API.md#gridcell
    const getCellContent = useCallback((cell: Item): GridCell => {
        const [col, row] = cell
        const d = (slk.list[row][col] ?? '').toString()
        return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            displayData: d as string,
            data: d as string,
        }
    }, [])

    const columns = (): GridColumn[] => {
        const list: GridColumn[] = []
        for (let i = 0; i < slk.header!.length; i++) {
            list.push(
                {
                    title: slk.header![i]!.toString(),
                    id: i.toString(),
                },
            )
        }
        return list
    }

    const [cols, setCols] = useState(() => columns())

    const onColumnResize = useCallback((column: GridColumn, newSize: number) => {
        const list: GridColumn[] = []
        for (const c of cols) {
            if (c.id === column.id) (c as { width: number }).width = newSize
            list.push(c)
        }
        setCols(list)
    }, [])

    const onCellEdited = useCallback((cell: Item, value: EditableGridCell) => {
        const [col, row] = cell
        slk.list[row][col] = value.data as SlkValue
        vscode.postMessage({type: SlkPostMessage.update, content: slk.content})
    }, [])

    return <DataEditor
        ref={ref}
        columns={cols}
        getCellContent={getCellContent}
        width="100%"
        height="100%"
        rows={slk.list.length}
        rowMarkers="both"
        showMinimap={true}
        maxColumnAutoWidth={500}
        onColumnResize={onColumnResize}
        onCellEdited={onCellEdited}
        maxColumnWidth={2000}
        theme={GetDataGridTheme()}
    />
}

const onInit = (event: MessageEvent) => {
    if (event.data.type !== SlkPostMessage.init) return
    window.removeEventListener('message', onInit)
    const slk = new Slk(event.data.text)

    if (slk.errors.length > 0) {
        for (const error of slk.errors) vscode.postMessage({type: SlkPostMessage.error, data: error.message})
        return
    }

    if (!slk.header) {
        vscode.postMessage({type: SlkPostMessage.error, data: 'Missing header.'})
        return
    }

    createRoot(document.body.firstElementChild!).render(
        <StrictMode>
            <App slk={slk}></App>
        </StrictMode>
    )
}
window.addEventListener('message', onInit)
