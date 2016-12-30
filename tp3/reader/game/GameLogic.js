MyGameboard.prototype.getCurrentPlayerType = function() {
  return this.players[this.gameMode][this.currentPlayer];
};

MyGameboard.prototype.controlsPiece = function(y){
  return y >= this.currentPlayer*4 && y < (this.currentPlayer+1)*4;
};

MyGameboard.prototype.makeMovement = function(){
  var initialTile = this.matrix[this.initialCell.y][this.initialCell.x];
  var targetTile = this.matrix[this.finalCell.y][this.finalCell.x];

  this.addPlayToHistory();

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
  this.requestMovement();
  if(this.timeout)
    this.scoreboard.playTime=this.timeoutTime;
  this.nextStep();
};

MyGameboard.prototype.movePiece = function() {
  var pieceId = this.matrix[this.initialCell.y][this.initialCell.x].piece.id;
  this.matrix[this.initialCell.y][this.initialCell.x].piece = null;
  this.matchPieceTile(this.matrix[this.finalCell.y][this.finalCell.x], this.scene.pieces[pieceId]);
};

MyGameboard.prototype.addPlayToHistory = function(){
  var initialTile = this.matrix[this.initialCell.y][this.initialCell.x];
  var targetTile = this.matrix[this.finalCell.y][this.finalCell.x];
  var auxBoardPos = this.getFirstUnoccupiedAuxTile();
  var play = {
    initialCell : this.initialCell,
    finalCell : this.finalCell,
    initialCellPiece : initialTile.piece,
    finalCellPiece : targetTile.piece,
    auxBoardPos : auxBoardPos,
    board : this.prologBoard,
    validMoves : this.validMoves,
  };
  this.moveHistory.push(play);
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
    return this.scoreboard.points[0] > this.scoreboard.points[1] ? 'Player 1 Won!' : 'Player 2 Won!';

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
    return this.scoreboard.points[0] > this.scoreboard.points[1] ? 'Player 1 Won!' : 'Player 2 Won!';
  else
    return null;
};
