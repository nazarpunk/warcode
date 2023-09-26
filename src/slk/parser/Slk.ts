// https://github.com/stijnherfst/HiveWE/wiki/SLK

const enum SlkKey {
    Id = 'ID',
    TableSize = 'B',
    Cell = 'C',
    X = 'X',
    Y = 'Y',
    D = 'D',
    Value = 'K',
    End = 'E'
}

export type SlkValue = number | string | null

export class Slk {

    constructor(slk: string) {
        this.#text = slk

        try {
            this.#read()
        } catch (e) {
            if (e instanceof Error) this.errors.push(e)
        }
    }

    #id: string | undefined
    #text: string
    errors: Error[] = []

    header: SlkValue[] = []
    list: SlkValue[][] = []

    width = -1
    height = -1
    def: SlkValue | undefined

    #push(y: number, x: number, value: SlkValue) {
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
                    this.#id = string
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
                            case SlkKey.D:
                                this.def = _value(v)
                        }
                    }
                    break
                case SlkKey.Cell:
                    let x = -1
                    let value: SlkValue = null
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
                            case SlkKey.Value:
                                value = _value(v)
                        }
                    }
                    this.#push(y, x, value)
                    break
                case SlkKey.End:
                    break loop
            }
        }
        this.header = this.list.shift() ?? []
    }

    get content(): string {
        let s = ''
        if (this.#id) s += this.#id + '\n'

        s += `${SlkKey.TableSize};${SlkKey.X}${this.width};${SlkKey.Y}${this.list.length}`
        if (this.def !== undefined) s += `;${SlkKey.D}${this.def}`
        s += '\n'

        const _value = (v: string | number): string => {
            return typeof v == 'number' || /^[+-]?(\d+\.\d*|[.]?\d+)$/.test(v) ? v.toString() : `"${v}"`
        }

        if (!this.header) return ''

        let y = 0
        const count = this.header.length
        const _list = (row: SlkValue[]) => {
            y++
            let hasY = false
            for (let i = 0; i < count; i++) {
                const v = row[i] ?? null
                if (v === null) continue
                s += `${SlkKey.Cell};${SlkKey.X}${i + 1}`
                if (!hasY) {
                    hasY = true
                    s += `;${SlkKey.Y}${y}`
                }
                s += `;${SlkKey.Value}${_value(v)}\n`
            }
        }
        _list(this.header)

        for (const item of this.list) _list(item)

        s += `${SlkKey.End}\n`

        return s
    }
}
