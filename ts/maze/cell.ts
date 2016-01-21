class CellOpenings {
	north: boolean = false;
	east: boolean = false;
	south: boolean = false;
	west: boolean = false;

	constructor() {

	}
}

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


