(() => {
    const trace = ({ opName, pcAddr, stack, v }) => {
        const currentOpSelector = document.getElementById('currentOp')
        const currentOpChild = currentOpSelector.childNodes[0]

        if (currentOpChild) {
            currentOpSelector.removeChild(currentOpChild)
        }

        currentOpSelector.append(opName)

        const currentPcSelector = document.getElementById('currentPc')
        const currentPcChild = currentPcSelector.childNodes[0]

        if (currentPcChild) {
            currentPcSelector.removeChild(currentPcChild)
        }

        currentPcSelector.append(pcAddr)

        stackRootSelector = document.getElementById('stackRoot')
        stackRootSelector.childNodes.forEach((node) => node.innerHTML = '')
        stack.slice(0, 3).forEach((addr, i) => {
            const stackElem = document.querySelector(`#stackRoot > div:nth-child(${i + 1})`)
            stackElem.innerHTML = chip8.lib.dec2hex(addr)
        })

        vregRootSelector = document.getElementById('vregRoot')
        vregRootSelector.childNodes.forEach((node) => node.innerHTML = '')
        v.forEach((reg, i) => {
            const regElem = document.querySelector(`#vregRoot > div:nth-child(${i + 1})`)
            regElem.innerHTML = chip8.lib.dec2hex(reg)
        })
    }

    window.chip8.Debugger = {
        trace,
    }
})()