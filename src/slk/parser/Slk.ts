// https://github.com/stijnherfst/HiveWE/wiki/SLK

const enum SlkKey {
    Id = 'ID',
    TableSize = 'B',
    Cell = 'C',
    X = 'X',
    Y = 'Y',
    Default = 'D',
    Data = 'K',
    End = 'E'
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

    def: SlkData = null

    #push(y: number, x: number, value: SlkData) {
        while (this.list.length <= y) {
            this.list.push([])
        }
        const list = this.list[y]
        while (list.length <= x) {
            list.push(null)
        }

        this.list[y][x] = value
    }

    #read() {
        let y = -1

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

        loop: for (const string of this.#text.split(/\r\n|\n/)) {
            const chunks = string.split(';')

            if (chunks.length === 0) continue
            const chunk = chunks.shift()?.trim()

            switch (chunk as SlkKey | null) {
                case SlkKey.Id:
                    break
                case SlkKey.TableSize:
                    for (const value of chunks) {
                        const list = value.split('')
                        const k = list.shift()
                        const v = list.join('')
                        switch (k as SlkKey) {
                            case SlkKey.X:
                                this.width = Number(v)
                                break
                            case SlkKey.Y:
                                this.height = Number(v)
                                break
                            case SlkKey.Default:
                                this.def = _value(v)
                        }
                    }
                    break
                case SlkKey.Cell:
                    let x = -1
                    let value = this.def
                    for (const c of chunks) {
                        const list = c.split('')
                        const k = list.shift()
                        const v = list.join('')
                        switch (k as SlkKey) {
                            case SlkKey.X:
                                x = Number(v) - 1
                                break
                            case SlkKey.Y:
                                y = Number(v) - 1
                                break
                            case SlkKey.Data:
                                value = _value(v)
                        }
                    }
                    this.#push(y, x, value)
                    break
                case SlkKey.End:
                    break loop
            }
        }
        this.header = this.list.shift()

        for (let i = this.list.length - 1; i >= 0; i--) {
            //console.log(this.list[i].length)
        }
    }
}
