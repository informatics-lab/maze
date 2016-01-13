// Define the BorderMazeViewer constructor
function BorderMazeViewer(maze, displayCodes) {
  // Call the parent constructor, making sure (using Function#call)
  // that "this" is set correctly during the call
  MazeViewer.call(this, maze);

  // Initialize our BorderMazeViewer-specific properties
  this.displayCodes = displayCodes;
  this.mazeDisplayed = false;
  
  this.tableWidth = this.maze.x * 8;
  
  this.currentDisplayCell;
  this.prevDisplayCell;
}

// Create a BorderMazeViewer.prototype object that inherits from MazeViewer.prototype.
BorderMazeViewer.prototype = Object.create(MazeViewer.prototype); 

// Set the "constructor" property to refer to BorderMazeViewer
BorderMazeViewer.prototype.constructor = BorderMazeViewer;

// Replace the "displayMaze" method
BorderMazeViewer.prototype.displayMaze = function(){
	var container = document.getElementById('mazeDisplay');
    var table = document.createElement('table');
    
    table.style.width = this.tableWidth + 'px';
    table.cellSpacing = 0;
    var row;
    var cell;
    for (var j = 0; j < this.maze.y; j++) {
        row = table.insertRow();
        for (var i = 0; i < this.maze.x; i++) {
           
            noBorder = '1px dotted #CCC';
            
            cell = row.insertCell();
            cell.style.border = '1px solid black';
            cell.style.padding = 0;
            cell.style.fontSize = '4pt';
           
            var mazeCell = this.maze.cells[i][j];
            cell.id = mazeCell.id;
            
            cell.innerHTML = this.displayCodes ? cellToTile(mazeCell) : '&nbsp;'
            
            var directionsToBorders = { north:'Top',
                                        east:'Right',
                                        south:'Bottom',
                                        west:'Left' };
            for (var direction in directionsToBorders) {
                var border = 'border' + directionsToBorders[direction];
                if (mazeCell.openings[direction]) {
                    cell.style[border] = noBorder;
                } 
            }
        }
    }
    container.appendChild(table);
    this.mazeDisplayed = true;
    
    // set up the current display cell ready for if/when we need to display the maze being solved
    entryCellId = this.maze.cells[0][0].id
    this.currentDisplayCell = document.getElementById(entryCellId);
};

// Replace the "updateRobotDisplay" method
BorderMazeViewer.prototype.updateRobotDisplay = function(cell) {
	this.currentDisplayCell = document.getElementById(cell.id);
    
	if (this.prevDisplayCell) {
		if (this.prevDisplayCell.line) {
			this.prevDisplayCell.style.backgroundColor = 'orange';
		} else {
			this.prevDisplayCell.style.backgroundColor = 'yellow';
		}
	}
	
	if (cell.lineDrawn) {
		this.currentDisplayCell.line = true;
	} else {
		this.currentDisplayCell.line = false;
	}
	this.currentDisplayCell.style.backgroundColor = 'red';
	
	this.prevDisplayCell = this.currentDisplayCell;
};

// Replace the "resetMazeView" method
BorderMazeViewer.prototype.resetMazeView = function() {
	var displayCell;
	for (var j = 0; j < this.maze.y; j++) {
        for (var i = 0; i < this.maze.x; i++) {
      		displayCell = document.getElementById(i + "," + j);
      		displayCell.style.backgroundColor = 'white';
      		displayCell.line = false;
      	}
	}
	
	// set up the current display cell ready for if/when we need to display the maze being solved
    entryCellId = this.maze.cells[0][0].id
    this.currentDisplayCell = document.getElementById(entryCellId);
    
    this.prevDisplayCell = null;
    
    this.mazeDisplayed = false;
}