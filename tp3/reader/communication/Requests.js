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

MyGameboard.prototype.getInitialBoard = function(data){
  this.prologBoard = data.target.response;
  var playerAtom = 'player' + Number(this.currentPlayer + 1);
  this.getPrologRequest("get_moves("+this.prologBoard + ',' + playerAtom + ')', this.getMoves);
};

MyGameboard.prototype.getMoves = function(data){
  this.validMoves = eval(data.target.response);
};
