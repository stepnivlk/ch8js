(() => {
    class Runner { 
        constructor(opts = {}) {
            this.chip8 = new opts.chip8()
            this.screen = new opts.screen()
            this.input = new opts.input()
            this.speaker = new opts.speaker()

            this.intervalId = 0
            this.fps = opts.fps || 10
            this.resumeCb = () => {}

            this.load = this.load.bind(this)
            this.pause = this.pause.bind(this)
            this.start = this.start.bind(this)
            this.step = this.step.bind(this)

            this.initEvents()
            this.initInputs()
        }

        initEvents() {
            this.chip8
                .on('debug', ({ target, detail: { opName } }) => {
                    chip8.Debugger.trace({
                        opName,
                        pcAddr: target.pc.addr,
                        stack: target.stack,
                        v: target.v
                    })
                })
                .on('draw', ({ target, detail: { payload } }) => {
                    this.screen.draw({
                        ...payload,
                        vMemory: target.vMemory,
                    })
                })
                .on('clear', () => {
                    this.screen.clear()
                })
                .on('wait', ({ detail: { payload } }) => {
                    this.resumeCb = (key) => {
                        payload.cb(key)
                        this.resumeCb = () => {}
                        this.resume()
                    }

                    this.pause()
                })
                .on('beepRun', () => {
                    console.log('beep')
                    this.speaker.play()
                })
                .on('beepStop', () => {
                    this.speaker.stop()
                })
        }

        initInputs() {
            this.input
                .on('pause', () => {
                    this.pause()
                })
                .on('resume', () => {
                    this.resume()
                })
                .on('keyDown', ({ detail: { key }}) => {
                    this.chip8.setKey(key)
                    this.resumeCb(key)
                })
                .on('keyUp', ({ detail: { key }}) => {
                    this.chip8.unsetKey(key)
                })
        }

        load(rom) {
            this.pause()
            this.chip8.reset()
            this.screen.clear()
            this.chip8.load(rom)

            return Promise.resolve()
        }

        pause() {
            clearInterval(this.intervalId)
        }

        resume() {
            this.intervalId = setInterval(this.step, 16)
        }

        start() {
            this.screen.clear()
            this.resume()
        }

        step() {
            this.chip8.step()
        }
    }

    window.chip8.Runner = Runner
})()