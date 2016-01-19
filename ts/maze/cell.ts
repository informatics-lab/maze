/*
interface cell {
	visited: boolean;
	isExit: boolean;
	isEntry: boolean;
	openings: cellOpenings;
	id: string;
}
*/

class cell {
	visited: boolean;
	isExit: boolean;
	isEntry: boolean;
	openings: cellOpenings;
	id: string;

	constructor(i: number, j: number) {
		this.id = i + "," + j;
		this.visited = false;
		this.isExit = false;
		this.isEntry = false;
		this.openings = {
			north: false,
			east: false,
			south: false,
			west: false
		};
	}
}

interface cellOpenings {
	north: boolean;
	east: boolean;
	south: boolean;
	west: boolean;
}