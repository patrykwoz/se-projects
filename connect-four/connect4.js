/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */


class Player{
  constructor(color, playerId){
    this.color = color;
    this.playerId = playerId;
  }
  getColor(){
    return this.color;
  }
  getPlayerId(){
    return this.playerId;
  }
  setColor(color){
    this.color = color;
  }
}

class Game{
  constructor(width=7, height=6, player1, player2){
    this.width = width;
    this.height = height;

    this.player1 = player1;
    this.player2 = player2;

    this.currPlayer = this.player1;// active player: 1 or 2
    this.board =[]// array of rows, each row is array of cells  (board[y][x])
    this.gameStarted = false;



    this.startGame();
  }


  startGame(){
    const gameForm = document.querySelector('#game-form');
    gameForm.addEventListener('submit', this.handleSubmit.bind(this));
    
  }

  handleSubmit(evt){
    this.currPlayer = this.player1;// active player: 1 or 2
    this.board =[]// array of rows, each row is array of cells  (board[y][x])
    this.gameStarted = false;
    const board = document.getElementById('board');
    board.innerHTML = '';

    const color1 = evt.target.querySelector('#color-pl1');
    const color2 = evt.target.querySelector('#color-pl2');
    console.log(evt.target)
    evt.preventDefault();
    this.player1.setColor(color1.value);
    this.player2.setColor(color2.value);
    this.makeBoard();
    this.gameStarted = true;
    this.makeHtmlBoard();
    

  }

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
  const board = document.getElementById('board');

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');

  this.handleGameClick = this.handleClick.bind(this);
  top.addEventListener('click', this.handleGameClick );

  for (let x = 0; x < this.width; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  board.append(top);

  // make main part of board
  for (let y = 0; y < this.height; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < this.width; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }

    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
/** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer.getPlayerId()}`);
    piece.style.top = -50 * (y + 2);
    console.log('hello', this.currPlayer.getColor());
    piece.style.backgroundColor = this.currPlayer.getColor();

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    alert(msg);
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick );

  }

/** handleClick: handle click of column top to play piece */

handleClick(evt) {
  if (!this.gameStarted){
    window.alert("Game was not started. \nEnter Color for Respective Users \nand \nPress the Start Button.");
  }
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = this.findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  this.board[y][x] = this.currPlayer.getPlayerId();
  this.placeInTable(y, x);
  
  // check for win
  if (this.checkForWin()) {
    return this.endGame(`Player ${this.currPlayer.getPlayerId()} won!`);
  }
  
  // check for tie
  if (this.board.every(row => row.every(cell => cell))) {
    return this.endGame('Tie!');
  }
    
  // switch players
  this.currPlayer = this.currPlayer.getPlayerId() === '1' ? this.player2 : this.player1;
}



_win(cells) {
  // Check four cells to see if they're all color of current player
  //  - cells: list of four (y, x) cells
  //  - returns true if all are legal coordinates & all match currPlayer

  return cells.every(
    ([y, x]) =>
      y >= 0 &&
      y < this.height &&
      x >= 0 &&
      x < this.width &&
      this.board[y][x] === this.currPlayer.getPlayerId()
  );
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
checkForWin() {
  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
        return true;
      }
    }
  }
}


}



new Game(6, 7, new Player('magenta', '1'), new Player('cyan', '2'));