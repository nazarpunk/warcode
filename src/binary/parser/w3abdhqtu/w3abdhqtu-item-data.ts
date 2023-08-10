import W3abdhqtuItemDataValue from './w3abdhqtu-item-data-value'
import {DataReader} from '../../utils/data-reader/data-reader'
import {DataReaderType} from '../../utils/data-reader/data-reader-type'
import {BinaryParser} from '../binary-parser'

export default class W3abdhqtuItemData implements BinaryParser {
    constructor(
        reader: DataReader,
        adq: boolean,
        public version: number
    ) {
        if (version >= 3) this.flag = reader.read(DataReaderType.uint32le)
        this.count = reader.read(DataReaderType.uint32le)

        for (let i = 0; i < this.count; i++) {
            this.list.push(new W3abdhqtuItemDataValue(reader, adq))
        }
    }

    flag: number = 0
    count: number = 0
    list: W3abdhqtuItemDataValue[] = []
    errors: Error[] = []

    toHTML(document: Document, parent: HTMLElement): void {
        if (this.version >= 3) parent.insertAdjacentHTML('beforeend', `<div class="value-group"><div class="value value-help">flag</div><div class="value value-all">${this.flag}</div></div>`)
        parent.insertAdjacentHTML('beforeend', `<div class="value-group"><div class="value value-help">values count</div><div class="value value-all">${this.count}</div></div>`)
        for (const item of this.list) {
            const div = document.createElement('div')
            div.classList.add('block')
            parent.appendChild(div)
            item.toHTML(document, div)
        }
    }
}
