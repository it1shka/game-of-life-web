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
        this.interval = setInterval(() => {
            this.action()
        }, this.tickTime)
    }

    pause() {
        clearInterval(this.interval)
        this.interval = undefined
    }

    get running() {
        return this.interval !== undefined
    }
}