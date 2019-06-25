(() => {
    class Screen {
        constructor(opts = {}) {
            this.ctx = document.getElementById('screen').getContext('2d')

            this.hiColor = opts.hiColor || '#000'
            this.loColor = opts.loColor || '#fff'

            const scaleFactor = opts.scaleFactor || 8

            this.scaleFactor = scaleFactor
            this.width = 64 * scaleFactor
            this.height = 32 * scaleFactor
        }

        clear() {
            this.ctx.fillStyle = this.loColor
            this.ctx.fillRect(0, 0, this.width, this.height)
        }

        drawPoint(x, y, color) {
            const { scaleFactor } = this

            this.ctx.fillStyle = color
            this.ctx.fillRect(x * scaleFactor, y * scaleFactor, scaleFactor, scaleFactor)
        }

        draw({ x, y, width, height, vMemory }) {
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    const offset = x + i + ((y + j) * 64)

                    const vMemoryBit = vMemory[offset]

                    const color = vMemoryBit === 1 ? this.hiColor : this.loColor

                    this.drawPoint(x + i, y + j, color)
                }
            }
        }
    }

    window.chip8.Screen = Screen
})()