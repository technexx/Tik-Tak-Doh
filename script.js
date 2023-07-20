
const heading = document.querySelector("#heading")
const container = document.querySelector(".container")

let EMPTY_SQUARE = 0
let PLAYER_SQUARE = 1
let OPPONENT_SQUARE = 2

heading.innerText = "Player Turn"

const gameBoard = (() => {
    let boardArray = []

    for (let i=0; i<9; i++) {
        boardArray.push(EMPTY_SQUARE)
    }

    const playerMove = (index) => {
        if (spaceFree(boardArray[index])) {
            boardArray.splice(index, 1, PLAYER_SQUARE)
            fillPlayerSquare(index)
            console.log("array from player move is " + boardArray)
        } else {
            console.log("space occupied!")
        }
    }

    const opponentMove = (index) => {
        if (spaceFree(boardArray[index])) {
            boardArray.splice(index, 1, OPPONENT_SQUARE)
            fillOpponentSquare(index)
            console.log("array from opponent move is " + boardArray)
        } else {
            console.log("space occupied!")
        }    
    }

    const spaceFree = (index) => { return index === 0 }
    return {playerMove, opponentMove, boardArray}
})()

function boardHasOddEmptySpaces() {
    let emptySpaces = 0
    for (let i=0; i<gameBoard.boardArray.length; i++) {
        if (gameBoard.boardArray[i] === 0) emptySpaces++
    }

    console.log(emptySpaces)
    if (emptySpaces % 2 !== 0) return true; else return false
}

function eventListeners (button, index) {
    button.addEventListener("click", () => {
        if (boardHasOddEmptySpaces()) {
            heading.innerText = "Player Turn"
            gameBoard.playerMove(index)
        } else {
            heading.innerText = "Opponent Turn"
            gameBoard.opponentMove(index)
        }
    })
}

function fillPlayerSquare (index)  {
    const buttons = document.querySelectorAll("[id^='square-button']")
    buttons[index].style.backgroundImage="url(./images/o-icon.svg)"
}

function fillOpponentSquare (index)  {
    const buttons = document.querySelectorAll("[id^='square-button']")

    //Todo: o-icon works
    buttons[index].style.backgroundImage="url(./images/x-icon.svg)"
}

const Player = (name) => {
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