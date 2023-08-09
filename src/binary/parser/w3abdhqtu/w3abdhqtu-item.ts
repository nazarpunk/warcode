import W3abdhqtuItemData from './w3abdhqtu-item-data'
import {DataReader} from '../../utils/data-reader'
import {DataReaderType} from '../../utils/data-reader-type'

export default class W3abdhqtuItem {

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

    list: W3abdhqtuItemData[] = []

    originId: number = 0
    customId: number = 0
    count: number = 1
}
