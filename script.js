//Todo: Player Record updating too much, likely because playerCanClick is true too much.
//Todo: Easy (random) and Hard (current) difficulties.
//Todo: Optimized minmax

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
                if (GameController.gameIsActive) {
                    if (!GameBoard.boardIsFull()) {
                        if (isSpaceFree(GameBoard.boardArray[index])) {
                            if (GameController.playerTurn()) {
                              GameController.playerActions(index)
                              setPlayerClickBoolean(false)
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
                        GameController.setGameIsActiveBoolean(false)
                        GameController.updatePlayerRecord()
                    }
                }
            }
        })
    }

    const setPlayerClickBoolean = (canClick) => { playerCanClick = canClick }

    const isSpaceFree = (index) => { return index === 0 }

    return {setPlayerClickBoolean}
})()


const GameBoard = (() => {
    const player = Player()

    let EMPTY_SQUARE = 0
    let boardArray = []
    let emptySquareArray = []
    let emptySquareScores = []

    for (let i=0; i<9; i++) {
        boardArray.push(EMPTY_SQUARE)
        emptySquareArray.push(EMPTY_SQUARE)
        emptySquareScores.push(0)
    }

    const boardIsFull = () => { return !GameBoard.boardArray.includes(0) }

    const updateEmptySquareArray = () => {
        emptySquareArray.length = 0

        for (let i=0; i<boardArray.length; i++) {
            if (boardArray[i] === 0) emptySquareArray.push(i)
        }
    }

    return {boardIsFull, boardArray, emptySquareArray, emptySquareScores, updateEmptySquareArray, player}
})()

