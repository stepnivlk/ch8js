(() => {
    const roms = [
        '15PUZZLE',
        'BLITZ',
        'CONNECT4',
        'HIDDEN',
        'INVADERS',
        'MAZE',
        'MISSILE',
        'PONG2',
        'SYZYGY',
        'TETRIS',
        'UFO',
        'VERS',
        'BLINKY',
        'BRIX',
        'GUESS',
        'IBM',
        'KALEID',
        'MERLIN',
        'PONG',
        'PUZZLE',
        'TANK',
        'TICTAC',
        'VBRIX',
        'WIPEOFF',
    ]

    const romLoader = (name) => {
        return fetch(`roms/${name}`)
            .then((response) => response.arrayBuffer())
            .then((buffer) => new Uint8Array(buffer))
    }

    const initRoms = (runner) => {
        const romSelector = document.getElementById('romSelector')

        roms.forEach((rom) => {
            const option = document.createElement('option')

            option.value = rom
            option.innerHTML = rom

            romSelector.appendChild(option)
        })

        romSelector.addEventListener('change', (event) => {
            if (event.target.value === '') {
                return
            }

            romSelector.blur()

            romLoader(event.target.value)
                .then((rom) => runner.load(rom))
                .then(() => runner.start())
        })
    }

    const runner = new chip8.Runner({
        chip8: chip8.Chip8,
        screen: chip8.Screen,
        input: chip8.Input,
        speaker: chip8.Speaker,
    })

    initRoms(runner)
})()