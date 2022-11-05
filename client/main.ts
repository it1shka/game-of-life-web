import './game.js'
import Game from './game.js'
import {createImageFrom, downloadImage, find, onButton, Ticker} from './utils.js'

onButton('#save-btn', () => {
    const board = Game.getBoard()
    const img = createImageFrom(board)
    downloadImage(img, `GameOfLife${Date.now()}.png`)
})

onButton('#clear-btn', () => {
    Game.clearState()
})

onButton('#randomize-btn', () => {
    Game.randomizeState(20)
})

const loopTicker = new Ticker(() => {
    Game.nextFrame()
}, 100)

const toggleButton = find<HTMLButtonElement>('#toggle-btn')
onButton('#toggle-btn', () => {
    if (loopTicker.running) {
        toggleButton.textContent = 'Start'
        loopTicker.pause()
        return
    }
    toggleButton.textContent = 'Stop'
    loopTicker.start()
})