function createMaze(x, y) {
    
    // set up variables
    var nCells = x * y;
    var nVisitedCells = 0;
    var cells = [];
    var next;
    
    // check if dimensions too small
    if (nCells < 1) {
        alert("illegal maze dimensions");
        return;
    } 
    
    // start our path from a random cell
    var here = [Math.floor(Math.random() * x), Math.floor(Math.random() * y)];
    var path = [here];
    
    // populate cells array with all cells set as not visited and no wall openings
    for (var i = 0; i < x; i++) {
        cells[i] = [];
        for (var j = 0; j < y; j++) {        	
            var cell = {
            	visited: false,
            	isExit: false,
            	openings: {
            		north: false,
            		east: false,
            		south: false,
            		west: false
            	},
            	id: i + "," + j
            };
            cells[i].push(cell);
    	}
    }
    
    // adjust cells array to reflect that we've already 'visited' our starting cell
    cells[here[0]][here[1]].visited = true;
    nVisitedCells++;
	
    // create a path through the maze until we've visited every cell
    while (nVisitedCells < nCells) {
    	// get the four potential next cells (+1 in x direction, +1 in y, 
    	// -1 in x, -1 in y). Only potential because we haven't yet checked 
    	// if we've already visited them
        var neighbours = [
            [here[0] + 1, here[1]],
            [here[0], here[1] + 1],
            [here[0] - 1, here[1]],
            [here[0], here[1] - 1]
        ];
        
        // populate list of neighbouring cells that haven't been visited
        var unvisitedNeighbours = [];
        for (var k = 0; k < 4; k++) {
        
        	// if the neighbour in question is out of bounds then move onto next neighbour
        	if (neighbours[k][0] < 0 || neighbours[k][0] > x - 1 || neighbours[k][1] < 0 || neighbours[k][1] > y - 1) {
        		continue;
        	}
        	 
            if (cells[neighbours[k][0]][neighbours[k][1]].visited == false) {
                unvisitedNeighbours.push(neighbours[k]);
            }
        }
        
        if (unvisitedNeighbours.length > 0) {
        	// if there are unvisited neighbouring cells then set a randomly chosen one of 
        	// them to be the next cell
            next = unvisitedNeighbours[Math.floor(Math.random() * unvisitedNeighbours.length)];
            
            // update the cell wall openings properties appropriately
            if (next[0] == here[0]) {
            	if (next[1] > here[1]) {
            		// the path moved one cell south
            		cells[here[0]][here[1]].openings.south = true;
            		cells[next[0]][next[1]].openings.north = true;
            	} else {
            		// the path moved one cell north
            		cells[here[0]][here[1]].openings.north = true;
            		cells[next[0]][next[1]].openings.south = true;
            	}
            } else {
            	if (next[0] > here[0]) {
            		// the path moved one cell to the east
            		cells[here[0]][here[1]].openings.east = true;
            		cells[next[0]][next[1]].openings.west = true;
            	} else {
            		// the path moved one cell to the west
            		cells[here[0]][here[1]].openings.west = true;
            		cells[next[0]][next[1]].openings.east = true;
            	}
            }
            
            // advance the path, set the next cell as visited, and then update where 'here' is
            path.push(next);
            cells[next[0]][next[1]].visited = true;
            nVisitedCells++;
            here = next;
        } else {
        	// if there are no unvisited neighbouring cells then go back one step 
        	// on the path and adjust path accordingly
            here = path.pop();
        }
    }
    
    // make entrance and exit. Set current cell to entrance, set isExit to true for exit cell
    //cells[0][0].openings.north = true;
    cells[x-1][y-1].openings.east = true;
    
    var currentCoordinates = {x: 0, y: 0};
	var currentCell = cells[currentCoordinates.x][currentCoordinates.y];
	cells[x-1][y-1].isExit = true;
   
    return {
        x: x,
        y: y,
        cells: cells,
        currentCoordinates: currentCoordinates,
        currentCell: currentCell,
        getCurrentCell: function() {
        	return this.currentCell;
        },
        updateCurrentCell: function() {
        	this.currentCell = this.cells[this.currentCoordinates.x][this.currentCoordinates.y];
        	console.log("robot moved to new cell of x: ", this.currentCoordinates.x, ", y: ", this.currentCoordinates.y);
        },
        move: function(facing) {
        	console.log("robot is trying to move ", facing);
        	if (facing == 'west' && this.currentCell.openings.west) {
        		this.currentCoordinates.x -= 1;
        	} else if (facing == 'east' && this.currentCell.openings.east) {
        		this.currentCoordinates.x += 1;
        	} else if (facing == 'north' && this.currentCell.openings.north) {
        		this.currentCoordinates.y -= 1;
        	} else if (facing == 'south' && this.currentCell.openings.south) {
        		this.currentCoordinates.y += 1;
        	} else {
        		return false;
        	}	
        	
        	this.updateCurrentCell();
        	return true;
        }
    };
}

