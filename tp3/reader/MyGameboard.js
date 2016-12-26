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
 }

MyGameboard.prototype = Object.create(MyBoard.prototype);
// MyGameboard.prototype = new MyBoard();
MyGameboard.prototype.constructor = MyGameboard;

MyGameboard.prototype.nextStep = function(){
  this.currentStep = (this.currentStep + 1) % 2;
}

MyGameboard.prototype.startGame = function(){
   this.phase = 1;
   this.currentStep = 0;
   this.currentPlayer = 0;
 }

MyGameboard.prototype.pickCell = function(index){
  index--;
  var x = index % 4;
  var y = Math.floor(index / 4);
  console.log(this.matrix[y][x].piece);
  if(this.currentStep === 0){
    if(!this.matrix[y][x].piece){
      this.initialCell = {x: x, y: y};
      // console.log("First cell chosen");
      // console.log(this.initialCell);
      this.nextStep();
    }
  }
  else if(this.currentStep === 1){
    this.finalCell = {x: x, y: y};
    // console.log("Second cell chosen");
    // console.log(this.finalCell);
    //check if validmove
    //make move
  }

}

MyGameboard.prototype.display = function(){
  MyBoard.prototype.display.call(this);
}
