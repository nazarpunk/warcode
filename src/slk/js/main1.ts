import {
    provideVSCodeDesignSystem,
    vsCodeDataGrid,
    vsCodeDataGridCell,
    vsCodeDataGridRow,
    DataGrid,
    DataGridCell,
} from '@vscode/webview-ui-toolkit'

provideVSCodeDesignSystem().register(vsCodeDataGrid(), vsCodeDataGridCell(), vsCodeDataGridRow())

window.addEventListener('load', main)

function main() {
    // Define default data grid
    const basicDataGrid = document.getElementById('basic-grid') as DataGrid


}
