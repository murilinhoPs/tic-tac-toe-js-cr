import math
import copy

X = "X"
O = "O"
EMPTY = None


def initial_state():
    return [[EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY]]


def count(board):
    count_x, count_o = (0, 0)
    for i in range(3):
        for j in range(3):
            if board[i][j] == X:
                count_x += 1
            elif board[i][j] == O:
                count_o += 1
    return count_x, count_o


def player(board):
    count_x, count_o = count(board)
    if count_o + count_x == 0:
        return X
    elif count_x > count_o and count_x + count_o != 9:
        return O
    elif count_x == count_o and count_x + count_o != 9:
        return X
    elif count_x + count_o == 9:
        return X


def actions(board):
    action = []
    for i in range(3):
        for j in range(3):
            if board[i][j] == EMPTY:
                action.append((i, j))
    return action


def result(board, action):
    board_copy = copy.deepcopy(board)
    if not action in actions(board):
        raise Exception
    else:
        move = player(board_copy)
        i, j = action
        board_copy[i][j] = move
        return board_copy


def winner(board):
    for i in range(3):
        if board[i][0] == board[i][1] == board[i][2] and board[i][0] != EMPTY:
            return board[i][2]
        elif board[0][i] == board[1][i] == board[2][i] and board[0][i] != EMPTY:
            return board[2][i]

    if board[0][0] == board[1][1] == board[2][2] and board[0][0] != EMPTY:
        return board[0][0]
    elif board[0][2] == board[1][1] == board[2][0] and board[2][0] != EMPTY:
        return board[0][2]
    else:
        return None


def terminal(board):
    count_x, count_o = count(board)
    if count_x + count_o == 9 or winner(board) != None:
        return True
    else:
        return False


def utility(board):
    if winner(board) == X:
        return 1
    elif winner(board) == O:
        return -1
    elif winner(board) == None:
        return 0


def minimax(board):
    if terminal(board):
        return None
    if player(board) == X:
        vI = -math.inf
        move = set()
        for action in actions(board):
            v = min_value(result(board, action))
            if v > vI:
                vI = v
                move = action
    elif player(board) == O:
        vI = math.inf
        move = set()
        for action in actions(board):
            v = max_value(result(board, action))
            if v < vI:
                vI = v
                move = action
    return move


def max_value(board):
    if terminal(board):
        return utility(board)
    v = -math.inf
    for action in actions(board):
        v = max(v, min_value(result(board, action)))
    return v


def min_value(board):
    if terminal(board):
        return utility(board)
    v = math.inf
    for action in actions(board):
        v = min(v, max_value(result(board, action)))
    return v
