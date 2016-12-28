MyGameboard.prototype.getPrologRequest = function(requestString, onSuccess, onError, port)
{
  var requestPort = port || 8081;
  var request = new XMLHttpRequest();
  var game = this;
  request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

  request.onload = onSuccess.bind(this) || function(data){console.log("Request successful. Reply: " + data.target.response); return data.target.response;};
  request.onerror = onError || function(){console.log("Error waiting for response");};

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();
};

MyGameboard.prototype.requestInitialBoard = function(){
  this.getPrologRequest('start_game', this.getBoard);
};

MyGameboard.prototype.requestValidMovements = function(){
  var playerAtom = 'player' + Number(this.currentPlayer + 1);
  this.getPrologRequest("get_moves("+this.prologBoard + ',' + playerAtom + ')', this.getMoves);
};

MyGameboard.prototype.requestMovement = function(){
  var playerAtom = 'player' + Number(this.currentPlayer + 1);
  var requestStr = 'move(' + this.prologBoard + ',' + this.initialCell.x + ',' + this.finalCell.x + ',' + this.initialCell.y + ',' + this.finalCell.y + ',' + playerAtom + ')';
  this.getPrologRequest(requestStr, this.getBoard);
};

MyGameboard.prototype.requestAutomaticMovement = function(){
  var playerAtom = 'player' + Number(this.currentPlayer + 1);
  var requestStr = 'auto_move(' + this.prologBoard + ',' + playerAtom + ',' + this.botLevels[this.currentPlayer] + ')';
  this.getPrologRequest(requestStr, this.getAutomaticMovement);
};

MyGameboard.prototype.getAutomaticMovement = function(data){
  var move = eval(data.target.response);
  this.initialCell = {x:move[0], y:move[1]};
  this.finalCell = {x:move[2], y:move[3]};
  this.nextStep();
  this.makeMovement();
};

MyGameboard.prototype.getBoard = function(data){
  this.prologBoard = data.target.response;
  this.requestValidMovements();
};

MyGameboard.prototype.getMoves = function(data){
  this.validMoves = eval(data.target.response);
};

MyGameboard.prototype.getMovementUpdate = function(data){
  this.prologBoard = eval(data.target.response);
};
