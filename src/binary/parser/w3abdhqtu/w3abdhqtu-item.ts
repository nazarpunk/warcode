import W3abdhqtuItemData from './w3abdhqtu-item-data'
import {DataReader} from '../../utils/data-reader/data-reader'
import {DataReaderType} from '../../utils/data-reader/data-reader-type'
import {BinaryParser} from '../binary-parser'
import Number2Id from '../../utils/number-2-id'

export default class W3abdhqtuItem implements BinaryParser {

    constructor(
        reader: DataReader,
        adq: boolean,
        version: number
    ) {
        this.originId = reader.read(DataReaderType.uint32be)
        this.customId = reader.read(DataReaderType.uint32be)
        if (version >= 3) this.count = reader.read(DataReaderType.uint32le)

        for (let i = 0; i < this.count; i++) {
            this.list.push(new W3abdhqtuItemData(reader, adq, version))
        }
    }

    errors: Error[] = []
    list: W3abdhqtuItemData[] = []

    originId: number = 0
    customId: number = 0
    count: number = 1

    toHTML(document: Document, parent: HTMLElement): void {
        const block = document.createElement('div')
        block.classList.add('block')
        parent.appendChild(block)
        block.insertAdjacentHTML('beforeend', `<div class="value value-all">${Number2Id(this.originId)}</div><div class="value value-all">${Number2Id(this.customId)}</div><div class="value-group"><div class="value value-help">count</div><div class="value value-all">${this.count}</div></div>`)
        const div = document.createElement('div')
        div.classList.add('block')
        block.appendChild(div)
        for (const item of this.list) {
            item.toHTML(document, div)
        }
    }
}
