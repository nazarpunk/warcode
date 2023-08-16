import '@glideapps/glide-data-grid/dist/index.css'

import {
    DataEditor,
    GridCell,
    GridCellKind,
    GridColumn,
    Item
} from '@glideapps/glide-data-grid'

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

// Grid columns may also provide icon, overlayIcon, menu, style, and theme overrides
const columns: GridColumn[] = [
    {title: 'First Name', width: 100},
    {title: 'Last Name', width: 100}
]

// If fetching data is slow you can use the DataEditor ref to send updates for cells
// once data is loaded.
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

export default function App() {
    return <DataEditor columns={columns} getCellContent={getData} rows={data.length}/>
}
