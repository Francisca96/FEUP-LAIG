/**
 * MyGameboard
 * @constructor
 */
 function MyGameboard(scene, du, dv) {
  //  this.scene = scene;
   // 	CGFobject.call(this,scene);
   MyBoard.call(this, scene, du, dv);

   this.phases = ['Waiting For Start', 'Playing Game', 'Game Ended'];
   this.steps = ['Waiting For Initial Cell Pick', 'Waiting For Final Cell Pick'];

   this.currentPhase = 0;
   this.currentPlayer = -1;
   this.currentStep = -1;

   this.moveHistory = [];
   this.initialCell = {};
   this.finalCell = {};

   this.addPieces();
 }

MyGameboard.prototype = Object.create(MyBoard.prototype);
MyGameboard.prototype.constructor = MyGameboard;

MyGameboard.prototype.nextStep = function(){
  this.currentStep = (this.currentStep + 1) % 2;
};

MyGameboard.prototype.addPieces = function(){
  this.scene.pieces = [];

  for(var i = 0; i < 18; i++){
            this.scene.pieces.push(new MyPiece(this.scene, Math.floor(i/6)+1));
  }

  this.matrix[1][2].piece = this.scene.pieces[0];
  this.matrix[2][1].piece = this.scene.pieces[1];
  this.matrix[2][2].piece = this.scene.pieces[2];

  this.matrix[this.du-2][this.dv-3].piece = this.scene.pieces[3];
  this.matrix[this.du-3][this.dv-2].piece = this.scene.pieces[4];
  this.matrix[this.du-3][this.dv-3].piece = this.scene.pieces[5];

  this.matrix[2][0].piece = this.scene.pieces[6];
  this.matrix[0][2].piece = this.scene.pieces[7];
  this.matrix[1][1].piece = this.scene.pieces[8];

  this.matrix[this.du-3][this.dv-1].piece = this.scene.pieces[9];
  this.matrix[this.du-1][this.dv-3].piece = this.scene.pieces[10];
  this.matrix[this.du-2][this.dv-2].piece = this.scene.pieces[11];

  this.matrix[1][0].piece = this.scene.pieces[12];
  this.matrix[0][1].piece = this.scene.pieces[13];
  this.matrix[0][0].piece = this.scene.pieces[14];

  this.matrix[this.du-2][this.dv-1].piece = this.scene.pieces[15];
  this.matrix[this.du-1][this.dv-2].piece = this.scene.pieces[16];
  this.matrix[this.du-1][this.dv-1].piece = this.scene.pieces[17];
};

MyGameboard.prototype.startGame = function(){
   this.phase = 1;
   this.currentStep = 0;
   this.currentPlayer = 0;
   this.getPrologRequest('start_game', this.getInitialBoard);
 };

MyGameboard.prototype.highlightMoves = function(){
  for(var i = 0; i < this.validMoves.length; i++){
    var initialX = this.validMoves[i][0];
    var initialY = this.validMoves[i][1];
    console.log('x: ' + initialX + ' y: ' + initialY);
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
  return y >= this.currentPlayer*4 && y <= (this.currentPlayer+1)*4;
};

MyGameboard.prototype.pickCell = function(index){
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
      this.hideMoves();
      this.finalCell = {x: x, y: y};
      this.nextStep();
      var playerAtom = 'player' + Number(this.currentPlayer + 1);
      this.getPrologRequest("get_moves("+this.prologBoard + ',' + playerAtom + ')', this.getMoves);
      //at animation end
      //check if validmove
      this.matrix[this.initialCell.y][this.initialCell.x].selected = false;
      //make move
    }
  }

};

MyGameboard.prototype.display = function(){
  MyBoard.prototype.display.call(this);
};
