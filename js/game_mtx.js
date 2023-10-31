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

const ai = 'X'
const human = 'O'
let currentPlayer = human

let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
]

const returnFlatBoard = () => board.flatMap((boardRow) => boardRow)

const inPositionRange = (position) => position >= 0 && position <= 8

const hasMatch3 = (a, b, c) => a == b && b == c && a != ''

function isInt(value) {
  if (isNaN(value)) {
    return false
  }
  const x = parseFloat(value)
  return (x | 0) === x
}

function validateMove(position) {
  const flatBoard = returnFlatBoard()
  const notOccupied = flatBoard[position] === ''

  return isInt(position) && inPositionRange(position) && notOccupied
}

function markBoard(position, mark) {
  const flatBoard = returnFlatBoard()
  flatBoard[position] = mark.toUpperCase()
  board = [flatBoard.slice(0, 3), flatBoard.slice(3, 6), flatBoard.slice(6, 9)]
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
      board[0][0] +
      ' | ' +
      board[0][1] +
      ' | ' +
      board[0][2] +
      '\n' +
      '--------\n' +
      ' ' +
      board[1][0] +
      ' | ' +
      board[1][1] +
      ' | ' +
      board[1][2] +
      '\n' +
      '--------\n' +
      ' ' +
      board[2][0] +
      ' | ' +
      board[2][1] +
      ' | ' +
      board[2][2] +
      '\n',
  )
}

function checkWinner() {
  let winner = null

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

  if (winner === null && leftSpots === 0) {
    return 'Velha!'
  } else {
    return winner
  }
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

    if (checkWinner() === ai) {
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
    if (checkWinner() === human) {
      console.log('Winner Winner!')
      prompt.stop()
      return
    }

    playTurn(ai)
  })
}

function optimalMove() {
  let bestScore = -1000
  let bestPos

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        board[i][j] = ai
        let score = minimax(board, 0, false)
        board[i][j] = ''
        if (score > bestScore) {
          bestScore = score
          bestPos = { i, j }
        }
      }
    }
  }
  board[bestPos.i][bestPos.j] = ai
}

function minimax(board, depth, isMax) {
  let result = checkWinner()
  if (result !== null) {
    return minMaxScores[result]
  }

  if (isMax) {
    let bestScore = -1000
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = ai
          let score = minimax(board, depth + 1, false)
          board[i][j] = ''
          if (score > bestScore) {
            bestScore = score
          }
        }
      }
    }
    return bestScore
  } else {
    let bestScore = 1000
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = human
          let score = minimax(board, depth + 1, true)
          board[i][j] = ''
          if (score < bestScore) {
            bestScore = score
          }
        }
      }
    }
    return bestScore
  }
}

logPrompt()

playTurn(currentPlayer)
