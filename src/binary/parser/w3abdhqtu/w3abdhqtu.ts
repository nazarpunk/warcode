// https://github.com/stijnherfst/HiveWE/wiki/war3map(skin).w3%2A-Modifications

import {DataReader} from '../../utils/data-reader/data-reader'
import W3abdhqtuItem from './w3abdhqtu-item'
import {DataReaderType} from '../../utils/data-reader/data-reader-type'
import {BinaryParser} from '../binary-parser'

export class W3abdhqtu implements BinaryParser {
    constructor(
        private readonly reader: DataReader,
        private readonly adq: boolean
    ) {
        try {
            this.#read()
        } catch (e) {
            if (e instanceof Error) this.errors.push(e)
        }
    }

    errors: Error[] = []
    lists: W3abdhqtuItem[][] = [[], []]
    counts: number[] = [0, 0]
    version: number = 0

    #read() {
        this.version = this.reader.read(DataReaderType.uint32le)
        if ([1, 2, 3].indexOf(this.version) < 0) {
            throw new Error(`This format is unsupported: ${this.version}`)
        }

        for (let i = 0; i < 2; i++) {
            this.counts[i] = this.reader.read<number>(DataReaderType.uint32le)

            for (let k = 0; k < this.counts[i]; k++) {
                this.lists[i].push(new W3abdhqtuItem(this.reader, this.adq, this.version))
            }
        }

        if (this.reader.cursor !== this.reader.byteLength) {
            throw new Error(`Read not complete: ${this.reader.cursor} !== ${this.reader.byteLength}`)
        }
    }

    toHTML(document: Document, parent: HTMLElement): void {
        parent.insertAdjacentHTML('beforeend', `<div class="block"><div class="value-group"><div class="value value-help">format version</div><div class="value value-all">${this.version}</div></div></div>`)

        const help = [
            'origin count',
            'custom count'
        ]

        for (let i = 0; i < 2; i++) {
            const block = document.createElement('div')
            block.classList.add('block')
            parent.appendChild(block)
            block.insertAdjacentHTML('beforeend', `<div class="value-group"><div class="value value-help">${help[i]}</div><div class="value value-all">${this.counts[i]}</div></div>`)
            for (const item of this.lists[i]) {
                item.toHTML(document, block)
            }
        }
    }
}
