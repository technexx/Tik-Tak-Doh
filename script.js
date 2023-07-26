
const heading = document.querySelector("#heading")
const container = document.querySelector(".container")
const playerStatsText = document.querySelector("#win-count")
const resetButton = document.querySelector("#reset-button")

heading.innerText = "Player's Turn"
playerStatsText.innerText = "0 - 0 - 0"

const Player = () => {
    let wins = 0
    let losses = 0
    let ties = 0

    return {wins, losses, ties}
}

const BoardDom = (() => {
    const content = document.createElement("div")
    content.classList.add("squares")

    let playerCanClick = true

    for (let i=0; i<9; i++) {
        const button = document.createElement("button")
        button.setAttribute("id", "square-button " + (i+1))        
        content.appendChild(button)
        eventListeners(button, (i))
    }
    container.appendChild(content)

    function eventListeners (button, index) {
        button.addEventListener("click", () => {
            if (playerCanClick) {
                if (GameBoard.gameIsActive) {
                    if (!GameBoard.boardIsFull()) {
                        if (isSpaceFree(GameBoard.boardArray[index])) {
                            if (GameController.playerTurn()) {
                              GameController.playerActions(index)
                              togglePlayerClick()
                        }
                        GameController.endGameIfWon()
                        if (!GameBoard.boardIsFull()) {
                            GameController.aiActions()
                        }
                        }
                    } else {
                        console.log("board is full")
                    }
            
                    //If last click has filled board.
                    if (GameBoard.boardIsFull()) {
                        heading.innerText = "Tie"
                        GameBoard.gameIsActive = false
                        GameController.updatePlayerRecord()
                    }
                }
            }
        })
    }

    const togglePlayerClick = () => { playerCanClick = !playerCanClick }

    const isSpaceFree = (index) => { return index === 0 }

    return {togglePlayerClick}
})()


const GameBoard = (() => {
    const player = Player()

    let EMPTY_SQUARE = 0
    let PLAYER_SQUARE = 1
    let OPPONENT_SQUARE = 2

    let boardArray = []
    let playerArray = []
    let opponentArray = []
    let emptySquareArray = []
    let emptySquareScores = []

    let gameIsActive = true

    for (let i=0; i<9; i++) {
        boardArray.push(EMPTY_SQUARE)
        emptySquareArray.push(EMPTY_SQUARE)
        emptySquareScores.push(0)
    }
        
    const playerMove = (index) => {
        boardArray.splice(index, 1, PLAYER_SQUARE)
        playerArray.push(index)
        fillPlayerSquare(index)
        updateEmptySquareArray()
    }

    const opponentMove = (index) => {
        boardArray.splice(index, 1, OPPONENT_SQUARE)
        opponentArray.push(index)
        fillOpponentSquare(index)
        updateEmptySquareArray()
    }

    const fillPlayerSquare = (index) => {
        const buttons = document.querySelectorAll("[id^='square-button']")
        buttons[index].style.backgroundImage="url(./images/o-icon.svg)"
    }
    
    const fillOpponentSquare = (index) => {
        const buttons = document.querySelectorAll("[id^='square-button']")
        buttons[index].style.backgroundImage="url(./images/x-icon.svg)"
    }

    const updateWins = (whoWins) => {
        if (whoWins === "Player") player.wins ++
        if (whoWins === "Opponent") player.losses ++
        if (whoWins === "Tie") player.ties ++
    }

    const boardIsFull = () => { return !GameBoard.boardArray.includes(0) }

    const updateEmptySquareArray = () => {
        emptySquareArray.length = 0

        for (let i=0; i<boardArray.length; i++) {
            if (boardArray[i] === 0) emptySquareArray.push(i)
        }
    }

    return {boardIsFull, playerMove, opponentMove, boardArray, playerArray,opponentArray, emptySquareArray, emptySquareScores, gameIsActive, updateWins, player}
})()

const DisplayController = (() => {
    const clearBoardArray = () => {
        for (let i=0; i<GameBoard.boardArray.length; i++) {
            GameBoard.boardArray.splice(i, 1, 0)
        }
    }
    
    const clearPlayerAndOpponentArrays = () => {
        GameBoard.playerArray.length = 0
        GameBoard.opponentArray.length = 0
    }
    
    const clearEmptyAndScoreSquareArrays = () => {
        GameBoard.emptySquareArray.length = 0
        GameBoard.emptySquareScores.length = 0
    }
    
    const clearSquaresImages = () => {
        const buttons = document.querySelectorAll("[id^='square-button']")
        for (let i=0; i<buttons.length; i++) {
            buttons[i].style.backgroundImage="url()"
        }
    }

    return {clearBoardArray, clearPlayerAndOpponentArrays, clearEmptyAndScoreSquareArrays, clearSquaresImages}
})()

