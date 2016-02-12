/// <reference path="cell.ts" />

abstract class MazeGenerationAlgorithm {

	constructor() { }

	generateMaze(width: number, height: number): MazeGeneratingCell[][] {
		var emptyMatrix: MazeGeneratingCell[][] = this.getEmptyMazeMatrix(width, height);

		return this.generateMazeInMatrix(emptyMatrix);
	}

	private getEmptyMazeMatrix(width: number, height: number): MazeGeneratingCell[][] {
		var cells: MazeGeneratingCell[][] = [];
	    
		// populate cells array
		for (var i = 0; i < width; i++) {
			cells[i] = [];
			for (var j = 0; j < height; j++) {
				var cell = this.createCell(i, j);
				cells[i].push(cell);
			}
		}

		// make entrance and exit. Set current cell to entrance, set isExit to true for exit cell
		cells[0][0].isEntry = true;
		cells[width - 1][height - 1].isExit = true;

		return cells;
	}

	protected abstract createCell(i: number, j: number): MazeGeneratingCell;

	protected abstract generateMazeInMatrix(emptyMatrix: MazeGeneratingCell[][]): MazeGeneratingCell[][]; 

	// Check if cell coordinates belong to a cell which is unvisited (no wall openings) and 
	// is within the outer bounds of the maze
	protected cellIsInBoundsAndUnvisited(matrix: MazeGeneratingCell[][], cellCoords: coordinates): boolean {
		return cellCoords.x >= 0 && cellCoords.y >= 0 &&
			cellCoords.x < matrix.length && cellCoords.y < matrix[0].length &&
			matrix[cellCoords.x][cellCoords.y].openingsCode == 0;
	}
}





