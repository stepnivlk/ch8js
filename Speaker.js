(() => {
    class Speaker {
        constructor() {
            const context = new window.AudioContext()
            const gain = context.createGain()
            gain.connect(context.destination)

            this.context = context
            this.gain = gain
            this.oscillator = null
        }

        play(frequency) {
            if (this.oscillator) {
                return
            }

            this.oscillator = this.context.createOscillator()
            this.oscillator.frequency.value = 440
            this.oscillator.type = this.oscillator.TRIANGLE
            this.oscillator.connect(this.gain)
            this.oscillator.start(0)
        }
    
        stop() {
            if (!this.oscillator) {
                return
            }

            this.oscillator.stop(0)
            this.oscillator.disconnect(0)
            this.oscillator = null
        }
    }

    window.chip8.Speaker = Speaker
})()
  