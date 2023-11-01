/*  A simple Tic-Tac-Toe game implemented in Javascrip

Players 'X' and 'O' take turn inputing their position on the command line using numbers 1-9

1 | 2 | 3
---------
4 | 5 | 6
---------
7 | 8 | 9

*/

// prompt for nodejs is required: https://github.com/flatiron/prompt
// npm install prompt
const prompt = require('prompt')

const width = 3
const height = 3

const minMaxScores = {
  X: 10,
  O: -10,
  Velha: 0,
}

const minimizer = 'O'
const maximizer = 'X'

const ai = 'O' // * minimizer
const human = 'X' // * maximizer
let currentPlayer = human

let gameBoard = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
]

const returnFlatBoard = (board) => board.flatMap((boardRow) => boardRow)

const inPositionRange = (position) => position >= 0 && position <= 8

const hasMatch3 = (a, b, c) => a === b && b === c && a === c && a !== ''

function isInt(value) {
  if (isNaN(value)) {
    return false
  }
  const x = parseFloat(value)
  return (x | 0) === x
}

function validateMove(position) {
  const flatBoard = returnFlatBoard(gameBoard)
  const notOccupied = flatBoard[position] === ''

  return isInt(position) && inPositionRange(position) && notOccupied
}

function markBoard(position, mark) {
  const flatBoard = returnFlatBoard(gameBoard)
  flatBoard[position] = mark.toUpperCase()
  gameBoard = [
    flatBoard.slice(0, 3),
    flatBoard.slice(3, 6),
    flatBoard.slice(6, 9),
  ]
}

function logPrompt() {
  console.log(
    'Game started: \n' +
      ' 1 | 2 | 3 \n' +
      ' ---------- \n' +
      ' 4 | 5 | 6 \n' +
      ' ---------- \n' +
      ' 7 | 8 | 9 \n',
  )
}

function printBoard() {
  console.log(
    '\n' +
      ' ' +
      gameBoard[0][0] +
      ' | ' +
      gameBoard[0][1] +
      ' | ' +
      gameBoard[0][2] +
      '\n' +
      '--------\n' +
      ' ' +
      gameBoard[1][0] +
      ' | ' +
      gameBoard[1][1] +
      ' | ' +
      gameBoard[1][2] +
      '\n' +
      '--------\n' +
      ' ' +
      gameBoard[2][0] +
      ' | ' +
      gameBoard[2][1] +
      ' | ' +
      gameBoard[2][2] +
      '\n',
  )
}

function checkWinner(board) {
  let winner = ''

  // vertical match
  for (let j = 0; j < height; j++) {
    if (hasMatch3(board[0][j], board[1][j], board[2][j])) {
      winner = board[0][j]
    }
  }

  // horizontal match
  for (let i = 0; i < width; i++) {
    if (hasMatch3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0]
    }
  }

  // diagonals match
  if (hasMatch3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0]
  } else if (hasMatch3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0]
  }

  let leftSpots = 0
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (board[i][j] == '') {
        leftSpots++
      }
    }
  }

  if (winner === '' && leftSpots === 0) {
    return 'Velha!'
  }
  return winner
}

function playTurn(player) {
  currentPlayer = player
  console.log('Your turn player: ' + currentPlayer)

  if (currentPlayer === ai) {
    //TODO do AI turn, after that call playTurn(human)
    // let randomPos = 0
    // do {
    //   randomPos = Math.floor(Math.random() * 9)
    // } while (!validateMove(randomPos))
    // markBoard(randomPos, ai)
    optimalMove()
    printBoard()

    if (checkWinner(gameBoard) === ai) {
      console.log('You lost, AI wins!')
      prompt.stop()
      return
    }
    playTurn(human)
    return
  }

  prompt.start()
  prompt.get(['position'], function (err, result) {
    if (!validateMove(result.position - 1)) {
      console.log('incorrect input please try again...')
      playTurn(human)
      return
    }
    markBoard(result.position - 1, human)
    printBoard()
    if (checkWinner(gameBoard) === human) {
      console.log('Winner Winner!')
      prompt.stop()
      return
    }

    playTurn(ai)
  })
}

function optimalMove() {
  const result = minimax(gameBoard, 0, false)
  console.log(result)
  const position = result.position

  gameBoard[position.x][position.y] = ai
}

function minimax(board, depth, isMax) {
  let result = checkWinner(board)
  if (result !== '') {
    return { score: minMaxScores[result] }
  }

  let moves = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (gameBoard[row][col] == '') {
        var move = {}
        move.position = { x: row, y: col }

        if (isMax) {
          gameBoard[row][col] = human
          const result = minimax(board, depth + 1, false)
          move.score = result ? result.score : 1000
        } else {
          gameBoard[row][col] = ai
          const result = minimax(board, depth + 1, true)
          move.score = result ? result.score : -1000
        }
        gameBoard[row][col] = ''

        moves.push(move)
      }
    }
  }

  let bestMove, bestScore
  if (isMax) {
    bestScore = -1000
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score
        bestMove = i
      }
    }
  } else {
    bestScore = 1000
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score
        bestMove = i
      }
    }
  }
  console.error(moves[bestMove])
  return moves[bestMove]
}

logPrompt()

playTurn(currentPlayer)
