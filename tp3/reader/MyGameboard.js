/**
 * MyGameboard
 * @constructor
 */
 function MyGameboard(scene, du, dv) {
  //  this.scene = scene;
   // 	CGFobject.call(this,scene);
   MyBoard.call(this, scene, du, dv);

   this.auxBoard = this.scene.auxBoard;

   this.phases = ['Waiting For Start', 'Playing Game', 'Game Ended'];
   this.steps = ['Waiting For Initial Cell Pick', 'Waiting For Final Cell Pick'];

   this.paused = false;

   this.currentPhase = 0;
   this.currentPlayer = -1;
   this.currentStep = -1;
   this.startTime = -1;

   this.gameModes = ['Player vs Player', 'Player vs CPU', 'CPU vs CPU'];
   this.players = [['Player', 'Player'], ['Player','CPU'], ['CPU', 'CPU']];
   this.points = [-1,-1];
   this.gameMode = 0;

   this.botLevels = [1,1];

   this.moveHistory = [];
   this.initialCell = {};
   this.finalCell = {};

   this.validMoves = [];

   this.speed = 1;

   this.addPieces();
   this.placePieces();
 }

MyGameboard.prototype = Object.create(MyBoard.prototype);
MyGameboard.prototype.constructor = MyGameboard;

MyGameboard.prototype.getCurrentPlayerType = function() {
  return this.players[this.gameMode][this.currentPlayer];
};

MyGameboard.prototype.verifyEndGame = function() {
  var ended = true;
  for(var i = 0; i < this.matrix.length/2; i++){
    for(var j = 0; j < this.matrix[i].length; j++){
      if(this.matrix[i][j].piece){
        ended = false;
        break;
      }
    }
  }

  if(ended)
    return this.points[0] > this.points[1] ? 'Player 1 Won!' : 'Player 2 Won!';

  ended = true;
  for(var i = this.matrix.length/2; i < this.matrix.length; i++){
    for(var j = 0; j < this.matrix[i].length; j++){
      if(this.matrix[i][j].piece){
        ended = false;
        break;
      }
    }
  }

  if(ended)
    return this.points[0] > this.points[1] ? 'Player 1 Won!' : 'Player 2 Won!';
  else
    return null;
};

MyGameboard.prototype.nextStep = function(){
  this.currentStep = (this.currentStep + 1) % 2;
  if(this.currentStep === 0){
    this.currentPlayer = (this.currentPlayer + 1) % 2;
    var endGame = this.verifyEndGame();

    if(endGame){
      alert(endGame);
      this.currentPhase++;
    }
  }
};

MyGameboard.prototype.addUndoButton = function(){
  var interface = this.scene.interface;
  if(interface.game.undoBtn)
    return;

  interface.game.remove(interface.game.startBtn);

  var btn = { 'Undo':function(){
    this.undo();
  }.bind(this) };
  this.scene.interface.game.undoBtn = this.scene.interface.game.add(btn, 'Undo');

  if(interface.game.pauseBtn)
    return;
  this.scene.interface.game.pauseBtn = this.scene.interface.game.add(this,'paused').name('Paused');

  var btn = { 'Start Game':this.startGame.bind(this) };
  interface.game.startBtn = interface.game.add(btn, 'Start Game');
};

MyGameboard.prototype.addBotLevelsGUI = function(){
  var interface = this.scene.interface;

  interface.game.remove(interface.game.startBtn);
  interface.game.botLevels = interface.game.addFolder("Bot Levels");
  interface.game.botLevels.open();

  controller_names = [];
  for (var i=0; i<this.scene.interface.game.gameMode; i++) {
    controller_names[i] = this.botLevels[i];
    interface.game.botLevels.add(this.botLevels, i, controller_names[i]).min(1).max(2).step(1).name('Bot ' + Number(i + 1) + ' Level');
  }

  var btn = { 'Start Game':this.startGame.bind(this) };
  interface.game.startBtn = interface.game.add(btn, 'Start Game');
};

MyGameboard.prototype.addGameGUI = function(){
  var interface = this.scene.interface;
  interface.game = interface.gui.addFolder('Game');
  interface.game.open();

  interface.game.add(this, 'speed').min(0.25).max(4).step(0.5);

  interface.game.gameMode = 0;
  var dropdown = interface.game.add(interface.game, 'gameMode', {'Player vs Player': 0, 'Player vs CPU': 1, 'CPU vs CPU': 2}).name('Game Mode');
  dropdown.__select.selectedIndex = this.gameMode;
  dropdown.onFinishChange(function(){
      if(interface.game.botLevels)
        interface.removeFolder('Bot Levels', interface.game);
      if(this.scene.interface.game.gameMode > 0)
        this.addBotLevelsGUI();
  }.bind(this));

  var btn = { 'Start Game':this.startGame.bind(this) };
  interface.game.startBtn = interface.game.add(btn, 'Start Game');

};

