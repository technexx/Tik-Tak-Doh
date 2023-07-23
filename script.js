
const heading = document.querySelector("#heading")
const container = document.querySelector(".container")
const playerStatsText = document.querySelector("#win-count")
const resetButton = document.querySelector("#reset-button")

let EMPTY_SQUARE = 0
let PLAYER_SQUARE = 1
let OPPONENT_SQUARE = 2

heading.innerText = "Player's Turn"
playerStatsText.innerText = "0 - 0 - 0"

const boardDom = (() => {
    const content = document.createElement("div")
    content.classList.add("squares")

    for (let i=0; i<9; i++) {
        const button = document.createElement("button")
        button.setAttribute("id", "square-button " + (i+1))        
        content.appendChild(button)
        eventListeners(button, (i))
    }

    container.appendChild(content)
})()

const GameBoard = (() => {
    let boardArray = []
    let playerArray = []
    let opponentArray = []
    let gameIsActive = true

    for (let i=0; i<9; i++) {
        boardArray.push(EMPTY_SQUARE)
    }
        
    const playerMove = (index) => {
        if (isSpaceFree(boardArray[index])) {
            boardArray.splice(index, 1, PLAYER_SQUARE)
            playerArray.push(index)
            fillPlayerSquare(index)

            console.log("player array in object is " + playerArray)

        } else {
            console.log("space occupied!")
        }
    }

    const opponentMove = (index) => {
        if (isSpaceFree(boardArray[index])) {
            boardArray.splice(index, 1, OPPONENT_SQUARE)
            opponentArray.push(index)
            fillOpponentSquare(index)
        } else {
            console.log("space occupied!")
        }
    }

    function isSpaceFree(index) { return index === 0 }

    return {playerMove, opponentMove, boardArray, playerArray,opponentArray, gameIsActive}
})()

const Player = () => {
    let wins = 0
    let losses = 0
    let ties = 0

    return {wins, losses, ties}
}

function eventListeners (button, index) {
    button.addEventListener("click", () => {
        if (GameBoard.gameIsActive) {
            if (!boardIsFull()) {
                if (boardHasOddEmptySpaces()) {
                    GameBoard.playerMove(index)
                    heading.innerText = "Opponent's Turn"
                } else {
                    GameBoard.opponentMove(index)
                    heading.innerText = "Player's Turn"
                }
                if (checkGameWin() !== "Tie") {
                    //Todo: Winning here after reset w/ out 3 in a row.
                    console.log(checkGameWin())
                    updatePlayerRecord()
                    heading.innerText = checkGameWin()
                    GameBoard.gameIsActive = false
                }
            } else {
                console.log("board is full")
            }
    
            //If last click has filled board.
            if (boardIsFull()) {
                heading.innerText = "Tie"
                GameBoard.gameIsActive = false
                console.log("full!")
            }
        }
    })
}

function fillPlayerSquare (index) {
    const buttons = document.querySelectorAll("[id^='square-button']")
    buttons[index].style.backgroundImage="url(./images/o-icon.svg)"
}

function fillOpponentSquare (index) {
    const buttons = document.querySelectorAll("[id^='square-button']")
    buttons[index].style.backgroundImage="url(./images/x-icon.svg)"
}

function boardHasOddEmptySpaces() {
    let emptySpaces = 0

    for (let i=0; i<GameBoard.boardArray.length; i++) {
        if (GameBoard.boardArray[i] === 0) emptySpaces++
    }
    if (emptySpaces % 2 !== 0) return true; else return false
}

function updatePlayerRecord() {
    const player = Player()
    if (checkGameWin() === "Player Win") player.wins++
    if (checkGameWin() === "Opponent Win") player.losses++
    if (checkGameWin() === "Tie") player.ties++

    playerStatsText.innerText = player.wins + " - " + player.losses + " - " + player.ties
}

function checkGameWin() {
    let valueToReturn = "Tie"
    console.log("player array in checkWin is " + GameBoard.playerArray)

    const allWinsArray = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ]

    for (let i=0; i<allWinsArray.length; i++) {
        if (allWinsArray[i].every(array => GameBoard.playerArray.includes(array))) {
            valueToReturn = "Player Win"
        }

        if (allWinsArray[i].every(array => GameBoard.opponentArray.includes(array))) {
            valueToReturn = "Opponent Win"
        }
    }

    return valueToReturn
}

resetButton.addEventListener("click", () => {
    clearSquaresImages()
    clearBoardArray()
    clearPlayerAndOpponentArrays()
    GameBoard.gameIsActive = true
    heading.innerText = "Player's Turn"
})

function clearBoardArray() {
    for (let i=0; i<GameBoard.boardArray.length; i++) {
        GameBoard.boardArray.splice(i, 1, 0)
    }
}

function clearPlayerAndOpponentArrays() {
    GameBoard.playerArray.length = 0
    GameBoard.opponentArray.length = 0
}

function boardIsFull() { return !GameBoard.boardArray.includes(0) }

function clearSquaresImages () {
    const buttons = document.querySelectorAll("[id^='square-button']")
    for (let i=0; i<buttons.length; i++) {
        buttons[i].style.backgroundImage="url()"
    }
}