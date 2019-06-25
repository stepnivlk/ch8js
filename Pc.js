(() => {
    const PROGRAM_START_ADDR = 0x200
    const OPCODE_SIZE = 2

    class Pc {
        constructor() {
            this.addr = PROGRAM_START_ADDR
            this.startAddr = PROGRAM_START_ADDR
        }

        next() {
            this.addr += OPCODE_SIZE
        }

        jump(newAddr) {
            this.addr = newAddr
        }
    }

    window.chip8.Pc = Pc
})()