const DisplayController = (() => {
    const clearBoardArray = () => {
        for (let i=0; i<GameBoard.boardArray.length; i++) {
            GameBoard.boardArray.splice(i, 1, 0)
        }
    }
    
    const clearPlayerAndOpponentArrays = () => {
        GameController.playerArray.length = 0
        GameController.opponentArray.length = 0
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
    let playerArray = []
    let opponentArray = []
    let PLAYER_SQUARE = 1
    let OPPONENT_SQUARE = 2
    let gameIsActive = true

    const setGameIsActiveBoolean = (isActive) => {gameIsActive = isActive}

    const playerActions = (index) => {
        playerMove(index)
        heading.innerText = "Opponent's Turn"
    }

    const playerMove = (index) => {
        GameBoard.boardArray.splice(index, 1, PLAYER_SQUARE)
        playerArray.push(index)
        fillPlayerSquare(index)
        GameBoard.updateEmptySquareArray()
    }

    const opponentMove = (index) => {
        GameBoard.boardArray.splice(index, 1, OPPONENT_SQUARE)
        opponentArray.push(index)
        fillOpponentSquare(index)
        GameBoard.updateEmptySquareArray()
    }

    const fillPlayerSquare = (index) => {
        const buttons = document.querySelectorAll("[id^='square-button']")
        buttons[index].style.backgroundImage="url(./images/o-icon.svg)"
    }
    
    const fillOpponentSquare = (index) => {
        const buttons = document.querySelectorAll("[id^='square-button']")
        buttons[index].style.backgroundImage="url(./images/x-icon.svg)"
    }
    
    const aiActions = () => { 
        checkFutureGameWin()
    
        setTimeout(function() {
            opponentMove(getBestAIMovePosition())
            endGameIfWon()
            if (GameController.gameIsActive) {
                heading.innerText = "Player's Turn"
            }
            BoardDom.setPlayerClickBoolean(true)
        }, 1000) 
    }

    const playerTurn = () => {
        let emptySpaces = 0
    
        for (let i=0; i<GameBoard.boardArray.length; i++) {
            if (GameBoard.boardArray[i] === 0) emptySpaces++
        }
        return (emptySpaces % 2 !== 0)
    }

    const endGameIfWon = () => {
        if (checkCurrentGameWin() !== "Tie") {
            updatePlayerRecord()
            heading.innerText = checkCurrentGameWin()
            GameController.setGameIsActiveBoolean(false)
        }
    }

    const updatePlayerRecord = () => {
        if (checkCurrentGameWin() === "Player Win") updateWins("Player")
        if (checkCurrentGameWin() === "Opponent Win") updateWins("Opponent")
        if (checkCurrentGameWin() === "Tie") updateWins("Tie")
    
        playerStatsText.innerText = GameBoard.player.wins + " - " + GameBoard.player.losses + " - " + GameBoard.player.ties
    }

    
    const updateWins = (whoWins) => {
        if (whoWins === "Player") GameBoard.player.wins ++
        if (whoWins === "Opponent") GameBoard.player.losses ++
        if (whoWins === "Tie") GameBoard.player.ties ++
    }
    
    const checkCurrentGameWin = () => {
        let valueToReturn = "Tie"
    
        const allWinsArray = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ]
    
        for (let i=0; i<allWinsArray.length; i++) {
            if (allWinsArray[i].every(array => GameController.playerArray.includes(array))) {
                valueToReturn = "Player Win"
            }
    
            if (allWinsArray[i].every(array => GameController.opponentArray.includes(array))) {
                valueToReturn = "Opponent Win"
            }
        }
        return valueToReturn
    }

    const checkFutureGameWin = () => {
        let moveValue = 0
    
        const allWinsArray = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ]
    
        resetEmptySquareScoresArray()
    
        for (let i=0; i<GameBoard.emptySquareArray.length; i++) {
            valueToReturn = 0
    
            const playerCheck =  JSON.parse(JSON.stringify(playerArray)); 
            const opponentCheck =  JSON.parse(JSON.stringify(opponentArray)); 
    
            playerCheck.push(GameBoard.emptySquareArray[i])
            opponentCheck.push(GameBoard.emptySquareArray[i])
    
            allWinsArray.forEach(function(value, index) {
                if (allWinsArray[index].every(array => playerCheck.includes(array))) {
                    moveValue = 10
                    GameBoard.emptySquareScores.splice(GameBoard.emptySquareArray[i], 1, moveValue)    
                }
            })
    
            allWinsArray.forEach(function(value, index) {
                if (allWinsArray[index].every(array => opponentCheck.includes(array))) {
                    moveValue = 20
                    GameBoard.emptySquareScores.splice(GameBoard.emptySquareArray[i], 1, moveValue)
                }
            })
        }
    }

    const resetEmptySquareScoresArray = () => {
        GameBoard.emptySquareScores.length = 0
        for (let i=0; i<9; i++) { GameBoard.emptySquareScores.push(0) }
    }

    const getBestAIMovePosition = () => {
        let score = 0
        let position = 0
        let nonNeutralMove = true
        let neutralMoveArray = []
        
        for (let i=0; i<GameBoard.emptySquareArray.length; i++) {
            if (GameBoard.emptySquareScores[GameBoard.emptySquareArray[i]] > score) {
                score = GameBoard.emptySquareScores[GameBoard.emptySquareArray[i]]
                position = GameBoard.emptySquareArray[i]
                nonNeutralMove = false
            } else {
                neutralMoveArray.push(GameBoard.emptySquareArray[i])
            }
        }
    
        if (nonNeutralMove) {
            const random = Math.floor(Math.random() * neutralMoveArray.length)
            position = neutralMoveArray[random]
        }

        return position
    }

    return {gameIsActive, setGameIsActiveBoolean, playerArray, opponentArray, playerActions, aiActions, playerTurn, endGameIfWon, updatePlayerRecord}
})()

resetButton.addEventListener("click", () => {
    DisplayController.clearSquaresImages()
    DisplayController.clearBoardArray()
    DisplayController.clearPlayerAndOpponentArrays()
    DisplayController.clearEmptyAndScoreSquareArrays()
    GameController.setGameIsActiveBoolean(true)
    BoardDom.setPlayerClickBoolean(true)
    heading.innerText = "Player's Turn"
})

// function getRandomInt(max) {
//     return Math.floor(Math.random() * max);
//   }