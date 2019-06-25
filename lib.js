(() => {
    const dec2hex = (dec) => parseInt(`${dec}`, 10).toString(16)
    
    class EventEmitter extends EventTarget {
        on(e, cb) {
            this.addEventListener(e, cb)

            return this
        }

        emit(e, detail) {
            this.dispatchEvent(
                new CustomEvent(e, { detail })
            )
        }
    }

    window.chip8.lib = {
        EventEmitter: EventEmitter,
        dec2hex,
    }
})()