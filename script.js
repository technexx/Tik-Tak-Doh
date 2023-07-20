
const heading = document.querySelector("#heading")
const container = document.querySelector(".container")

let EMPTY_SQUARE = 0
let PLAYER_SQUARE = 1
let OPPONENT_SQUARE = 2

heading.innerText = "Player Turn"

const gameBoard = (() => {
    let boardArray = []
    let playerArray = []
    let opponentArray =[]

    for (let i=0; i<9; i++) {
        boardArray.push(EMPTY_SQUARE)
    }

    const playerMove = (index) => {
        if (isSpaceFree(boardArray[index])) {
            boardArray.splice(index, 1, PLAYER_SQUARE)
            playerArray.push(index)
            fillPlayerSquare(index)
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

    return {playerMove, opponentMove, boardArray, playerArray ,opponentArray}
})()

function eventListeners (button, index) {
    button.addEventListener("click", () => {
        if (boardHasOddEmptySpaces()) {
            gameBoard.playerMove(index)
            heading.innerText = "Opponent Turn"
        } else {
            gameBoard.opponentMove(index)
            heading.innerText = "Player Turn"
        }
        if (gameBoard.playerArray.length >= 3 || gameBoard.opponentArray.length >=3){
            checkGameWin()
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
    for (let i=0; i<gameBoard.boardArray.length; i++) {
        if (gameBoard.boardArray[i] === 0) emptySpaces++
    }

    if (emptySpaces % 2 !== 0) return true; else return false
}

function checkGameWin() {
    let valueToReturn = ""

    const allWinsArray = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ]

    //Todo: win value gets overridden since loop continues
    for (let i=0; i<allWinsArray.length; i++) {
        if (allWinsArray[i].every(array => gameBoard.playerArray.includes(array))) {
            valueToReturn = "Player Win"
        } else  if (allWinsArray[i].every(array => gameBoard.opponentArray.includes(array))) {
            valueToReturn = "Opponent Win"
        }    
    }

    // console.log("wins array is " + allWinsArray)
    // console.log("player array is " + gameBoard.playerArray)
    // console.log("opponent array is " + gameBoard.opponentArray)

    console.log(valueToReturn)
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

    for (let i=0; i<gameBoard.boardArray.length; i++) {
        const button = document.createElement("button")
        button.setAttribute("id", "square-button " + (i+1))        
        content.appendChild(button)
        eventListeners(button, (i))
    }

    container.appendChild(content)
})()