MyGameboard.prototype.addPieces = function(){
  this.scene.pieces = [];

  for(var i = 0; i < 18; i++){
    this.scene.pieces.push(new MyPiece(this.scene, Math.floor(i/6)+1, i));
  }
};

MyGameboard.prototype.clearTiles = function(){
  for(var i = 0; i < this.matrix.length; i++)
    for(var j = 0; j < this.matrix[i].length; j++)
      this.matrix[i][j].piece = null;
};

MyGameboard.prototype.resetPieces = function(){
  for(var i = 0; i < this.scene.pieces.length; i++)
    this.scene.pieces[i].reset();
};

MyGameboard.prototype.placePieces = function(){
  this.clearTiles();

  this.matchPieceTile(this.matrix[1][2], this.scene.pieces[0]);
  this.matchPieceTile(this.matrix[2][1], this.scene.pieces[1]);
  this.matchPieceTile(this.matrix[2][2], this.scene.pieces[2]);

  this.matchPieceTile(this.matrix[this.du-2][this.dv-3],this.scene.pieces[3]);
  this.matchPieceTile(this.matrix[this.du-3][this.dv-2],this.scene.pieces[4]);
  this.matchPieceTile(this.matrix[this.du-3][this.dv-3],this.scene.pieces[5]);

  this.matchPieceTile(this.matrix[2][0], this.scene.pieces[6]);
  this.matchPieceTile(this.matrix[0][2], this.scene.pieces[7]);
  this.matchPieceTile(this.matrix[1][1], this.scene.pieces[8]);

  this.matchPieceTile(this.matrix[this.du-3][this.dv-1],this.scene.pieces[9]);
  this.matchPieceTile(this.matrix[this.du-1][this.dv-3],this.scene.pieces[10]);
  this.matchPieceTile(this.matrix[this.du-2][this.dv-2],this.scene.pieces[11]);

  this.matchPieceTile(this.matrix[1][0], this.scene.pieces[12]);
  this.matchPieceTile(this.matrix[0][1], this.scene.pieces[13]);
  this.matchPieceTile(this.matrix[0][0], this.scene.pieces[14]);

  this.matchPieceTile(this.matrix[this.du-2][this.dv-1],this.scene.pieces[15]);
  this.matchPieceTile(this.matrix[this.du-1][this.dv-2],this.scene.pieces[16]);
  this.matchPieceTile(this.matrix[this.du-1][this.dv-1],this.scene.pieces[17]);
};

MyGameboard.prototype.matchPieceTile = function(tile, piece){
  tile.piece = piece;
  piece.tile = tile;
};

MyGameboard.prototype.movePiece = function() {
  var pieceId = this.matrix[this.initialCell.y][this.initialCell.x].piece.id;
  this.matrix[this.initialCell.y][this.initialCell.x].piece = null;
  this.matchPieceTile(this.matrix[this.finalCell.y][this.finalCell.x], this.scene.pieces[pieceId]);
};

MyGameboard.prototype.startGame = function(){
   this.currentPhase = 1;
   this.startTime = this.scene.time;
   this.currentStep = 0;
   this.currentPlayer = 0;
   this.gameMode = this.scene.interface.game.gameMode;
   if(this.gameMode == 1) this.botLevels[1] = this.botLevels[0]; //This is needed to pass the correct level to prolog

   this.scene.waitedTime = 0;
   this.scene.MOVE_WAIT_TIME = 1500/this.speed;

   this.points = [0,0];

   this.addUndoButton();

   this.requestInitialBoard();
   this.placePieces();
 };

MyGameboard.prototype.highlightMoves = function(){
  for(var i = 0; i < this.validMoves.length; i++){
    var initialX = this.validMoves[i][0];
    var initialY = this.validMoves[i][1];
    var finalX = this.validMoves[i][2];
    var finalY = this.validMoves[i][3];
    if(initialX == this.initialCell.x && initialY == this.initialCell.y){
      this.matrix[finalY][finalX].highlighted = true;
    }
  }
};

