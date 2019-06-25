(() => {
    class Opcode {
        constructor(hiByte, loByte) {
            const bin = hiByte << 8 | loByte

            const nibbles = [
                (bin & 0xF000) >> 12,
                (bin & 0x0F00) >> 8,
                (bin & 0x00F0) >> 4,
                bin & 0x000F,
            ]

            this.bin = bin
            this.nibbles = nibbles
            this.x = nibbles[1]
            this.y = nibbles[2]
            this.n = nibbles[3]
            this.nn = bin & 0x00FF
            this.nnn = bin & 0x0FFF
        }

        toHex() {
            return chip8.lib.dec2hex(this.bin)
        }

        isDraw() {
            return this.nibbles[0] === 0xD
        }

        isClear() {
            return this.bin === 0x00E0
        }
        
        isWait() {
            return this.nibbles[0] === 0xF && this.nibbles[3] === 0xA
        }
    }

    window.chip8.Opcode = Opcode
})()