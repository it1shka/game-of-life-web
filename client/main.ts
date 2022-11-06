import './game.js'
import Game from './game.js'
import Api from './api.js'
import LoadPanel from './loadpanel.js'
import {boardToFrame, createImageFrom, downloadImage, find, onButton, popupAlert, promptUser, Ticker} from './utils.js'

onButton('#save-btn', () => {
    const board = Game.getBoard()
    const img = createImageFrom(board)
    const imgName = `GameOfLife${Date.now()}.png`
    downloadImage(img, imgName)
    popupAlert(`Saved image as ${imgName}`)
})

onButton('#clear-btn', () => {
    Game.clearState()
    popupAlert('Cleared board')
})

onButton('#randomize-btn', () => {
    Game.randomizeState(20)
    popupAlert('Randomized board')
})

const loopTicker = new Ticker(() => {
    Game.nextFrame()
}, 100)

const toggleButton = find<HTMLButtonElement>('#toggle-btn')
onButton('#toggle-btn', () => {
    if (loopTicker.running) {
        toggleButton.textContent = 'Start'
        loopTicker.pause()
        popupAlert('Paused game')
        return
    }
    toggleButton.textContent = 'Stop'
    loopTicker.start()
    popupAlert('Resumed game')
})

onButton('#share-btn', async () => {
    try {
        const frameName = await promptUser('Select your frame name: ', 'Frame name: ')
        const frameBody = boardToFrame(Game.getBoard())
        const success = await Api.putFrame(frameName, frameBody)
        await popupAlert(success ? `Successfully added new frame ${frameName}` : 'Failed to add new frame')
    } catch (err) {
        console.log(`Failed to share frame due to network error: ${err}`)
    }
})

onButton('#load-btn', () => {
    LoadPanel.open()
})