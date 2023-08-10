import W3abdhqtuItemData from './w3abdhqtu-item-data'
import {DataReader} from '../../utils/data-reader/data-reader'
import {DataReaderType} from '../../utils/data-reader/data-reader-type'

export default class W3abdhqtuItem {

    constructor(
        reader: DataReader,
        parent: HTMLElement,
        adq: boolean,
        version: number
    ) {
        const div = document.createElement('div')
        div.classList.add('block')
        parent.appendChild(div)

        this.originId = reader.read(DataReaderType.id, {parent: div})
        this.customId = reader.read(DataReaderType.id, {parent: div})
        if (version >= 3) this.count = reader.read(DataReaderType.uint32le, {parent: div})

        const inner = document.createElement('div')
        inner.classList.add('block')
        div.appendChild(inner)

        for (let i = 0; i < this.count; i++) {
            this.list.push(new W3abdhqtuItemData(reader, inner, adq, version))
        }
    }

    list: W3abdhqtuItemData[] = []

    originId: number = 0
    customId: number = 0
    count: number = 1
}
