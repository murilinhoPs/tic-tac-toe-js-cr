/*  A simple Tic-Tac-Toe game implemented in Javascript

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

const tie = 'Velha!'
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
  console.log('\n' +
  ' ' + gameBoard[0][0] + ' | ' + gameBoard[0][1] + ' | ' + gameBoard[0][2] + '\n' +
  ' ---------\n' +
  ' ' + gameBoard[1][0] + ' | ' + gameBoard[1][1] + ' | ' + gameBoard[1][2] + '\n' +
  ' ---------\n' +
  ' ' + gameBoard[2][0] + ' | ' + gameBoard[2][1] + ' | ' + gameBoard[2][2] + '\n');
}

function checkWinner(board) {
  let winner = null

  // vertical match
  for (let col = 0; col < height; col++) {
    if (hasMatch3(board[0][col], board[1][col], board[2][col])) {
      winner = board[0][col]
    }
  }

  // horizontal match
  for (let row = 0; row < width; row++) {
    if (hasMatch3(board[row][0], board[row][1], board[row][2])) {
      winner = board[row][0]
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
  }
  return winner
}

function humanTurn() {
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

function aiTurn() {
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
}

function playTurn(player) {
  const checkTie = checkWinner(gameBoard)
  if (checkTie === tie) {
    console.log(checkTie)
    prompt.stop()
    return
  }

  currentPlayer = player
  const [playerName] =
    currentPlayer == ai ? Object.keys({ ai }) : Object.keys({ human })
  console.log(`Your turn player: ${currentPlayer} -> ${playerName}`)

  if (currentPlayer === ai) {
    aiTurn()
    return
  }

  humanTurn()
}

function optimalMove() {
  const result = minimax(gameBoard, 0, false)
  const position = result.position

  gameBoard[position.x][position.y] = ai
}

function minimax(board, depth, isMax) {
  const result = checkWinner(board)
  if (result !== null) {
    return { score: minMaxScores[result] }
  }

  let moves = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (gameBoard[row][col] == '') {
        let move = {}
        move.position = { x: row, y: col }

        if (isMax) {
          gameBoard[row][col] = human
          const result = minimax(board, depth + 1, false)
          move.score = result ? result.score : null
        } else {
          gameBoard[row][col] = ai
          const result = minimax(board, depth + 1, true)
          move.score = result ? result.score : null
        }
        gameBoard[row][col] = ''

        moves.push(move)
      }
    }
  }

  let bestMove, bestScore
  if (isMax) {
    bestScore = -Infinity
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score
        bestMove = i
      }
    }
  } else {
    bestScore = Infinity
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score
        bestMove = i
      }
    }
  }
  return moves[bestMove]
}

logPrompt()

playTurn(currentPlayer)