MyGameboard.prototype.hideMoves = function(){
  for(var i = 0; i < this.validMoves.length; i++){
    var finalX = this.validMoves[i][2];
    var finalY = this.validMoves[i][3];
    this.matrix[finalY][finalX].highlighted = false;
  }
};

MyGameboard.prototype.controlsPiece = function(y){
  return y >= this.currentPlayer*4 && y < (this.currentPlayer+1)*4;
};

MyGameboard.prototype.addPlayToHistory = function(){
  var initialTile = this.matrix[this.initialCell.y][this.initialCell.x];
  var targetTile = this.matrix[this.finalCell.y][this.finalCell.x];
  var play = {
    initialCell : this.initialCell,
    finalCell : this.finalCell,
    initialCellPiece : initialTile.piece,
    finalCellPiece : targetTile.piece,
    board : this.prologBoard,
    validMoves : this.validMoves,
  };
  this.moveHistory.push(play);
};

MyGameboard.prototype.undo = function(){
  if(this.moveHistory.length === 0){
    alert('Nothing to undo! Make some plays first');
    return;
  }

  var play = this.moveHistory.pop();

  this.currentPlayer = Math.abs(this.currentPlayer - 1) % 2;

  this.prologBoard = play.board;
  this.validMoves = play.validMoves;

  this.initialCell = play.finalCell;
  this.finalCell = play.initialCell;

  var animDuration = 1/this.speed;
  play.initialCellPiece.moving = true;
  this.movePiece();
  var newAnim = new MyPieceAnimation(animDuration, play.initialCellPiece, this.initialCell.x, this.initialCell.y, this.finalCell.x, this.finalCell.y);
  this.scene.gameAnimations.push(newAnim);
  play.initialCellPiece.animation = newAnim;

  if(play.finalCellPiece){
    //die anim inversed
    this.points[this.currentPlayer] -= play.finalCellPiece.value;
    this.matrix[this.initialCell.y][this.initialCell.x].piece = play.finalCellPiece;
    play.finalCellPiece.tile = this.matrix[this.initialCell.y][this.initialCell.x];
  }
};

MyGameboard.prototype.makeMovement = function(){
  var initialTile = this.matrix[this.initialCell.y][this.initialCell.x];
  var targetTile = this.matrix[this.finalCell.y][this.finalCell.x];

  this.addPlayToHistory();

  var animDuration = 1/this.speed;
  initialTile.piece.moving = true;
  var newAnim = new MyPieceAnimation(animDuration, initialTile.piece, this.initialCell.x, this.initialCell.y, this.finalCell.x, this.finalCell.y);

  if(targetTile.piece){
    if(!this.controlsPiece(this.finalCell.y)){
      //make eat animation
      this.points[this.currentPlayer] += targetTile.piece.type;
    }
    else{
      var animPeriod = 250/this.speed;
      var mergeAnim = new MyPieceMergeAnimation(animDuration, animPeriod, initialTile.piece, initialTile.piece.type);
      initialTile.piece.type += targetTile.piece.type;
      mergeAnim.initialTime = newAnim.initialTime + animDuration*1000;
      newAnim.nextAnimation = mergeAnim;
      this.scene.gameAnimations.push(mergeAnim);
    }
  }
  this.scene.gameAnimations.push(newAnim);
  initialTile.piece.animation = newAnim;
  this.movePiece();
  this.requestMovement();
  this.nextStep();
};

MyGameboard.prototype.pickCell = function(index){
  if(this.getCurrentPlayerType === 'CPU' || this.paused)
    return;
  index--;
  var x = index % 4;
  var y = Math.floor(index / 4);

  if(this.currentStep === 0){
    if(this.matrix[y][x].piece && this.controlsPiece(y)){
      this.initialCell = {x: x, y: y};
      this.highlightMoves();
      this.matrix[y][x].selected = true;
      this.nextStep();
    }
  }
  else if(this.currentStep === 1){
    if(x === this.initialCell.x && y === this.initialCell.y){
      this.matrix[y][x].selected=false;
      this.currentStep--;
      this.hideMoves();
      return;
    }
    if(this.matrix[y][x].highlighted){
      this.finalCell = {x: x, y: y};
      this.matrix[this.initialCell.y][this.initialCell.x].selected = false;
      this.hideMoves();
      this.makeMovement();
    }
  }
};

MyGameboard.prototype.display = function(){
  MyBoard.prototype.display.call(this);
};
