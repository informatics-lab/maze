// In which direction(s) is there an opening from a maze cell to neighbouring cells
class CellOpenings {
	north: boolean = false;
	east: boolean = false;
	south: boolean = false;
	west: boolean = false;

	constructor() {

	}
}

// Note that visited here refers to whether the cell has been visited or not during maze _creation_ (not maze solving)
class Cell {
	visited: boolean;
	frontier: boolean;
	isExit: boolean;
	isEntry: boolean;
	private _openings: CellOpenings;
	private _openingsCode: number;
	id: string;

	constructor(i: number, j: number) {
		this.id = i + "," + j;
		this.visited = false;
		this.frontier = false;
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
		var openings: CellOpenings = { north: false, east: false, south: false, west: false };

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



