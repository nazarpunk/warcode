import {DataReader} from '../../utils/data-reader'
import {DataReaderType} from '../../utils/data-reader-type'

const enum DataType {
    integer = 0,
    real = 1,
    unreal = 2,
    string = 3
}

export default class W3abdhqtuItemDataValue {

    constructor(
        reader: DataReader,
        adq: boolean
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

    id: number = 0
    type: number = 0
    level: number = 0
    data: number = 0
    value: number | string = 0
    end: number = 0
}
