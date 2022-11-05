import {copyMatrix, createMatrix} from './utils.js'

export default class GameState {

    private board: boolean[][]

    constructor(private readonly size: number) {
        this.board = createMatrix(size, false)
    }

    loadState(board: boolean[][]) {
        copyMatrix(board, this.board)
    }

    clearState() {
        this.board = createMatrix(this.size, false)
    }

    randomizeState(probability: number) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.board[i][j] = Math.random() * 100 < probability
            }
        }
    }

    toggleCell(row: number, column: number) {
        this.board[row][column] = !this.board[row][column]
    }

    nextFrame() {
        const nextBoard = createMatrix(this.size, false)
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const alive = this.board[i][j]
                const neighbours = this.countLivingNeighbours(i, j)
                nextBoard[i][j] = (!alive && neighbours === 3) || (alive && (neighbours === 2 || neighbours === 3))
            }
        }
        this.board = nextBoard
    }

    displayTo(cells: Element[]) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const current = this.board[i][j]
                const cell = cells[this.size * i + j]
                if (current) cell.classList.add('living')
                else cell.classList.remove('living')
            }
        }
    }

    getBoard() {
        const board = createMatrix(this.size, false)
        copyMatrix(this.board, board)
        return board
    }

    private countLivingNeighbours(row: number, column: number) {
        let living = 0
        for (let i = Math.max(0, row - 1); i <= Math.min(this.size - 1, row + 1); i++) {
            for (let j = Math.max(0, column - 1); j <= Math.min(this.size - 1, column + 1); j++) {
                if (i === row && j === column) continue;
                if (this.board[i][j]) living++
            }
        }
        return living
    }

}