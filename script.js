//Todo: Grid layout takes care of square placement. Can simply store squares in array.
let EMPTY_SQUARE = 0
let PLAYER_SQUARE = 1
let OPPONENT_SQUARE = 2

const StartingBoard = (index) => {
    let boardArray = []

    for (let i=0; i<9; i++) {
        boardArray.push(EMPTY_SQUARE)
    }

    const playerMove = (index) => {
        boardArray.splice(index, 1, PLAYER_SQUARE)
        console.log("array after player move is " + boardArray)
    }

    const opponentMove = (index) => {
        boardArray.splice(index, 1, OPPONENT_SQUARE)
        console.log("array after opponent move is " + boardArray)
    }

    return {playerMove, opponentMove}
}

const gameTurn = StartingBoard()

gameTurn.playerMove(5)
gameTurn.opponentMove(4)