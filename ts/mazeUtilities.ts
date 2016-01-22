/// <reference path="maze/cell.ts" />

// Using a module allows us to create something like a static class
module MazeUtilities {
	export function createImage(source: string, size: number): HTMLImageElement {
		var img = document.createElement('img');
		img.src = source
		img.style.width = size + 'px';
		img.style.height = size + 'px';
		img.style.position = 'absolute';
		return img;
	}

	// Encode a cell based on which direction(s) it has openings to neighbouring cells 
	export function cellToTile(cell: Cell): string {
		var sum: number = 0;
		if (cell.openings.north) { sum += 8; }
		if (cell.openings.east) { sum += 4; }
		if (cell.openings.south) { sum += 2; }
		if (cell.openings.west) { sum += 1; }
		return sum.toString(16);
	}
}