function displayImageMaze(m) {
	var container = document.getElementById('imageMaze');
	var table = document.createElement('table');
	table.cellSpacing = 0;
	var row;
	var cell;
	for (var j = 0; j < m.y; j++) {
		row = table.insertRow();
		for (var i = 0; i < m.x; i++) {
			cell = row.insertCell();
			cell.style.border = '0px solid black';
			cell.style.padding = 0;
			
			tileCode = cellToTile(m.cells[i][j]);	
			
			var img = document.createElement('img');
			img.src = 'images/' + tileCode + '.png';
			var imageSize = 800 / m.x 
			img.style.width = imageSize + 'px';
			img.style.height = imageSize + 'px';
			cell.appendChild(img);	
		}
	}
	container.appendChild(table);
}

function displayImageMazeNew(m) {
	var container = document.getElementById('imageMaze');
	
	//var cellSize = 800 / m.x;
	
	var table = document.createElement('table');
	table.cellSpacing = 1;
	var row;
	var cell;
	for (var j = 0; j < m.y; j++) {
		row = table.insertRow();
		for (var i = 0; i < m.x; i++) {
			cell = row.insertCell();
			cell.style.position = 'relative';
			cell.style.minWidth = cellSize + 'px';
			cell.style.height = cellSize + 'px';
			cell.style.border = '0px solid black';
			cell.style.padding = '0';
			cell.id = i + "," + j;
			
			cell.appendChild(createImage('images/centre.png', cellSize));
			// loop through openings and create image for each direction present 
			
			var openings = m.cells[i][j].openings;
			for (var opening in openings) {
				if (openings[opening]) {
					cell.appendChild(createImage('images/' + opening + '.png', cellSize));
				}
			}
			
		}
	}
	container.appendChild(table);
}

function createImage(source, size) {
	var img = document.createElement('img');
	img.src = source
	img.style.width = size + 'px';
	img.style.height = size + 'px';
	img.style.position = 'absolute';
	return img;
}

