(() => {
    const V_MEM_SIZE = 64 * 32

    const fontSet = new Uint8Array(
        [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ]
    )

    class Chip8 extends chip8.lib.EventEmitter {
        constructor() {
            super()

            this.reset()

            this.reset = this.reset.bind(this)
            this.load = this.load.bind(this)
            this.step = this.step.bind(this)
            this.execute = this.execute.bind(this)
        }
        
        reset() {
            this.memory = new Uint8Array(4096)
            this.kMemory = new Uint8Array(16);
            this.vMemory = new Uint8Array(V_MEM_SIZE)

            this.pc = new chip8.Pc() 
            this.v = new Uint8Array(16)
            this.i = 0
            this.stack = new Array()

            this.delayTimer = 0
            this.soundTimer = 0

            fontSet.forEach((chunk, i) => {
                this.memory[i] = chunk
            })
        }

        load(program) {
            this.reset()

            program.forEach((byte, index) => {
                this.memory[this.pc.startAddr + index] = byte
            })
        }

        step() {
            for (let i = 0; i < 10; i++) {
                const hiByte = this.memory[this.pc.addr]
                const loByte = this.memory[this.pc.addr + 1]

                const opcode = new chip8.Opcode(hiByte, loByte)
                this.execute(opcode)
            }

            this.updateTimers()
        }

        updateTimers() {
            if (this.delayTimer > 0) {
                this.delayTimer -= 1
            }

            if (this.soundTimer > 0) {
                this.soundTimer -= 1
            }
        }

        execute(opcode) {
            this.pc.next()

            const result = chip8.executors.get(opcode.nibbles[0])(opcode, this)

            this.emit('debug', { opName: opcode.toHex() })

            if (opcode.isDraw()) {
                this.emit('draw', { payload: result })
            }

            if (opcode.isClear()) {
                this.emit('clear')
            }

            if (opcode.isWait()) {
                this.emit('wait', { payload: result })
            }

            if (this.soundTimer > 0) {
                this.emit('beepRun')
            } else {
                this.emit('beepStop')
            }
        }

        setKey(key) {
            this.kMemory[key] = 1
        }

        unsetKey(key) {
            this.kMemory[key] = 0
        }
    }

    window.chip8.Chip8 = Chip8
})()