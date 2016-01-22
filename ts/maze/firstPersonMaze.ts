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

	private _cells: Cell[][];
	private _currentCoordinates;
	private _currentCell: Cell

	constructor(thirdPersonMaze: Maze) {
		this._cells = thirdPersonMaze.cells;
		this._currentCoordinates = { x: 0, y: 0 };
		this._currentCell = this._cells[this._currentCoordinates.x][this._currentCoordinates.y];
	}

	getCurrentCell(): Cell {
		return this._currentCell;
	}

	move(facing: string) {
		this._currentCoordinates = this._changeCoordinatesInDirection(this._currentCoordinates, facing);
		if (this._currentCoordinates == null) {
			return false
		} else {
			this._currentCell = this._cells[this._currentCoordinates.x][this._currentCoordinates.y];
			console.log("robot moved to new cell of x: ", this._currentCoordinates.x, ", y: ", this._currentCoordinates.y);
			return true;
		}
	}

	look(direction: string): Cell[] {
		// get array of cells in a straight line in this direction until we come to a wall
		var lookCells: Cell[] = [];
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

	private _changeCoordinatesInDirection(coordinates: coordinates, direction: string) {

		var newCoordinates = coordinates;
		var cell = this._cells[coordinates.x][coordinates.y];

		if (direction == 'west' && cell.openings.west) {
			newCoordinates.x -= 1;
		} else if (direction == 'east' && cell.openings.east) {
			newCoordinates.x += 1;
		} else if (direction == 'north' && cell.openings.north) {
			newCoordinates.y -= 1;
		} else if (direction == 'south' && cell.openings.south) {
			newCoordinates.y += 1;
		} else {
			return null;
		}

		return newCoordinates;
	}

}
