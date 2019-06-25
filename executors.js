(() => {
    const generateExecutor = (ops) => (key) => {
        const executor = ops[key] || opThrow

        return (op, emu) => executor(op, emu) || {}
    }

    const opThrow = (op) => {
        const opName = chip8.lib.dec2hex(op.bin)
        throw new Error(`Unknown OP: ${opName}`)
    }

    const op00E0 = (_op, emu) => {
        for (let i = 0; i < emu.vMemory.length; i++) {
            emu.vMemory[i] = 0;
        }
    }

    const op00EE = (_op, emu) => {
        emu.pc.jump(emu.stack.pop())
    }

    const op0map = {
        0xE0: op00E0,
        0xEE: op00EE,
    }

    const op0 = (op, emu) => generateExecutor(op0map)(op.nn)(op, emu)

    const op1NNN = (op, emu) => {
        emu.pc.jump(op.nnn)
    }

    const op2NNN = (op, emu) => {
        emu.stack.push(emu.pc.addr)
        emu.pc.jump(op.nnn)
    }

    const op3XNN = (op, emu) => {
        if (emu.v[op.x] === op.nn) {
            emu.pc.next()
        }
    }

    const op4XNN = (op, emu) => {
        if (emu.v[op.x] !== op.nn) {
            emu.pc.next()
        }
    }

    const op5XY0 = (op, emu) => {
        if (emu.v[op.x] === emu.v[op.y]) {
            emu.pc.next()
        }
    }

    const op6XNN = (op, emu) => {
        emu.v[op.x] = op.nn
    }

    const op7XNN = (op, emu) => {
        emu.v[op.x] += op.nn
    }

    const op8XY0 = (op, emu) => {
        emu.v[op.x] = emu.v[op.y]
    }

    const op8XY1 = (op, emu) => {
        emu.v[op.x] = emu.v[op.x] | emu.v[op.y]
    }

    const op8XY2 = (op, emu) => {
        emu.v[op.x] = emu.v[op.x] & emu.v[op.y]
    }

    const op8XY3 = (op, emu) => {
        emu.v[op.x] = emu.v[op.x] ^ emu.v[op.y]
    }

    const op8XY4 = (op, emu) => {
        const sum = emu.v[op.x] + emu.v[op.y]

        if (sum > 0xFF) {
            emu.v[0xF] = 1
        } else {
            emu.v[0xF] = 0
        }

        emu.v[op.x] = sum
    }

    const op8XY5 = (op, emu) => {
        if (emu.v[op.x] > emu.v[op.y]) {
            emu.v[0xF] = 1
        } else {
            emu.v[0xF] = 0
        }

        emu.v[op.x] = emu.v[op.x] - emu.v[op.y]
    }

    const op8XY6 = (op, emu) => {
        emu.v[0xF] = emu.v[op.x] & 0x01
        emu.v[op.x] = emu.v[op.x] >> 1
    }

    const op8XY7 = (op, emu) => {
        if (emu.v[op.x] > emu.v[op.y]) {
            emu.v[0xF] = 0
        } else {
            emu.v[0xF] = 1
        }

        emu.v[op.x] = emu.v[op.y] - emu.v[op.x]
    }

    const op8XYE = (op, emu) => {
        emu.v[0xF] = emu.v[op.x] & 0x80
        emu.v[op.x] = emu.v[op.x] << 1
    }

    const op8map = {
        0x0: op8XY0,
        0x1: op8XY1,
        0x2: op8XY2,
        0x3: op8XY3,
        0x4: op8XY4,
        0x5: op8XY5,
        0x6: op8XY6,
        0x7: op8XY7,
        0xE: op8XYE,
    }

    const op8 = (op, emu) => generateExecutor(op8map)(op.n)(op, emu)

    const op9XY0 = (op, emu) => {
        if (emu.v[op.x] !== emu.v[op.y]) {
            emu.pc.next()
        }
    }

    const opANNN = (op, emu) => {
        emu.i = op.nnn
    }

    const opBNNN = (op, emu) => {
        emu.pc.jump(op.nnn + emu.v[0])
    }

    const opCXNN = (op, emu) => {
        const rnd = Math.floor(Math.random() * 0xFF) & (op.bin & 0x00FF)
        emu.v[op.x] = rnd
    }

    const opDXYN = (op, emu) => {
        const xStart = emu.v[op.x]
        const yStart = emu.v[op.y]
        const height = op.n

        emu.v[0xF] = 0

        for (let yline = 0; yline < height; yline++) {
            const pixel = emu.memory[emu.i + yline]

            for (let xline = 0; xline < 8; xline++) {
                if ((pixel & (128 >> xline)) !== 0) {
                    const vMemoryOffset = xStart + xline + ((yStart + yline) * 64)

                    emu.vMemory[vMemoryOffset] ^= 1

                    if (emu.vMemory[vMemoryOffset] === 0) {
                        emu.v[0xF] = 1
                    }
                }
            }
        }

        return {
            x: xStart,
            y: yStart,
            width: 8,
            height,
        }
    }

    const opEX9E = (op, emu) => {
        const vx = emu.v[op.x]

        if (emu.kMemory[vx] === 1) {
            emu.pc.next()
        }
    }

    const opEXA1 = (op, emu) => {
        const vx = emu.v[op.x]

        if (emu.kMemory[vx] === 0) {
            emu.pc.next()
        }
    }

    const opEmap = {
        0x9E: opEX9E,
        0xA1: opEXA1,
    }

    const opE = (op, emu) => generateExecutor(opEmap)(op.nn)(op, emu)

    const opFX07 = (op, emu) => {
        emu.v[op.x] = emu.delayTimer
    }

    const opFX0A = (op, emu) => {
        const cb = (key) => {
            emu.v[op.x] = key
        }

        return { cb }
    }

    const opFX15 = (op, emu) => {
        emu.delayTimer = emu.v[op.x] // * 1
    }

    const opFX18 = (op, emu) => {
        emu.soundTimer = emu.v[op.x]
    }

    const opFX1E = (op, emu) => {
        emu.i += emu.v[op.x]
    }

    const opFX29 = (op, emu) => {
        emu.i = emu.v[op.x] * 5
    }

    const opFX33 = (op, emu) => {
        const vx = emu.v[op.x]

        emu.memory[emu.i] = parseInt(vx / 100, 10)
        emu.memory[emu.i + 1] = parseInt(vx % 100 / 10, 10)
        emu.memory[emu.i + 2] = vx % 10
    }

    const opFX55 = (op, emu) => {
        for (let i = 0; i <= op.x; i++) {
            emu.memory[emu.i + i] = emu.v[i];
        } 
    }

    const opFX65 = (op, emu) => {
        for (let i = 0; i <= op.x; i++) {
            emu.v[i] = emu.memory[emu.i + i];
        } 
    }

    const opFmap = {
        0x07: opFX07,
        0x0A: opFX0A,
        0x15: opFX15,
        0x18: opFX18,
        0x1E: opFX1E,
        0x29: opFX29,
        0x33: opFX33,
        0x55: opFX55,
        0x65: opFX65
    }

    const opF = (op, emu) => generateExecutor(opFmap)(op.nn)(op, emu)

    const opMap = {
        0x0: op0,
        0x1: op1NNN,
        0x2: op2NNN,
        0x3: op3XNN,
        0x4: op4XNN,
        0x5: op5XY0,
        0x6: op6XNN,
        0x7: op7XNN,
        0x8: op8,
        0x9: op9XY0,
        0xA: opANNN,
        0xB: opBNNN,
        0xC: opCXNN,
        0xD: opDXYN, 
        0xE: opE,
        0xF: opF,
    }

    const get = (key) => generateExecutor(opMap)(key)

    window.chip8.executors = {
        get,
    }
})()