/// <reference path="cell.ts" />
/// <reference path="mazeGenerationAlgorithm.ts" />

class Maze {

	x: number;
	y: number;
	generationAlgorithm: MazeGenerationAlgorithm;
	cells: MazeGeneratingCell[][] = [];

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

 	private createMaze(): void {
		  this.cells = this.generationAlgorithm.generateMaze(this.x, this.y);
 	}
}
