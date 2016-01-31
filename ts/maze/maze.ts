/// <reference path="cell.ts" />
/// <reference path="mazeGenerationAlgorithm.ts" />

class Maze {

	x: number;
	y: number;
	generationAlgorithm: MazeGenerationAlgorithm;
	cells: Cell[][] = [];

	constructor(x: number, y: number, generationAlgorithm: MazeGenerationAlgorithm) {
		this.x = x;
		this.y = y;
		this.generationAlgorithm = generationAlgorithm;

		if (this.x * this.y < 1) {
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
	            // TODO: refactor so that we don't need to do this!
	            var coreProperties = ['visited', 'frontier', 'isExit', 'isEntry', 'openings', 'openingsCode', '_openings', '_openingsCode', 'id'];
	            
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
		  this.cells = this.generationAlgorithm.generateMaze(this.x, this.y);
 	}
}
