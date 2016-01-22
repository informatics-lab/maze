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
	isExit: boolean;
	isEntry: boolean;
	openings: CellOpenings;
	id: string;

	constructor(i: number, j: number) {
		this.id = i + "," + j;
		this.visited = false;
		this.isExit = false;
		this.isEntry = false;
		this.openings = new CellOpenings();
	}
}



