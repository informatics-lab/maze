/// <reference path="cell.ts" />

class Maze {

	x: number;
	y: number;
	cells: cell[][] = [];

	private nCells: number;
	private nVisitedCells: number;
	private next: number[];

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;

		if (this.nCells < 1) {
        	alert("illegal maze dimensions");
        	return;
    	} else {
			this.createMaze();
		}
 	}

 	reset(): void {
 		for (var i = 0; i < this.x; i++) {
	        for (var j = 0; j < this.y; j++) {           
	            var cell = this.cells[i][j];
	            
	            // remove any cell properties that aren't in the 'core' list. This ensures
	            // that any properties added by previous robots are removed ready for new robot
	            var coreProperties = ['visited', 'isExit', 'isEntry', 'openings', 'id'];
	            
	            for (var property in cell) {
	            	if (coreProperties.indexOf(property) == -1) {
	            		// remove this non-core property
	            		delete cell[property];
	            	}
				}
	        }
	    }
 	}

 	private createMaze(): void {
 		// start our path from a random cell
	    var here: number[] = [Math.floor(Math.random() * this.x), Math.floor(Math.random() * this.y)];
	    var path: number[][] = [here];
	    
	    // populate cells array with all cells set as not visited and no wall openings
	    for (var i = 0; i < this.x; i++) {
	        this.cells[i] = [];
	        for (var j = 0; j < this.y; j++) {           
				var cell = new cell(i, j);
	            this.cells[i].push(cell);
	        }
	    }
	    
	    // adjust cells array to reflect that we've already 'visited' our starting cell
	    this.cells[here[0]][here[1]].visited = true;
	    this.nVisitedCells++;
	    
	    // create a path through the maze until we've visited every cell
	    while (this.nVisitedCells < this.nCells) {
	        // get the four potential next cells (+1 in x direction, +1 in y, 
	        // -1 in x, -1 in y). Only potential because we haven't yet checked 
	        // if we've already visited them
	        var neighbours: number[][] = [
	            [here[0] + 1, here[1]],
	            [here[0], here[1] + 1],
	            [here[0] - 1, here[1]],
	            [here[0], here[1] - 1]
	        ];
	        
	        // populate list of neighbouring cells that haven't been visited
	        var unvisitedNeighbours: number[][] = [];
	        for (var k = 0; k < 4; k++) {
	        
	            // if the neighbour in question is out of bounds then move onto next neighbour
	            if (neighbours[k][0] < 0 || neighbours[k][0] > this.x - 1 || neighbours[k][1] < 0 || neighbours[k][1] > this.y - 1) {
	                continue;
	            }
	             
	            if (this.cells[neighbours[k][0]][neighbours[k][1]].visited == false) {
	                unvisitedNeighbours.push(neighbours[k]);
	            }
	        }
	        
	        if (unvisitedNeighbours.length > 0) {
	            // if there are unvisited neighbouring cells then set a randomly chosen one of 
	            // them to be the next cell
	            this.next = unvisitedNeighbours[Math.floor(Math.random() * unvisitedNeighbours.length)];
	            
	            // update the cell wall openings properties appropriately
	            if (this.next[0] == here[0]) {
					if (this.next[1] > here[1]) {
	                    // the path moved one cell south
	                    this.cells[here[0]][here[1]].openings.south = true;
						this.cells[this.next[0]][this.next[1]].openings.north = true;
	                } else {
	                    // the path moved one cell north
	                    this.cells[here[0]][here[1]].openings.north = true;
						this.cells[this.next[0]][this.next[1]].openings.south = true;
	                }
	            } else {
					if (this.next[0] > here[0]) {
	                    // the path moved one cell to the east
	                    this.cells[here[0]][here[1]].openings.east = true;
						this.cells[this.next[0]][this.next[1]].openings.west = true;
	                } else {
	                    // the path moved one cell to the west
	                    this.cells[here[0]][here[1]].openings.west = true;
						this.cells[this.next[0]][this.next[1]].openings.east = true;
	                }
	            }
	            
	            // advance the path, set the next cell as visited, and then update where 'here' is
				path.push(this.next);
				this.cells[this.next[0]][this.next[1]].visited = true;
				this.nVisitedCells++;
				here = this.next;
	        } else {
	            // if there are no unvisited neighbouring cells then go back one step 
	            // on the path and adjust path accordingly
	            here = path.pop();
	        }
	    }
	    
	    // make entrance and exit. Set current cell to entrance, set isExit to true for exit cell
	    //this.cells[0][0].openings.north = true;
	    this.cells[0][0].isEntry = true;
	    this.cells[this.x - 1][this.y - 1].isExit = true;
	    //this.cells[this.x - 1][this.y - 1].openings.east = true;
 	}
}
