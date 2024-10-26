// Tic tac toe

function createPlayer(name, id) {
  const wins = 0;
  const addGameWon = () => {
    wins += 1;
  };

  return { name, id, wins };
}

function createGameboard() {
  const board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const cleanBoard = () => {
    board.forEach((row) => {
      row.fill(0);
    });
  };

  const updateBoard = (row, column, playerId) => {
    if (board[row][column] === 2 || board[row][column] === 1) {
        return false
    }
    board[row][column] = playerId;
    return true
  };

  const checkWon = (playerId) => {
    const checkRow = board.some(row => row.every(value => value === playerId))
    
    let checkColumn = false;

    for (let colIndex = 0; colIndex < 3; colIndex++){
        let allPlayerId = true;

        for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
            if (arr[rowIndex][colIndex] !== playerId) {
                allZeros = false;
                break;
            }
        }

        if (allPlayerId) {
            hasZeroColumn = true;
            break;
        }
    } 
    return checkColumn || checkRow
    }
  }

  const checkDraw = () => {
    return board.every(row => {
        row.every(value => value !==0)
    })
  }

  return { board, cleanBoard, updateBoard, checkWon, checkDraw };
}


function createGame(player1, player2) {
  const gameBoard = createGameboard();
  const turn = 0;

  updateTurn = () => {
    turn += 1;
  };

  checkTurnPlayer = () => {
    if (turn % 2 === 0){
        return player2
    }
    return player1
  }

  return {player1, player2, gameBoard, turn, updateTurn };
}



function gameController() {
  const player1 = createPlayer("test", 1);
  const player2 = createPlayer("test2", 2);
  const game = createGame(player1, player2)

  while (!game.gameBoard.checkDraw || !game.gameBoard.checkWon){
    game.updateTurn()
    game.checkTurnPlayer()
    game.board.updateBoard()
  }  

}
