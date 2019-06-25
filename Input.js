(() => {
    const keyMap = {
        49: 0x1, // 1
        50: 0x2, // 2
        51: 0x3, // 3
        52: 0xC, // 4
        81: 0x4, // Q
        87: 0x5, // W
        69: 0x6, // E
        82: 0xD, // R
        65: 0x7, // A
        83: 0x8, // S
        68: 0x9, // D
        70: 0xE, // F
        90: 0xA, // Z
        88: 0x0, // X
        67: 0xB, // C
        86: 0xF, // V
    }

    class Input extends chip8.lib.EventEmitter {
        constructor() {
            super()

            this.pauseToggle = document.getElementById('pause')
            this.pressList = []

            this.initPause()
            this.initListeneres()
        }

        initListeneres() {
            window.addEventListener("keydown", (e) => this.handleKeyDown(e), false);
            window.addEventListener("keyup", (e) => this.handleKeyUp(e), false);
        }

        initPause() {
            this.pauseToggle.onclick = () => {
                const content = this.pauseToggle.innerHTML

                content === 'pause' ? this.handlePause() : this.handleResume()
            }
        }

        handlePause() {
            this.pauseToggle.innerHTML = 'resume'
            this.emit('pause')
        }

        handleResume() {
            this.pauseToggle.innerHTML = 'pause'
            this.emit('resume')
        }

        handleKeyUp(e) {
            if (!keyMap[e.keyCode]) {
                return
            }

            this.emit('keyUp', { key: keyMap[e.keyCode] })
        }

        handleKeyDown(e) {
            if (!keyMap[e.keyCode]) {
                return
            }

            this.emit('keyDown', { key: keyMap[e.keyCode] })
        }
    }

    window.chip8.Input = Input
})()