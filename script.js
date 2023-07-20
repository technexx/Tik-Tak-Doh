
const heading = document.querySelector("#heading")
const container = document.querySelector(".container")

let EMPTY_SQUARE = 0
let PLAYER_SQUARE = 1
let OPPONENT_SQUARE = 2

heading.innerText = "Player Turn"

const GameBoard = (() => {
    let boardArray = []
    let playerArray = []
    let opponentArray = []
    let winState = "hello"

    for (let i=0; i<9; i++) {
        boardArray.push(EMPTY_SQUARE)
    }

    const playerMove = (index) => {
        if (isSpaceFree(boardArray[index])) {
            boardArray.splice(index, 1, PLAYER_SQUARE)
            playerArray.push(index)
            fillPlayerSquare(index)
            displayGameStatus("Player's Turn")
        } else {
            console.log("space occupied!")
        }
    }

    const opponentMove = (index) => {
        if (isSpaceFree(boardArray[index])) {
            boardArray.splice(index, 1, OPPONENT_SQUARE)
            opponentArray.push(index)
            fillOpponentSquare(index)
            displayGameStatus("Opponent's Turn")
        } else {
            console.log("space occupied!")
        }
    }

    function isSpaceFree(index) { return index === 0 }

    return {playerMove, opponentMove, boardArray, playerArray,opponentArray, winState}
})()

//Todo: We're calling this BEFORE the return value of winState. No, that's not it because moving it this to eventListeners doesn't fix.

//Todo: heading's text displays on final square fill, so overrides win text.
function displayGameStatus(whoseTurn) {
    console.log(boardIsFull)
    if (!boardIsFull()) {
        heading.innerText = whoseTurn
    } else {
        heading.innerText = checkGameWin()
    }
}   

function eventListeners (button, index) {
    button.addEventListener("click", () => {
        if (!boardIsFull()) {
            if (boardHasOddEmptySpaces()) {
                GameBoard.playerMove(index)
            } else {
                GameBoard.opponentMove(index)
            }
        } else {
            console.log("board is full")
        }
    })
}

function fillPlayerSquare (index)  {
    const buttons = document.querySelectorAll("[id^='square-button']")
    buttons[index].style.backgroundImage="url(./images/o-icon.svg)"
}

function fillOpponentSquare (index)  {
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

function boardIsFull() { return !GameBoard.boardArray.includes(0) }

function checkGameWin() {
    let valueToReturn = "Tie"

    const allWinsArray = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ]

    for (let i=0; i<allWinsArray.length; i++) {
        if (allWinsArray[i].every(array => GameBoard.playerArray.includes(array))) {
            valueToReturn = "Player Win"
        }

        if (allWinsArray[i].every(array => GameBoard.opponentArray.includes(array))) {
            valueToReturn = "Opponent Win"
        }
    }

    console.log("winner is " + valueToReturn)
    return valueToReturn
}

const PlayerRecord = (name) => {
    let wins = 0
    let losses = 0
    let ties = 0

    return {wins, losses, ties}
}

const boardDom = (() => {
    const content = document.createElement("div")
    content.classList.add("squares")

    for (let i=0; i<GameBoard.boardArray.length; i++) {
        const button = document.createElement("button")
        button.setAttribute("id", "square-button " + (i+1))        
        content.appendChild(button)
        eventListeners(button, (i))
    }

    container.appendChild(content)
})()