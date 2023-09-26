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
        const abilityData = [
            'alias',
            'code',
            'comments',
            'version',
            'useInEditor',
            'hero',
            'item',
            'sort',
            'race',
            'checkDep',
            'levels',
            'reqLevel',
            'levelSkip',
            'priority',
            'targs1', 'Cast1', 'Dur1', 'HeroDur1', 'Cool1', 'Cost1', 'Area1', 'Rng1', 'DataA1', 'DataB1', 'DataC1', 'DataD1', 'DataE1', 'DataF1', 'DataG1', 'DataH1', 'DataI1', 'UnitID1', 'BuffID1', 'EfctID1',
            'targs2', 'Cast2', 'Dur2', 'HeroDur2', 'Cool2', 'Cost2', 'Area2', 'Rng2', 'DataA2', 'DataB2', 'DataC2', 'DataD2', 'DataE2', 'DataF2', 'DataG2', 'DataH2', 'DataI2', 'UnitID2', 'BuffID2', 'EfctID2',
            'targs3', 'Cast3', 'Dur3', 'HeroDur3', 'Cool3', 'Cost3', 'Area3', 'Rng3', 'DataA3', 'DataB3', 'DataC3', 'DataD3', 'DataE3', 'DataF3', 'DataG3', 'DataH3', 'DataI3', 'UnitID3', 'BuffID3', 'EfctID3',
            'targs4', 'Cast4', 'Dur4', 'HeroDur4', 'Cool4', 'Cost4', 'Area4', 'Rng4', 'DataA4', 'DataB4', 'DataC4', 'DataD4', 'DataE4', 'DataF4', 'DataG4', 'DataH4', 'DataI4', 'UnitID4', 'BuffID4', 'EfctID4',
            'InBeta'
        ]

        for (let i = 0; i < slk.header.length; i++) {
            list.push(
                {
                    title: slk.header[i]!.toString(),
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
