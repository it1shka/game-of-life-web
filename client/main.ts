import './game.js'
import Game from './game.js'
import {createImageFrom, downloadImage, onButton} from './utils.js'

Game.randomizeState(20)

onButton('#save-btn', () => {
    const board = Game.getBoard()
    const img = createImageFrom(board)
    downloadImage(img, `GameOfLife${Date.now()}.png`)
})