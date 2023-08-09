import W3abdhqtuItemDataValue from './w3abdhqtu-item-data-value'
import {DataReader} from '../../utils/data-reader'
import {DataReaderType} from '../../utils/data-reader-type'

export default class W3abdhqtuItemData {
    constructor(reader: DataReader, adq: boolean, version: number) {
        if (version >= 3) this.flag = reader.read(DataReaderType.uint32le)
        this.count = reader.read(DataReaderType.uint32le)
        for (let i = 0; i < this.count; i++) {
            this.list.push(new W3abdhqtuItemDataValue(reader, adq))
        }
    }

    list: W3abdhqtuItemDataValue[] = []
    flag: number = 0
    count: number = 0
}
