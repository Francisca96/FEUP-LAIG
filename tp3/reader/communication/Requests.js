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
