export const AsyncDelay = (time: number) => new Promise<void>(resolve => {
    let start: number | null = null
    const loop = (timestamp: number) => {
        if (!start) start = timestamp

        const elapsed = timestamp - start

        if (elapsed >= time) resolve()
        else requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
})
