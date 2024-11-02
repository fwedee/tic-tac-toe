// Gameboard Module
const Gameboard = (() => {
  let board = Array(9).fill("");
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const getBoard = () => board;
  const setCell = (index, marker) => {
    if (index >= 0 && index < 9 && board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };
  const reset = () => {
    board = Array(9).fill("");
  };
  const checkWin = (player) => {
    for (let combo of winningCombos) {
      if (combo.every((index) => board[index] === player)) {
        return combo;
      }
    }
    return null;
  };
  const isFull = () => board.every((cell) => cell !== "");

  return { getBoard, setCell, reset, checkWin, isFull };
})();

// Player Factory
const Player = (name, marker) => {
  let score = 0;
  const getName = () => name;
  const getMarker = () => marker;
  const getScore = () => score;
  const incrementScore = () => score++;
  const resetScore = () => (score = 0);
  const setName = (newName) => (name = newName || `Player ${marker}`);

  return { getName, getMarker, getScore, incrementScore, resetScore, setName };
};

// Display Controller Module
const DisplayController = (() => {
  const updateBoard = () => {
    const board = Gameboard.getBoard();
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      const span = cell.querySelector("span");
      span.textContent = board[index];
    });
  };

  const updateStatus = (message) => {
    const status = document.getElementById("turn");
    status.textContent = message;
  };

  const updateScoreboard = (playerX, playerO, draws) => {
    document.getElementById("score-x").textContent = playerX.getScore();
    document.getElementById("score-o").textContent = playerO.getScore();
    document.getElementById("score-draw").textContent = draws;
  };

  const highlightWinningCells = (combo) => {
    combo.forEach((index) => {
      document
        .querySelector(`[data-index="${index}"]`)
        .classList.add("win-cell");
    });
  };

  const createBoard = (handleCellClick) => {
    const board = document.querySelector(".board");
    board.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("button");
      cell.className = "cell";
      cell.setAttribute("data-index", i);
      const span = document.createElement("span");
      cell.appendChild(span);
      cell.addEventListener("click", handleCellClick);
      board.appendChild(cell);
    }
  };

  const resetBoardDisplay = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      const span = cell.querySelector("span");
      span.textContent = "";
      span.classList.remove("show");
      cell.classList.remove("win-cell");
    });
  };

  return {
    updateBoard,
    updateStatus,
    updateScoreboard,
    highlightWinningCells,
    createBoard,
    resetBoardDisplay,
  };
})();

// Game Controller Module
const GameController = (() => {
  let playerX = Player("Player X", "X");
  let playerO = Player("Player O", "O");
  let currentPlayer = playerX;
  let gameActive = true;
  let draws = 0;

  const initialize = () => {
    DisplayController.createBoard(handleCellClick);
    DisplayController.updateStatus(`${currentPlayer.getName()}'s turn`);
  };

  const handleCellClick = (e) => {
    if (!gameActive) return;

    const cell = e.target.closest(".cell");
    const index = cell.getAttribute("data-index");

    if (Gameboard.setCell(index, currentPlayer.getMarker())) {
      DisplayController.updateBoard();
      checkGameEnd();
    }
  };

  const checkGameEnd = () => {
    const winningCombo = Gameboard.checkWin(currentPlayer.getMarker());

    if (winningCombo) {
      gameActive = false;
      currentPlayer.incrementScore();
      DisplayController.highlightWinningCells(winningCombo);
      DisplayController.updateStatus(`${currentPlayer.getName()} wins!`);
      DisplayController.updateScoreboard(playerX, playerO, draws);
    } else if (Gameboard.isFull()) {
      gameActive = false;
      draws++;
      DisplayController.updateStatus("It's a draw!");
      DisplayController.updateScoreboard(playerX, playerO, draws);
    } else {
      currentPlayer = currentPlayer === playerX ? playerO : playerX;
      DisplayController.updateStatus(`${currentPlayer.getName()}'s turn`);
    }
  };

  const resetGame = () => {
    Gameboard.reset();
    gameActive = true;
    currentPlayer = playerX;
    DisplayController.resetBoardDisplay();
    DisplayController.updateStatus(`${currentPlayer.getName()}'s turn`);
  };

  const resetScores = () => {
    playerX.resetScore();
    playerO.resetScore();
    draws = 0;
    DisplayController.updateScoreboard(playerX, playerO, draws);
    resetGame();
  };

  const setPlayerNames = (xName, oName) => {
    playerX.setName(xName);
    playerO.setName(oName);
    document.getElementById("label-x").textContent = playerX.getName();
    document.getElementById("label-o").textContent = playerO.getName();
    DisplayController.updateStatus(`${currentPlayer.getName()}'s turn`);
  };

  const startGame = () => {
    const xName = document.getElementById("player-x").value.trim();
    const oName = document.getElementById("player-o").value.trim();
    setPlayerNames(xName, oName);
    document.getElementById("name-modal").style.display = "none";
    resetGame();
  };

  const changeNames = () => {
    document.getElementById("player-x").value = playerX.getName();
    document.getElementById("player-o").value = playerO.getName();
    document.getElementById("name-modal").style.display = "flex";
  };

  return {
    initialize,
    resetGame,
    resetScores,
    startGame,
    changeNames,
  };
})();

// Initialize the game
GameController.initialize();