const GameController = (() => {
    const playerActions = (index) => {
        GameBoard.playerMove(index)
        heading.innerText = "Opponent's Turn"
    }
    
    const aiActions = () => { 
        checkFutureGameWin()
    
        setTimeout(function() {
            GameBoard.opponentMove(getBestAIMovePosition())
            endGameIfWon()
            if (GameBoard.gameIsActive) {
                heading.innerText = "Player's Turn"
            }
            BoardDom.togglePlayerClick()
        }, 1000) 
    }

    const playerTurn = () => {
        let emptySpaces = 0
    
        for (let i=0; i<GameBoard.boardArray.length; i++) {
            if (GameBoard.boardArray[i] === 0) emptySpaces++
        }
        if (emptySpaces % 2 !== 0) return true; else return false
    }

    const endGameIfWon = () => {
        if (checkCurrentGameWin() !== "Tie") {
            updatePlayerRecord()
            heading.innerText = checkCurrentGameWin()
            GameBoard.gameIsActive = false
        }
    }

    const updatePlayerRecord = () => {
        if (checkCurrentGameWin() === "Player Win") GameBoard.updateWins("Player")
        if (checkCurrentGameWin() === "Opponent Win") GameBoard.updateWins("Opponent")
        if (checkCurrentGameWin() === "Tie") GameBoard.updateWins("Tie")
    
        playerStatsText.innerText = GameBoard.player.wins + " - " + GameBoard.player.losses + " - " + GameBoard.player.ties
    }
    
    const checkCurrentGameWin = () => {
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
        return valueToReturn
    }

    const checkFutureGameWin = () => {
        let moveValue = 0
    
        const allWinsArray = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ]
    
        resetEmptySquareScoresArray()
    
        console.log("empty board array is " + GameBoard.emptySquareArray)
    
        for (let i=0; i<GameBoard.emptySquareArray.length; i++) {
            valueToReturn = 0
    
            const playerCheck =  JSON.parse(JSON.stringify(GameBoard.playerArray)); 
            const opponentCheck =  JSON.parse(JSON.stringify(GameBoard.opponentArray)); 
    
            playerCheck.push(GameBoard.emptySquareArray[i])
            opponentCheck.push(GameBoard.emptySquareArray[i])
    
            allWinsArray.forEach(function(value, index) {
                if (allWinsArray[index].every(array => playerCheck.includes(array))) {
                    moveValue = 10
                    GameBoard.emptySquareScores.splice(GameBoard.emptySquareArray[i], 1, moveValue)
                    console.log("square scores are " + GameBoard.emptySquareScores)
    
                }
            })
    
            allWinsArray.forEach(function(value, index) {
                if (allWinsArray[index].every(array => opponentCheck.includes(array))) {
                    moveValue = 20
                    GameBoard.emptySquareScores.splice(GameBoard.emptySquareArray[i], 1, moveValue)
                    console.log("square scores are " + GameBoard.emptySquareScores)
                }
            })
        }
        console.log("square scores are " + GameBoard.emptySquareScores)
    }

    const resetEmptySquareScoresArray = () => {
        GameBoard.emptySquareScores.length = 0
        for (let i=0; i<9; i++) { GameBoard.emptySquareScores.push(0) }
    }

    return {playerActions, aiActions, playerTurn, endGameIfWon, updatePlayerRecord}
})()

function getBestAIMovePosition() {
    let score = 0
    let position = 0
    let nonNeutralMove = true
    let neutralMoveArray = []
    
    for (let i=0; i<GameBoard.emptySquareArray.length; i++) {
        if (GameBoard.emptySquareScores[GameBoard.emptySquareArray[i]] > score) {
            score = GameBoard.emptySquareScores[GameBoard.emptySquareArray[i]]
            position = GameBoard.emptySquareArray[i]
            nonNeutralMove = false

            console.log("score is " + score)
            console.log("scored position is " + position)
        } else {
            neutralMoveArray.push(GameBoard.emptySquareArray[i])
        }
    }

    if (nonNeutralMove) {
        const random = Math.floor(Math.random() * neutralMoveArray.length)
        position = neutralMoveArray[random]
        console.log("random neutral position is " + position)
    }

    console.log("final position is " + position)

    return position
}

resetButton.addEventListener("click", () => {
    DisplayController.clearSquaresImages()
    DisplayController.clearBoardArray()
    DisplayController.clearPlayerAndOpponentArrays()
    DisplayController.clearEmptyAndScoreSquareArrays()
    GameBoard.gameIsActive = true
    BoardDom.playerCanClick = true
    heading.innerText = "Player's Turn"
})

// function getRandomInt(max) {
//     return Math.floor(Math.random() * max);
//   }