// Define the CodesMazeViewer constructor
function CodesMazeViewer(maze) {
  	// Call the parent constructor, making sure (using Function#call)
  	// that "this" is set correctly during the call
	MazeViewer.call(this, maze);
	
	this.mazeDisplayed = false;
}

// Create a CodesMazeViewer.prototype object that inherits from MazeViewer.prototype.
CodesMazeViewer.prototype = Object.create(MazeViewer.prototype); 

// Set the "constructor" property to refer to CodesMazeViewer
CodesMazeViewer.prototype.constructor = CodesMazeViewer;

// Replace the "displayMaze" method
CodesMazeViewer.prototype.displayMaze = function(){
	var container = document.getElementById('mazeDisplay');	
	var outString = '';
	
	for (var j = 0; j < this.maze.y; j++) {
		for (var i = 0; i < this.maze.x; i++) {
			mazeCell = this.maze.cells[i][j];
			
			tileCode = cellToTile(mazeCell);
			outString += tileCode;
			
		}
	}
	
	var textArea = document.createElement("textarea");
	textArea.cols = "150";
	textArea.rows = "40";
	textArea.value = outString;
	
	container.appendChild(textArea);
	this.mazeDisplayed = true;
};

// Replace the "updateRobotDisplay" method
CodesMazeViewer.prototype.updateRobotDisplay = function(prevCell, currentCell){
	// not applicable
};