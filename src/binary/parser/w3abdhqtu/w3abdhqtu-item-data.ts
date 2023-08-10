import W3abdhqtuItemDataValue from './w3abdhqtu-item-data-value'
import {DataReader} from '../../utils/data-reader/data-reader'
import {DataReaderType} from '../../utils/data-reader/data-reader-type'

export default class W3abdhqtuItemData {
    constructor(reader: DataReader, parent: HTMLElement, adq: boolean, version: number) {
        if (version >= 3) this.flag = reader.read(DataReaderType.uint32le, {parent: parent})
        this.count = reader.read(DataReaderType.uint32le, {parent: parent})

        for (let i = 0; i < this.count; i++) {
            const div = document.createElement('div')
            div.classList.add('block')
            parent.appendChild(div)
            this.list.push(new W3abdhqtuItemDataValue(reader, div, adq))
        }
    }

    list: W3abdhqtuItemDataValue[] = []
    flag: number = 0
    count: number = 0
}
