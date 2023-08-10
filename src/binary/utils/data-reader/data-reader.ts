import {Uint8ArrayBuffer} from '../uint8-array-buffer'
import {DataReaderType} from './data-reader-type'

export class DataReader extends DataView {

    constructor(
        u8: Uint8Array,
        byteOffset?: number,
        byteLength?: number,
    ) {
        super(Uint8ArrayBuffer(u8), byteOffset, byteLength)
    }

    cursor = 0

    read<T extends number | string>(type: DataReaderType): T {
        let value: number | string

        switch (type) {
            case DataReaderType.uint32le:
                value = this.getUint32(this.cursor, true)
                this.cursor += 4
                break
            case DataReaderType.uint32be:
                value = this.getUint32(this.cursor, false)
                this.cursor += 4
                break
            case DataReaderType.float32le:
                value = this.getFloat32(this.cursor, true)
                this.cursor += 4
                break
            case DataReaderType.string:
                const list = []
                while (this.cursor < this.byteLength) {
                    const b = super.getUint8(this.cursor)
                    this.cursor += 1
                    if (b === 0) break
                    list.push(b)
                }
                value = new TextDecoder('utf-8').decode((new Uint8Array(list)).buffer)
        }

        return value as T
    }

}


