
const container = document.querySelector(".container")

let EMPTY_SQUARE = 0
let PLAYER_SQUARE = 1
let OPPONENT_SQUARE = 2

const gameBoard = (() => {
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

    return {playerMove, opponentMove, boardArray}
})()

const boardDom = (() => {
    const content = document.createElement("div")
    content.classList.add("squares")

    //Todo: Nine buttons, each appended to content div.
    for (let i=0; i<gameBoard.boardArray.length; i++) {
        const button = document.createElement("button")
        button.setAttribute("id", "square-button " + (i+1))
        content.appendChild(button)
        console.log(button)
    }

    container.appendChild(content)
})()