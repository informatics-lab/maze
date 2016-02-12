/// <reference path="direction.ts" />

// In which direction(s) is there an opening from a maze cell to neighbouring cells
class CellOpenings {
	north: boolean = false;
	east: boolean = false;
	south: boolean = false;
	west: boolean = false;

	constructor() {

	}

	getOpenDirections(): Direction[] {
		var openDirections: Direction[] = [];
		if (this.north) {
			openDirections.push(Direction.N);
		}
		if (this.east) {
			openDirections.push(Direction.E);
		}
		if (this.south) {
			openDirections.push(Direction.S);
		}
		if (this.west) {
			openDirections.push(Direction.W);
		}

		return openDirections;
	}
}

class Cell {
	isExit: boolean;
	isEntry: boolean;
	private _openings: CellOpenings;
	private _openingsCode: number;
	id: string;

	constructor(i: number, j: number) {
		this.id = i + "," + j;
		this.isExit = false;
		this.isEntry = false;
		this.openings = new CellOpenings();
	}

	get openings(): CellOpenings {
		return this._openings;
	}

	set openings(openings: CellOpenings) {
		this._openings = openings;
		this._openingsCode = Cell.openingsToCode(openings);
	}

	get openingsCode(): number {
		return this._openingsCode;
	}

	set openingsCode(openingsCode: number) {
		this._openingsCode = openingsCode;
		this._openings = Cell.codeToOpenings(openingsCode);
	}

	static openingsToCode(openings: CellOpenings): number {
		var code: number = 0;
		if (openings.north) { code += 8; }
		if (openings.east) { code += 4; }
		if (openings.south) { code += 2; }
		if (openings.west) { code += 1; }
		return code;
	}

	static codeToOpenings(openingsCode: number): CellOpenings {
		var openings: CellOpenings = new CellOpenings();

		var power: number;
		while (openingsCode > 0) {
			power = MazeUtils.getLargestPowerOfTwo(openingsCode);
			if (power == 8) {
				openings.north = true;
			} else if (power == 4) {
				openings.east = true;
			} else if (power == 2) {
				openings.south = true;
			} else if (power == 1) {
				openings.west = true;
			}
			openingsCode -= power;
		}
		return openings;
	}
}

class MazeGeneratingCell extends Cell {
	constructor(i: number, j: number) {
		super(i, j);
	}
}

class MazeSolvingCell extends Cell {
	constructor(i: number, j: number) {
		super(i, j);
	}
}

class PrimsCell extends MazeGeneratingCell {
	frontier: boolean;
	visited: boolean;

	constructor(i: number, j: number) {
		super(i, j);
		this.frontier = false;
		this.visited = false;
	}
}

class RecursiveBacktrackingCell extends MazeSolvingCell {
	lineDrawn: boolean;
	robotVisited: boolean;

	constructor(i: number, j: number) {
		super(i, j);
		this.lineDrawn = false;
		this.robotVisited = false;
	}
}

abstract class MazeSolvingCellFactory {
	constructor() { }

	abstract createCell(i: number, j: number): MazeSolvingCell;
}

class RecursiveBacktrackingCellFactory extends MazeSolvingCellFactory {
	constructor() {
		super();
	}

	createCell(i: number, j: number): MazeSolvingCell {
		return new RecursiveBacktrackingCell(i, j);
	}
}

class DefaultMazeSolvingCellFactory extends MazeSolvingCellFactory {
	constructor() {
		super();
	}

	createCell(i: number, j: number): MazeSolvingCell {
		return new MazeSolvingCell(i, j);
	}
}
