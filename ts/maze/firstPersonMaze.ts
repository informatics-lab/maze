/// <reference path="../maze/maze.ts" />

// move coordinates interface somewhere else I guess?
interface coordinates {
	x: number;
	y: number;
}

class FirstPersonMaze {

	private _cells: cell[][];
	private _currentCoordinates: coordinates = { x: 0, y: 0 };
	private _currentCell = this._cells[this._currentCoordinates.x][this._currentCoordinates.y];

	constructor(thirdPersonMaze: Maze) {
		this._cells = thirdPersonMaze.cells;
	}

	getCurrentCell(): cell {
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

	look(direction: string) {
		// get array of cells in a straight line in this direction until we come to a wall
		var lookCells: cell[] = [];
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
