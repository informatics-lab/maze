// Define the ImageMazeViewer constructor
function ImageMazeViewer(maze) {
  	// Call the parent constructor, making sure (using Function#call)
  	// that "this" is set correctly during the call
  	MazeViewer.call(this, maze);
  	
  	this.mazeDisplayed = false;
  	
  	this.imageSize = 400 / this.maze.x; 
}

// Create a ImageMazeViewer.prototype object that inherits from MazeViewer.prototype.
ImageMazeViewer.prototype = Object.create(MazeViewer.prototype); 

// Set the "constructor" property to refer to ImageMazeViewer
ImageMazeViewer.prototype.constructor = ImageMazeViewer;

// Replace the "displayMaze" method
ImageMazeViewer.prototype.displayMaze = function(){
	var container = document.getElementById('mazeDisplay');
    var table = document.createElement('table');
    table.cellSpacing = 0;
    var row;
    var cell;
    for (var j = 0; j < this.maze.y; j++) {
        row = table.insertRow();
        for (var i = 0; i < this.maze.x; i++) {
            cell = row.insertCell();
            cell.style.border = '0px solid black';
            cell.style.padding = 0;
            
            tileCode = cellToTile(this.maze.cells[i][j]);   
            
            var img = document.createElement('img');
            img.src = 'images/' + tileCode + '.png';
            
            img.style.width = this.imageSize + 'px';
            img.style.height = this.imageSize + 'px';
            cell.appendChild(img);  
        }
    }
    container.appendChild(table);
    this.mazeDisplayed = true;
};

// Replace the "updateRobotDisplay" method
ImageMazeViewer.prototype.updateRobotDisplay = function(prevCell, currentCell){
	// to do
};
