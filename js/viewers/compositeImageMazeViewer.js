// Define the CompositeImageMazeViewer constructor
function CompositeImageMazeViewer(maze) {
	// Call the parent constructor, making sure (using Function#call)
	// that "this" is set correctly during the call
	MazeViewer.call(this, maze);
	
	this.cellSize = 400 / this.maze.x;
	
	this.mazeDisplayed = false;
  	this.robotIcon = createImage('images/robot.png', this.cellSize);
}

// Create a ImageMazeViewer.prototype object that inherits from MazeViewer.prototype.
CompositeImageMazeViewer.prototype = Object.create(MazeViewer.prototype); 

// Set the "constructor" property to refer to ImageMazeViewer
CompositeImageMazeViewer.prototype.constructor = CompositeImageMazeViewer;

// Replace the "displayMaze" method
CompositeImageMazeViewer.prototype.displayMaze = function(){

	var container = document.getElementById('mazeDisplay');
	
	var table = document.createElement('table');
	table.cellSpacing = 1;
	var row;
	var cell;
	for (var j = 0; j < this.maze.y; j++) {
		row = table.insertRow();
		for (var i = 0; i < this.maze.x; i++) {
			cell = row.insertCell();
			cell.style.position = 'relative';
			cell.style.minWidth = this.cellSize + 'px';
			cell.style.height = this.cellSize + 'px';
			cell.style.border = '0px solid black';
			cell.style.padding = '0';
			cell.id = i + "," + j;
			
			cell.appendChild(createImage('images/centre.png', this.cellSize));
			// loop through openings and create image for each direction present 
			
			var openings = this.maze.cells[i][j].openings;
			for (var opening in openings) {
				if (openings[opening]) {
					cell.appendChild(createImage('images/' + opening + '.png', this.cellSize));
				}
			}
			
		}
	}
	container.appendChild(table);
	this.mazeDisplayed = true;
};

// Replace the "updateRobotDisplay" method
CompositeImageMazeViewer.prototype.updateRobotDisplay = function(cell){
	this.currentDisplayCell = document.getElementById(cell.id);
    
	if (this.prevDisplayCell && this.robotIcon.parentNode == this.prevDisplayCell) {
		this.prevDisplayCell.removeChild(this.robotIcon);
	}
	this.currentDisplayCell.appendChild(this.robotIcon);
	
	this.prevDisplayCell = this.currentDisplayCell;
};






