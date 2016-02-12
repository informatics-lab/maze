/// <reference path="cell.ts" />
/// <reference path="mazeGenerationAlgorithm.ts" />
/// <reference path="direction.ts" />
/// <reference path="firstPersonMaze.ts" />

// See (e.g) http://weblog.jamisbuck.org/2011/1/10/maze-generation-prim-s-algorithm
class MazeGenerationPrimsAlgorithm extends MazeGenerationAlgorithm {

	frontier: coordinates[] = [];	// list of cells neighbouring those cells already in maze

	constructor() {
		super();

	}

	createCell(i: number, j: number): PrimsCell {
		return new PrimsCell(i, j);
	}

	generateMazeInMatrix(mazeMatrix: PrimsCell[][]): Cell[][] {
		var maxX: number = mazeMatrix.length;
		var maxY: number = mazeMatrix[0].length;

		// start with adding a random cell to the maze (which adds its neighbours to the 'frontier' list)
		var here: coordinates = { x: Math.floor(Math.random() * maxX), y: Math.floor(Math.random() * maxY) };
		var neighbourInMaze: coordinates;
		this.addCellToMaze(here, mazeMatrix);

		// Keep looping until the length of 'frontier' cells is empty
		while (this.frontier.length > 0) {
			// Pick a new cell by randomly removing a frontier cell from the list and assigning it to the current cell
			here = this.frontier.splice(Math.floor(Math.random() * this.frontier.length), 1)[0];

			// get the current cell's neighbours which are already in the maze and pick one at random
			var neighbours: coordinates[] = this.getNeighboursAlreadyInMaze(here, mazeMatrix);
			neighbourInMaze = neighbours[Math.floor(Math.random() * neighbours.length)];

			// get the direction from the current cell back to it's neighbour in the maze and then carve a
			// passage between the two, and finally add the current cell to the maze (which updates the list
			// of 'frontier' cells too)
			var dir:Direction = DirectionUtils.getDirection(here, neighbourInMaze);
			mazeMatrix[here.x][here.y].openingsCode += dir;
			mazeMatrix[neighbourInMaze.x][neighbourInMaze.y].openingsCode += DirectionUtils.opposite(dir);

			this.addCellToMaze(here, mazeMatrix);
		}

		return mazeMatrix;
	}

	// Mark a cell at the given coordinates as being in the maze. Then add all it's neighbours to the 
	// list of 'frontier' cells
	private addCellToMaze(cellCoords: coordinates, matrix: PrimsCell[][]): void {
		matrix[cellCoords.x][cellCoords.y].visited = true;
		this.addFrontier({ x: cellCoords.x - 1, y: cellCoords.y }, matrix);
		this.addFrontier({ x: cellCoords.x + 1, y: cellCoords.y }, matrix);
		this.addFrontier({ x: cellCoords.x, y: cellCoords.y - 1 }, matrix);
		this.addFrontier({ x: cellCoords.x, y: cellCoords.y + 1 }, matrix);
	}

	// Get a list of all the neighbours of a given cell which are already in the maze
	private getNeighboursAlreadyInMaze(cellCoords: coordinates, matrix: PrimsCell[][]): coordinates[] {
		var neighbours = [];

		var x: number = cellCoords.x; 
		var y: number = cellCoords.y;

		if (x > 0 && matrix[x - 1][y].visited) { 
			neighbours.push({ x: x - 1, y: y }); 
		}
		if (x + 1 < matrix.length && matrix[x + 1][y].visited) { 
			neighbours.push({ x: x + 1, y: y });
		}
		if (y > 0 && matrix[x][y - 1].visited) { 
			neighbours.push({ x: x, y: y - 1 }); 
		}
		if (y + 1 < matrix[0].length && matrix[x][y + 1].visited) { 
			neighbours.push({ x: x, y: y + 1 }); 
		}

		return neighbours
	}

	// Add a given cell to the list of 'frontier' cells as long as it's not been visited before by the 
	// algorithm (not in the maze), is within the maze bounds, and is not already a 'frontier' cell
	private addFrontier(cellCoords: coordinates, matrix: PrimsCell[][]): void {
		if (this.cellIsInBoundsAndUnvisited(matrix, cellCoords)) {
			if (matrix[cellCoords.x][cellCoords.y].frontier == false) {
				matrix[cellCoords.x][cellCoords.y].frontier = true;
				this.frontier.push(cellCoords);
			}
		}
	}
}






