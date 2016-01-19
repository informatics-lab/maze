// Define the MazeViewer constructor
var MazeViewer = function(maze) {
	this.maze = maze;
};

// Add a couple of methods to MazeViewer.prototype
MazeViewer.prototype.displayMaze = function(){
  console.log("abstract method for displaying maze");
};

MazeViewer.prototype.updateRobotDisplay = function(prevCell, currentCell){
  console.log("abstract method for updating the robot display");
};
