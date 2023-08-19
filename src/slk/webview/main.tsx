import {StrictMode, useCallback, useRef, useState} from 'react'
import {createRoot} from 'react-dom/client'

import '@glideapps/glide-data-grid/dist/index.css'
import './main.css'

import SlkPostMessage from '../model/slk-post-message'
import {Slk} from '../parser/Slk'
import {AcquireVscodeApi} from '../../utils/editor/model/acquire-vscode-api'

import {DataEditor, DataEditorRef, GridCell, GridCellKind, GridColumn, Item} from '@glideapps/glide-data-grid'

// @ts-ignore
const vscode: AcquireVscodeApi = acquireVsCodeApi()

const App = ({slk}: { slk: Slk }) => {
    const ref = useRef<DataEditorRef | null>(null)

    const dataRef = useRef<Record<any, any>[]>((() => {
        const out: Record<any, any>[] = []
        for (const list of slk.list) {
            const obj: Record<any, any> = {}
            out.push(obj)
            for (let i = 0; i < slk.header!.length; i++) {
                obj[i] = list[i]
            }
        }
        return out
    })())

    // https://github.com/quicktype/glide-data-grid/blob/main/packages/core/API.md#gridcell
    const getCellContent = useCallback((cell: Item): GridCell => {
        const [col, row] = cell
        const dataRow = dataRef.current[row]
        const d = (dataRow?.[col] ?? '').toString()
        return {
            kind: GridCellKind.Text,
            allowOverlay: false,
            readonly: true,
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

    return <DataEditor
        ref={ref}
        columns={cols}
        getCellContent={getCellContent}
        width="100%"
        height="100%"
        rows={dataRef.current.length}
        rowMarkers="both"
        showMinimap={true}
        maxColumnAutoWidth={500}
        onColumnResize={onColumnResize}
        maxColumnWidth={2000}
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
