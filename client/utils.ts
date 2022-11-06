export function find<T extends Element = Element>(query: string) {
    const element = document.querySelector(query)
    if (element === null) {
        throw new Error(`Query '${query}': element not found`)
    }
    return element as T
}

export function createBoard(size: number) {
    const game = find<HTMLDivElement>('.game')
    const cells = new Array<HTMLDivElement>(size * size)
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div')
        cells[i] = cell
        game.appendChild(cell)
    }
    return cells
}

export function createMatrix<T>(size: number, value: T) {
    const matrix = new Array(size)
    for (let row = 0; row < size; row++) {
        matrix[row] = new Array(size).fill(value)
    }
    return matrix
}

export function copyMatrix<T>(source: T[][], dest: T[][]) {
    for (let i = 0; i < dest.length; i++) {
        for (let j = 0; j < dest[i].length; j++) {
            dest[i][j] = source[i][j]
        }
    }
}

type ButtonHandler = (this: GlobalEventHandlers, event: MouseEvent) => any
export function onButton(query: string, handler: ButtonHandler) {
    const button = find<HTMLButtonElement>(query)
    button.onclick = handler
}

const cellSize = 20
export function createImageFrom(board: boolean[][]) {
    const canvas = document.createElement('canvas')
    canvas.width = board[0].length * (cellSize + 1) + 1
    canvas.height = board.length * (cellSize + 1) + 1

    const ctx = canvas.getContext('2d')
    if (ctx === null) {
        throw new Error('Failed to create an image')
    }

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const alive = board[row][col]
            ctx.fillStyle = alive ? '#3ec23e' : '#ddd'
            ctx.fillRect(col * (cellSize + 1) + 1, row * (cellSize + 1) + 1, cellSize, cellSize)
        }
    }

    return canvas.toDataURL('image/png')
}

export function downloadImage(src: string, name: string) {
    const link = document.createElement('a')
    link.href = src
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export class Ticker {

    private interval: number | undefined

    constructor(
        private readonly action: Function,
        private readonly tickTime: number
    ) {}

    start() {
        this.interval = window.setInterval(() => {
            this.action()
        }, this.tickTime)
    }

    pause() {
        window.clearInterval(this.interval)
        this.interval = undefined
    }

    get running() {
        return this.interval !== undefined
    }
}

const customPrompt = find<HTMLDivElement>('#custom-prompt')
export function promptUser(promptTitle: string, placeholder: string) {
    const form = customPrompt.querySelector('form')!
    const title = form.querySelector('h1')!
    const input = form.querySelector('input')!

    title.textContent = promptTitle
    input.placeholder = placeholder

    return new Promise<string>(resolve => {
        customPrompt.classList.remove('closed')
        form.onsubmit = event => {
            event.preventDefault()
            const value = input.value
            input.value = ''
            customPrompt.classList.add('closed')
            resolve(value)
        }
    })
}

export function boardToFrame(board: boolean[][]) {
    return board
        .map(row =>
            row.map(Number).join('')).join('\n')
}

export function frameToBoard(frame: string) {
    return frame
        .split('\n')
        .map(row =>
            row.split('').map(e => e === '1'))
}

export function sleep(time: number) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, time)
    })
}

export async function popupAlert(message: string) {
    const popup = document.createElement('aside')
    popup.classList.add('popup')
    popup.textContent = message
    document.body.appendChild(popup)

    await sleep(10)
    popup.classList.add('active')
    await sleep(3000)
    popup.classList.remove('active')

    await sleep(2000)
    document.body.removeChild(popup)
}