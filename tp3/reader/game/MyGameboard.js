/**
 * MyGameboard
 * @constructor
 */
 function MyGameboard(scene, du, dv) {
   MyBoard.call(this, scene, du, dv);

   this.clickable = true;
   this.auxBoard = this.scene.auxBoard;
   this.scoreboard = this.scene.scoreboard;
   this.AUX_BOARD_TRANSLATION = {x: -4, y: 0, z: 1};

   this.scene.MOVE_WAIT_TIME = 2000;
   this.ANIM_DURATION = 1250;

   this.phases = ['Waiting For Start', 'Playing Game', 'Game Ended', 'Replaying'];
   this.steps = ['Waiting For Initial Cell Pick', 'Waiting For Final Cell Pick'];

   this.paused = false;

   this.currentPhase = 0;
   this.currentPlayer = -1;
   this.currentStep = -1;
   this.startTime = -1;

   this.gameModes = ['Player vs Player', 'Player vs CPU', 'CPU vs CPU'];
   this.players = [['Player', 'Player'], ['Player','CPU'], ['CPU', 'CPU']];
   this.scoreboard.points = [-1,-1];
   this.gameMode = 0;

   this.botLevels = [1,1];

   this.moveHistory = [];
   this.initialCell = {};
   this.finalCell = {};

   this.validMoves = [];

   this.speed = 1;
   this.timeout = false;
   this.timeoutTime = 30;
   this.scoreboard.playTime = -1;
   this.replaying = false;

   this.addPieces();
   this.placePieces();
   this.updateScoreboardText();
 }

MyGameboard.prototype = Object.create(MyBoard.prototype);
MyGameboard.prototype.constructor = MyGameboard;

MyGameboard.prototype.nextStep = function(){
  this.currentStep = (this.currentStep + 1) % 2;
  if(this.currentStep === 0){
    this.currentPlayer = (this.currentPlayer + 1) % 2;
    var endGame = this.verifyEndGame();

    if(endGame){
      var replayBtn = { 'Replay Game':this.startReplaying.bind(this) };
      this.scene.interface.game.replayBtn = this.scene.interface.game.add(replayBtn, 'Replay Game');
      this.currentPhase++;
      this.updateScoreboardText(endGame);
      return;
    }
  }
  this.updateScoreboardText();
};

MyGameboard.prototype.addPieces = function(){
  this.scene.pieces = [];

  for(var i = 0; i < 18; i++){
    this.scene.pieces.push(new MyPiece(this.scene, Math.floor(i/6)+1, i));
  }
};

MyGameboard.prototype.clearTiles = function(){
  MyBoard.prototype.clearTiles.call(this);

  this.auxBoard.clearTiles();
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

MyGameboard.prototype.getFirstUnoccupiedAuxTile = function(){
  for(var i = 0; i < this.auxBoard.matrix.length; i++){
    for(var j = 0; j < this.auxBoard.matrix[i].length; j++){
      if(!this.auxBoard.matrix[i][j].piece)
        return {x: j, y: i};
    }
  }
};

MyGameboard.prototype.startGame = function(replay=false){
    if(this.replaying)
      return;

   this.currentPhase = replay ? 3 : 1;
   this.startTime = this.scene.time;
   this.currentStep = 0;
   this.currentPlayer = 0;
   this.gameMode = this.scene.interface.game.gameMode;
   if(this.gameMode == 1) this.botLevels[1] = this.botLevels[0]; //This is needed to pass the correct level to prolog

   this.scene.waitedTime = 0;

   this.scoreboard.points = [0,0];

   if(this.timeout)
    this.scoreboard.playTime=this.timeoutTime;

   this.addUndoButton();

   if(!replay)
    this.requestInitialBoard();
   this.placePieces();
   this.updateScoreboardText();
 };

 MyGameboard.prototype.updateScoreboardText = function(text){
   this.scoreboard.stepsPanel.text[0] = this.phases[this.currentPhase]
   this.scoreboard.infoPanel.text[0] = this.scoreboard.infoPanel.text[1] = '';
   switch (this.currentPhase) {
     case 0:
       this.scoreboard.stepsPanel.text[1] = 'Press Start Game to start!'
       break;
     case 1:
       this.scoreboard.stepsPanel.text[1] = this.steps[this.currentStep];
       this.scoreboard.infoPanel.text[0] = this.getCurrentPlayerType() + ' ' + Number(this.currentPlayer+1) + ' turn';
       break;
     case 2:
       this.scoreboard.stepsPanel.text[1] = text;
       break;
     default:
       this.scoreboard.stepsPanel.text[1] = '';
   }
 };

 MyGameboard.prototype.setInfoText = function(text){
   this.scoreboard.infoPanel.text[1] = text;
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

MyGameboard.prototype.transformAuxBoardCoordinates = function(x,y){
  var translatedX = (x+this.AUX_BOARD_TRANSLATION.x);
  var translatedY = (y+this.AUX_BOARD_TRANSLATION.z);
  return {x: translatedX, y: translatedY};
}

MyGameboard.prototype.display = function(){

  this.scene.pushMatrix();
    this.scene.translate(-0.7,3.5,-2.75);
    this.scene.scale(1.5, 1.5, 1);
    this.scoreboard.display();
  this.scene.popMatrix();

  MyBoard.prototype.display.call(this);
};
