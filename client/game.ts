import {createBoard} from './utils.js'
import GameState from './gamestate.js'

const boardSize = 30
const realBoard = createBoard(boardSize)
const gameState = new GameState(boardSize)

const nonChangingMethods = [
    'displayTo',
    'countLivingNeighbours',
    'getBoard',
]

const Game = new Proxy(gameState, {
    get(target: any, prop: string, _: any) {

        // if it's a non-changing method or a property, just returning it
        if (nonChangingMethods.includes(prop) || typeof target[prop] !== 'function') {
            return Reflect.get(target, prop)
        }

        // proxy all methods that change game state
        // after change we apply changes to realBoard
        return new Proxy(target[prop], {
            apply(fn: any, thisArg: any, argArray: any[]) {
                const result = Reflect.apply(fn, thisArg, argArray)
                target.displayTo(realBoard)
                return result
            }
        })

    }
}) as GameState

for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
        const cell = realBoard[row * boardSize + col]
        cell.onclick = () => Game.toggleCell(row, col)
    }
}

export default Game