/// <reference path="cell.ts" />
/// <reference path="mazeGenerationAlgorithm.ts" />
/// <reference path="direction.ts" />

// See (e.g.) http://weblog.jamisbuck.org/2011/1/27/maze-generation-growing-tree-algorithm
class MazeGenerationGrowingTreeAlgorithm extends MazeGenerationAlgorithm {

	constructor() {
		super();
	}

	createCell(i: number, j: number): MazeGeneratingCell {
		return new MazeGeneratingCell(i, j);
	}

	generateMazeInMatrix(mazeMatrix: MazeGeneratingCell[][]): MazeGeneratingCell[][] {
		var maxX = mazeMatrix.length;
		var maxY = mazeMatrix[0].length;

		// create an empty list of cells and add a random one to it
		var cellList: coordinates[] = [];
		var here: coordinates = { x: Math.floor(Math.random() * maxX), y: Math.floor(Math.random() * maxY) }
		var next: coordinates;
		cellList.push(here);

		// loop through adding to cells list if there are unvisited neighbours to add, or remove cells if not
		// when cell list is empty we know that the maze contains all the cells
		while (cellList.length > 0) {
			// set the current cell to the most recently added cell in the cell list
			var index: number = cellList.length - 1;
			here = cellList[cellList.length - 1];

			// Try each direction randomly in turn, and for each direction...
			var directions: Direction[] = MazeUtils.shuffle([Direction.N, Direction.E, Direction.S, Direction.W])
			for (var dir of directions) {
				// ...set our proposed next cell to be the one that lies immediately in that direction
				next = { x: here.x + DirectionUtils.dX(dir), y: here.y + DirectionUtils.dY(dir) }
				if (this.cellIsInBoundsAndUnvisited(mazeMatrix, next)) {
					// If that cell had not previously been visited by the algorithm, and is within the maze bounds
					// then carve a pasageway from our current cell to this new one, and add the new one to the cell list
					mazeMatrix[here.x][here.y].openingsCode += dir;
					mazeMatrix[next.x][next.y].openingsCode += DirectionUtils.opposite(dir);
					cellList.push(next);
					// We set index to null to indicate that we've found a neighbouring cell, and we don't need
					// to remove a cell from the list
					index = null;
					break;
				}
			}
			// If index is null we know we've not found a suitable neighbouring cell and we must 'backtrack'
			// by removing the most recently added cell before continuing the loop.
			if (index !== null) {
				cellList.pop();
			}
		}

		return mazeMatrix;
	}
}






