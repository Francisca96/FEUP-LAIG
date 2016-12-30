MyGameboard.prototype.addGameGUI = function(){
  var interface = this.scene.interface;
  interface.game = interface.gui.addFolder('Game');
  interface.game.open();

  interface.game.add(this, 'speed').min(0.25).max(4).step(0.5).name('Game Speed');

  var timeoutBtn = interface.game.add(this, 'timeout').name('Play Timeout');
  timeoutBtn.onFinishChange(function(){
    if(this.timeout)
      this.scoreboard.playTime = this.timeoutTime;
    else
      this.scoreboard.playTime = -1;
  }.bind(this));

  interface.game.add(this, 'timeoutTime').min(10).max(55).step(5).name('Timeout Duration');

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
  this.scene.interface.game.pauseBtn.onFinishChange(function(){
    if(this.paused)
      this.setInfoText('Paused Game');
    else
      this.setInfoText('Unpaused Game');
  }.bind(this));

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

MyGameboard.prototype.pickCell = function(index){
  if(this.getCurrentPlayerType === 'CPU' || this.paused)
    return;
  index--;
  var x = index % 4;
  var y = Math.floor(index / 4);

  if(this.currentPhase !== 1) return;
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

MyGameboard.prototype.undo = function(){
  if(this.moveHistory.length === 0){
    this.setInfoText('Nothing to undo');
    return;
  }
  if(this.currentPhase !== 1)
    return;

  var play = this.moveHistory.pop();

  this.currentPlayer = Math.abs(this.currentPlayer - 1) % 2;
  if(this.timeout)
    this.scoreboard.playTime = this.timeoutTime;

  this.prologBoard = play.board;
  this.validMoves = play.validMoves;

  this.initialCell = play.finalCell;
  this.finalCell = play.initialCell;

  var animDuration = this.ANIM_DURATION/1000/this.speed;
  play.initialCellPiece.moving = true;
  this.movePiece();
  var newAnim = new MyPieceAnimation(animDuration, play.initialCellPiece, this.initialCell.x, this.initialCell.y, this.finalCell.x, this.finalCell.y);
  this.scene.gameAnimations.push(newAnim);
  play.initialCellPiece.animation = newAnim;

  if(play.finalCellPiece){
    var eatenPiece = this.auxBoard.matrix[play.auxBoardPos.y][play.auxBoardPos.x].piece;
    var transformedPos = this.transformAuxBoardCoordinates(play.auxBoardPos.x,play.auxBoardPos.y);
    var dieAnim = new MyPieceDieAnimation(animDuration, 0, eatenPiece, transformedPos.x, transformedPos.y, this.initialCell.x, this.initialCell.y);
    eatenPiece.moving = true;
    eatenPiece.animation = dieAnim;
    this.scene.gameAnimations.push(dieAnim);
    this.auxBoard.matrix[play.auxBoardPos.y][play.auxBoardPos.x].piece = null;
    this.matrix[this.initialCell.y][this.initialCell.x].piece = eatenPiece;
    eatenPiece.tile = this.matrix[this.initialCell.y][this.initialCell.x];
    if(!this.controlsPiece(play.finalCell.y))
      this.scoreboard.points[this.currentPlayer] -= eatenPiece.type;
    else {
      play.initialCellPiece.type -= eatenPiece.type;
      play.initialCellPiece.update();
    }
  }
    this.updateScoreboardText();
};

MyGameboard.prototype.startReplaying = function(){
  this.startGame(true);
  // this.currentPhase = 3;
  this.replaying = true;
  this.replayIndex = 0;
  this.replayAllMovements();
}

MyGameboard.prototype.replayAllMovements = function(){
  setTimeout(function () {
    if(this.replayIndex < this.moveHistory.length){
      this.replayMovement();
      this.replayAllMovements();
      this.replayIndex++;
    }
    else {
      this.replaying = false;
    }
  }.bind(this), this.scene.MOVE_WAIT_TIME/this.speed);

}

MyGameboard.prototype.replayMovement = function(){
  var move = this.moveHistory[this.replayIndex];
  this.initialCell = move.initialCell;
  this.finalCell = move.finalCell;

  var initialTile = this.matrix[this.initialCell.y][this.initialCell.x];
  var targetTile = this.matrix[this.finalCell.y][this.finalCell.x];

  var animDuration = this.ANIM_DURATION/1000/this.speed;
  initialTile.piece.moving = true;
  var newAnim = new MyPieceAnimation(animDuration, initialTile.piece, this.initialCell.x, this.initialCell.y, this.finalCell.x, this.finalCell.y);

  if(targetTile.piece){
    var newPos = this.getFirstUnoccupiedAuxTile();
    var eatenPiece = targetTile.piece;
    eatenPiece.tile = this.auxBoard.matrix[newPos.y][newPos.x];
    this.auxBoard.matrix[newPos.y][newPos.x].piece = eatenPiece;
    eatenPiece.moving = true;
    var transformedPos = this.transformAuxBoardCoordinates(newPos.x,newPos.y);
    var dieAnim = new MyPieceDieAnimation(animDuration*1.9, animDuration*0.9, targetTile.piece, this.finalCell.x, this.finalCell.y, transformedPos.x,transformedPos.y);
    eatenPiece.animation = dieAnim;
    this.scene.gameAnimations.push(dieAnim);
    if(!this.controlsPiece(this.finalCell.y)){
      this.scoreboard.points[this.currentPlayer] += targetTile.piece.type;
    }
    else{
      var animPeriod = 250/this.speed;
      var mergeAnim = new MyPieceMergeAnimation(animDuration, animPeriod, initialTile.piece, initialTile.piece.type);
      initialTile.piece.type += targetTile.piece.type;
      mergeAnim.initialTime = newAnim.initialTime + animDuration;
      newAnim.nextAnimation = mergeAnim;
      this.scene.gameAnimations.push(mergeAnim);
    }
  }
  this.scene.gameAnimations.push(newAnim);
  initialTile.piece.animation = newAnim;
  this.movePiece();
  this.currentPlayer = (this.currentPlayer + 1) % 2;
}
