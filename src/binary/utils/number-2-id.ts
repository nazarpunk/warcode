const Number2Id = (number: number) => {
    const n = BigInt(number)
    let s = ''
    for (let i = 3n; i >= 0n; i--) {
        const char = Number(n >> i * 8n & 255n)
        if (char < 0x21 || char > 0x7E || char == 0x27) {
            return '0x' + number.toString(16).padStart(8, '0')
        }
        s += String.fromCharCode(char)
    }
    return s
}

export default Number2Id
