import {DataReader} from '../../utils/data-reader/data-reader'
import {DataReaderType} from '../../utils/data-reader/data-reader-type'
import {BinaryParser} from '../binary-parser'
import Number2Id from '../../utils/number-2-id'

const enum DataType {
    integer = 0,
    real = 1,
    unreal = 2,
    string = 3
}

export default class W3abdhqtuItemDataValue implements BinaryParser {

    constructor(
        reader: DataReader,
        public adq: boolean
    ) {
        this.id = reader.read(DataReaderType.uint32be)
        this.type = reader.read(DataReaderType.uint32le)

        if (adq) {
            this.level = reader.read(DataReaderType.uint32le)
            this.data = reader.read(DataReaderType.uint32le)
        }

        switch (this.type as DataType) {
            case DataType.integer:
                this.value = reader.read(DataReaderType.uint32le)
                break
            case DataType.real:
            case DataType.unreal:
                this.value = reader.read(DataReaderType.float32le)
                break
            case DataType.string:
                this.value = reader.read(DataReaderType.string)
                break
            default:
                throw new Error(`Unknown variable type: ${this.type}`)
        }
        this.end = reader.read(DataReaderType.uint32be)
    }

    errors: Error[] = []

    id: number = 0
    type: number = 0
    level: number = 0
    data: number = 0
    value: number | string = 0
    end: number = 0

    toHTML(document: Document, parent: HTMLElement): void {
        let stype = ''
        let vstring = this.value

        switch (this.type as DataType) {
            case DataType.integer:
                stype = 'integer'
                break
            case DataType.real:
                stype = 'real'
                // @ts-ignore
                vstring = parseFloat(this.value.toFixed(4)).toString()
                break
            case DataType.unreal:
                stype = 'unreal'
                // @ts-ignore
                vstring = parseFloat(this.value.toFixed(4)).toString()
                break
            case DataType.string:
                stype = 'string'
                break
        }

        parent.insertAdjacentHTML('beforeend', `<div class="value value-all">${Number2Id(this.id)}</div><div class="value-group"><div class="value value-help">value type</div><div class="value value-all">${this.type}</div><div class="value value-help">${stype}</div></div>`)
        if (this.adq) {
            parent.insertAdjacentHTML('beforeend', `<div class="value-group"><div class="value value-help">level</div><div class="value value-all">${this.level}</div></div><div class="value-group"><div class="value value-help">data</div><div class="value value-all">${this.data}</div></div>`)
        }
        parent.insertAdjacentHTML('beforeend', `<div class="value-group"><div class="value value-help">value</div><div class="value value-all string">${vstring}</div></div><div class="value-group"><div class="value value-help">end</div><div class="value value-all">${Number2Id(this.end)}</div></div>`)
    }
}
