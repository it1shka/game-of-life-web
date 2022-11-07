import {find, frameToBoard, popupAlert} from './utils.js'
import Api from './api.js'
import Game from './game.js'

class LoadPanel {

    private readonly root = find<HTMLDivElement>('#load-panel')
    private readonly list = this.root.querySelector('ul')!
    private readonly closeButton: HTMLButtonElement = this.root.querySelector('#close-panel-button')!
    private readonly fetchNextButton: HTMLButtonElement = this.root.querySelector('#fetch-next-frames')!

    private offset = 0

    constructor() {
        this.closeButton.onclick = this.close
        this.fetchNextButton.onclick = this.fetchFrames
    }

    open = () => {
        this.root.classList.remove('closed')
        this.fetchFrames()
    }

    private close = () => {
        this.root.classList.add('closed')
        this.offset = 0
        this.list
            .querySelectorAll('li')
            .forEach(element => this.list.removeChild(element))
    }

    private fetchFrames = async () => {
        const frames = await Api.getFrames(this.offset)
        for (const frame of frames) {
            const frameElement = document.createElement('li')

            const title = document.createElement('h1')
            title.textContent = frame.name
            frameElement.appendChild(title)

            const likeButton = document.createElement('button')
            likeButton.classList.add('like-btn')
            likeButton.textContent = `${frame.likes} likes`
            likeButton.onclick = async () => {
                const success = await Api.likeFrame(frame.id)
                if (!success) {
                    popupAlert('Failed to like a frame')
                    return
                }
                popupAlert(`Liked "${frame.name}" frame!`)
                likeButton.classList.add('liked')
                likeButton.textContent = `${frame.likes + 1} likes`
                likeButton.onclick = null
            }
            frameElement.appendChild(likeButton)

            const loadButton = document.createElement('button')
            loadButton.classList.add('load-btn')
            loadButton.textContent = 'Load frame'
            loadButton.onclick = () => {
                const board = frameToBoard(frame.frame)
                Game.loadState(board)
            }
            frameElement.appendChild(loadButton)

            this.list.appendChild(frameElement)
        }
        this.offset += 5
        this.list.scrollTo({
            top: this.list.scrollHeight,
            behavior: 'smooth',
        })
    }
}

export default new LoadPanel()