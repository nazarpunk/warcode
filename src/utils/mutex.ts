type ReleaseFunction = () => void;

export class Mutex {
    #queue: {
        resolve: (release: ReleaseFunction) => void;
    }[] = []

    #locked = false

    #dispatch() {
        if (this.#locked) return
        const nextEntry = this.#queue.shift()
        if (!nextEntry) return
        this.#locked = true
        nextEntry.resolve(this.#release())
    }

    #release(): ReleaseFunction {
        return () => {
            this.#locked = false
            this.#dispatch()
        }
    }

    #acquire() {
        return new Promise<ReleaseFunction>(resolve => {
            this.#queue.push({resolve})
            this.#dispatch()
        })
    }

    async run<T>(callback: () => Promise<T>) {
        const release = await this.#acquire()
        try {
            return await callback()
        } finally {
            release()
        }
    }
}
