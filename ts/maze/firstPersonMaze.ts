/// <reference path="../maze/maze.ts" />

// TODO: move coordinates interface somewhere else 
interface coordinates {
	x: number;
	y: number;
}


// The reason for a first person maze is so that a robot can be passed a maze to solve, but one which
// it can't simply access a full matrix of maze cells and interrogate for the best solution. Instead
// this FirstPersonMaze class will only allow clients to see where they are now, to look in a direction
// or to move one cell in a given direction.

class FirstPersonMaze {

	private _cells: MazeSolvingCell[][];
	private _currentCoordinates: coordinates;
	private _currentCell: Cell

	constructor(thirdPersonMaze: Maze, mazeSolvingCellFactory: MazeSolvingCellFactory) {
		this._convertCellsToMazeSolvingCells(thirdPersonMaze, mazeSolvingCellFactory)
		this._currentCoordinates = { x: 0, y: 0 };
		this._currentCell = this._cells[this._currentCoordinates.x][this._currentCoordinates.y];
	}

	getCurrentCell(): MazeSolvingCell {
		return this._currentCell;
	}

	move(facing: Direction): boolean {
		this._currentCoordinates = this._changeCoordinatesInDirection(this._currentCoordinates, facing);
		if (this._currentCoordinates == null) {
			return false
		} else {
			this._currentCell = this._cells[this._currentCoordinates.x][this._currentCoordinates.y];
			console.log("robot moved to new cell of x: ", this._currentCoordinates.x, ", y: ", this._currentCoordinates.y);
			return true;
		}
	}

	look(direction: Direction): MazeSolvingCell[] {
		// get array of cells in a straight line in this direction until we come to a wall
		var lookCells: MazeSolvingCell[] = [];
		var coordinates: coordinates = {
			x: this._currentCoordinates.x,
			y: this._currentCoordinates.y
		}

		var nextCoordinates = this._changeCoordinatesInDirection(coordinates, direction);
		while (nextCoordinates != null) {
			lookCells.push(this._cells[nextCoordinates.x][nextCoordinates.y]);
			nextCoordinates = this._changeCoordinatesInDirection(coordinates, direction);
		}

		return lookCells;
	}

	private _changeCoordinatesInDirection(coordinates: coordinates, direction: Direction): coordinates {

		var newCoordinates = coordinates;
		var cell = this._cells[coordinates.x][coordinates.y];

		if (direction == Direction.W && cell.openings.west) {
			newCoordinates.x -= 1;
		} else if (direction == Direction.E && cell.openings.east) {
			newCoordinates.x += 1;
		} else if (direction == Direction.N && cell.openings.north) {
			newCoordinates.y -= 1;
		} else if (direction == Direction.S && cell.openings.south) {
			newCoordinates.y += 1;
		} else {
			return null;
		}

		return newCoordinates;
	}

	// convert the third-person maze's cells (which will be cells used in generating the maze) into
	// cells for solving the maze. These will have different properties needed by robots solving the maze
	// - e.g. a property to keep track of a line that the robot may have drawn while navigating the maze
	private _convertCellsToMazeSolvingCells(thirdPersonMaze: Maze, mazeSolvingCellFactory: MazeSolvingCellFactory): void {
		this._cells = [];
		for (var i = 0; i < maze.x; i++) {
			this._cells[i] = [];
			for (var j = 0; j < maze.y; j++) {

				var mazeGenerationCell = thirdPersonMaze.cells[i][j];
				var mazeSolvingCell = mazeSolvingCellFactory.createCell(i, j);
				mazeSolvingCell.isEntry = mazeGenerationCell.isEntry;
				mazeSolvingCell.isExit = mazeGenerationCell.isExit;
				mazeSolvingCell.openings = mazeGenerationCell.openings;
				this._cells[i][j] = mazeSolvingCell;
			}
		}
	}
}