function displayBorderMaze(m, displayCodes) {
	var container = document.getElementById('borderMaze');
	var table = document.createElement('table');
	tableWidth = m.x * 25;
	table.style.width  = tableWidth + 'px';
	table.cellSpacing = 0;
	var row;
	var cell;
	for (var j = 0; j < m.y; j++) {
		row = table.insertRow();
		for (var i = 0; i < m.x; i++) {
			noBorder = '1px dotted #ccc';
			
			cell = row.insertCell();
			cell.style.border = '1px solid black';
			cell.style.padding = 0;
			
			var mazeCell = m.cells[i][j];
			cell.innerHTML = displayCodes ? cellToTile(mazeCell) : '&nbsp;'
			
			
			var directionsToBorders = {	north:'Top',
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
}

function displayMazeCodes(m) {
	var container = document.getElementById('mazeCodes');	
	var outString = '';
	
	for (var j = 0; j < m.y; j++) {
		for (var i = 0; i < m.x; i++) {
			mazeCell = m.cells[i][j];
			
			tileCode = cellToTile(mazeCell);
			outString += tileCode;
			
		}
	}
	
	var textArea = document.createElement("textarea");
	textArea.cols = "150";
	textArea.rows = "40";
	textArea.value = outString;
	
	container.appendChild(textArea);
}

function cellToTile(cell) {
	sum = 0;
	if (cell.openings.north) { sum += 8; }
	if (cell.openings.east) { sum += 4; }
	if (cell.openings.south) { sum += 2; }
	if (cell.openings.west) { sum += 1; }
	return sum.toString(16);
}

function tileToCell(tile) {
	var directions = {north: false, east: false, south: false, west: false};
	
	var power;
	while (tile > 0) {
		power = getLargestPowerOfTwo(tile);
		if (power == 8) {
			directions.north = true;
		} else if (power == 4) {
			directions.east = true;
		} else if (power == 2) {
			directions.south = true;
		} else if (power == 1) {
			directions.west = true;
		}
		
		tile -= power;
	}
	return directions
}

function getLargestPowerOfTwo (number) {
	var result = 1;        
    while (result < number) {
    	result *= 2;
    }

    return result / 2;
}

function createRobotLoopTimeout(intervalFunc, maze, display, facing, nSteps, delay) { 
	setTimeout(function() { 
		intervalFunc(maze, display, facing, nSteps); 
	}, delay); 
} 

function robotLoop(maze, display, facing, nSteps) {

	var cell = maze.getCurrentCell();

	// update display with robot position and path
	display.prevCell.removeChild(display.robotIcon);

	display.currentCell = document.getElementById(cell.id);
	display.currentCell.appendChild(display.robotIcon);
	display.prevCell = display.currentCell;

	// robot logic to decide next move
	var allOpenings = cell.openings;
	console.log("robot is in a cell with openings: ", allOpenings);
	var newOpenings = [];
	for (var opening in allOpenings) {
		if (allOpenings[opening] && opening != oppositeDirection(facing)) {
			newOpenings.push(opening);
		} 
	}

	console.log("robot is in a cell with non-turn-around openings: ", newOpenings);

	if (newOpenings.length == 0) {
		// dead end. 
		facing = oppositeDirection(facing);
	} else if (newOpenings.length == 1) {
		// only one way to go that isn't turning around and going back way we came
		facing = newOpenings[0];
	} else {
		// we're at a T-junction or a cross-roads.
		// here's where the robot uses an algorithm to decide which way to turn

		// here we're just using the 'random mouse' algorithm 
		// (https://en.wikipedia.org/wiki/Maze_solving_algorithm#Random_mouse_algorithm)
//		var randomDirection = newOpenings[Math.floor(Math.random() * 2)];
//		facing = randomDirection
		
		// here we're using the 'wall follower' algorithm
		// (https://en.wikipedia.org/wiki/Maze_solving_algorithm#Wall_follower)
		var newDirection = turnToNewDirection(facing, 90);
 		while (newOpenings.indexOf(newDirection) == -1) {
  			newDirection = turnToNewDirection(newDirection, -90);
  		}

  		facing = newDirection;
	}

	if (maze.move(facing)) {
		cell = maze.getCurrentCell();
		nSteps++;
		document.getElementById("stepsDiv").innerHTML = nSteps; 
		if (cell.isExit) {
			display.currentCell = document.getElementById(cell.id);
			display.currentCell.appendChild(display.robotIcon);
			console.log("Arrived at exit in ", nSteps, " steps!");
		} else {
			createRobotLoopTimeout(robotLoop, maze, display, facing, nSteps, robotDisplayDelay);
		}
	}
}

/* turn can be -270, -180, -90, 0, 90, 180, 270 */
function turnToNewDirection(currentDirection, turn) {
	var directions = ['north', 'east', 'south', 'west'];
	var indexChange = turn / 90;
	var currentDirectionIndex = 0;
	for (var currentDirectionIndex = 0; currentDirectionIndex < directions.length; currentDirectionIndex++) {
		if (directions[currentDirectionIndex] == currentDirection) {
			break;
		}
	}
	
	var newDirectionIndex = (currentDirectionIndex + indexChange) % directions.length;
	return directions[newDirectionIndex];
}

function createRobot(maze) {

	var cell = maze.getCurrentCell();
	
	// initialise display
	var display = {
		prevCell: document.getElementById(cell.id),
		currentCell: document.getElementById(cell.id),
		robotIcon: createImage('images/robot.png', cellSize)
	}; 
	display.currentCell.appendChild(display.robotIcon);
	
	var facing = 'south';
	
	var nSteps = 0;
	var stepsDiv = document.createElement('div');
	stepsDiv.id = "stepsDiv";
	document.getElementById('imageMaze').appendChild(stepsDiv);
	
	createRobotLoopTimeout(robotLoop, maze, display, facing, nSteps, robotDisplayDelay);
}

function oppositeDirection(direction) {
	var opposite = null;
	if (direction == 'north') {
		opposite = 'south';
	} else if (direction == 'east') {
		opposite = 'west';
	} else if (direction == 'south') {
		opposite = 'north';
	} else if (direction == 'west') {
		opposite = 'east';
	}

	return opposite;
}

function go(mazeWidth, mazeHeight) {
	var maze = createMaze(mazeWidth, mazeHeight);

// 	displayImageMaze(maze);
	displayImageMazeNew(maze);  
// 	displayBorderMaze(maze, true); 
// 	displayMazeCodes(maze); 
	
	// var mazeForRobot = {
// 		currentCell: maze.currentCell,
// 		getCurrentCell: maze.getCurrentCell,
// 		move: maze.move,
// 		
// 		currentCoordinates: maze.currentCoordinates
// 	}

	setTimeout(function() {
    	createRobot(maze);
	}, 1000);
}

var robotDisplayDelay = 100;
var mazeWidth = 40;
var mazeHeight = 24;
var cellSize = 800 / mazeWidth;

//go(mazeWidth, mazeHeight);
