import {find, frameToBoard, popupAlert} from './utils.js'
import Api, {Frame} from './api.js'
import Game from './game.js'

class AlreadyLiked {
    private key = 'game-of-life/already-liked'
    private readonly likes: Array<number>

    constructor() {
        try {
            const raw = window.localStorage.getItem(this.key)
            this.likes = raw ? JSON.parse(raw) as Array<number> : []
        } catch (err) {
            console.log(err)
            this.likes = []
        }
    }

    check(id: number) {
        return this.likes.includes(id)
    }

    like(id: number) {
        this.likes.push(id)
        const raw = JSON.stringify(this.likes)
        window.localStorage.setItem(this.key, raw)
    }
}

class LoadPanel {

    private readonly root = find<HTMLDivElement>('#load-panel')
    private readonly list = this.root.querySelector('ul')!
    private readonly closeButton: HTMLButtonElement = this.root.querySelector('#close-panel-button')!
    private readonly fetchNextButton: HTMLButtonElement = this.root.querySelector('#fetch-next-frames')!
    private readonly likes = new AlreadyLiked()

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
            this.appendFrameElement(frame)
        }

        this.offset += 5
        this.list.scrollTo({
            top: this.list.scrollHeight,
            behavior: 'smooth',
        })
    }

    private appendFrameElement(frame: Frame) {
        const frameElement = document.createElement('li')

        const title = document.createElement('h1')
        title.textContent = frame.name
        frameElement.appendChild(title)

        const likeButton = document.createElement('button')
        likeButton.classList.add('like-btn')
        likeButton.textContent = `${frame.likes} likes`
        if (this.likes.check(frame.id)) {
            likeButton.classList.add('liked')
        } else {
            likeButton.onclick = async () => {
                const success = await Api.likeFrame(frame.id)
                if (!success) {
                    popupAlert('Failed to like a frame')
                    return
                }
                popupAlert(`Liked "${frame.name}" frame!`)
                this.likes.like(frame.id)
                likeButton.classList.add('liked')
                likeButton.textContent = `${frame.likes + 1} likes`
                likeButton.onclick = null
            }
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
}

export default new LoadPanel()