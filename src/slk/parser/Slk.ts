// https://github.com/stijnherfst/HiveWE/wiki/SLK

const enum SlkKey {
    TableSize = 'B',
    Cell = 'C',
    Width = 'X',
    Height = 'Y',
    Default = 'D',
    Data = 'K',
}

type SlkData = number | string | null

export class Slk {

    constructor(slk: string) {
        this.#text = slk

        try {
            this.#read()
        } catch (e) {
            if (e instanceof Error) this.errors.push(e)
        }
    }

    #text: string
    errors: Error[] = []

    list: SlkData[][] = []

    header?: SlkData[]

    width = -1
    height = -1

    #read() {
        let y = -1
        let def: SlkData = null

        const _value = (s: string): string | number => {
            s = s.trim()
            if (s.substring(0, 1) === '"') {
                const v = s.split('')
                if (v.shift() !== '"') throw new Error('Wrong string begining.')
                if (v.pop() !== '"') throw new Error('Wrong string ending.')
                return v.join('')
            }
            return Number(s)
        }

        for (const string of this.#text.split('\n')) {
            const chunks = string.split(';')
            if (chunks.length === 0) continue
            switch (chunks.shift() as SlkKey) {
                case SlkKey.TableSize:
                    for (const value of chunks) {
                        const list = value.split('')
                        const k = list.shift()
                        const v = list.join('')
                        switch (k as SlkKey) {
                            case SlkKey.Width:
                                this.width = Number(v)
                                break
                            case SlkKey.Height:
                                this.height = Number(v)
                                break
                            case SlkKey.Default:
                                def = _value(v)
                        }
                    }
                    if (this.width < 0 || this.height < 0) throw new Error('Missing size chunk.')
                    for (let h = 0; h < this.height; h++) {
                        const list = []
                        for (let w = 0; w < this.width; w++) {
                            list.push(def)
                        }
                        this.list.push(list)
                    }
                    break
                case SlkKey.Cell:
                    if (this.width < 0 || this.height < 0) throw new Error('Missing table size.')

                    let x = -1
                    let value = def
                    for (const chunk of chunks) {
                        const list = chunk.split('')
                        const k = list.shift()
                        const v = list.join('')
                        switch (k as SlkKey) {
                            case SlkKey.Width:
                                x = Number(v) - 1
                                break
                            case SlkKey.Height:
                                y = Number(v) - 1
                                break
                            case SlkKey.Data:
                                value = _value(v)
                        }
                    }
                    if (value === undefined) throw new Error('Missing value.')
                    this.list[y][x] = value
                    break
            }
        }
        this.header = this.list.shift()
    }
}
