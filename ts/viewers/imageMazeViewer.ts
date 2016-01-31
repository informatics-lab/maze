/// <reference path="../MazeUtils.ts" />
/// <reference path="mazeViewer.ts" />
/// <reference path="../maze/cell.ts" />

// uses a set of images of maze cells that are named by a hexadecimal character (see codesMazeView.ts). These
// images are added to cells of an HTML table to produce a view of the maze

class ImageMazeViewer extends MazeViewer {
	imageSize: number;
	robotIcon: HTMLImageElement;

  	currentDisplayCell: HTMLTableCellElement;
  	prevDisplayCell: HTMLTableCellElement;

	constructor(maze: Maze) {
		super(maze);

		this.imageSize = 16//400 / maze.x;
		this.robotIcon = MazeUtils.createImage('images/robot_test.png', this.imageSize);
	}

	displayMaze(): void {
		var table = <HTMLTableElement>document.createElement('table');
		table.cellSpacing = '0';
		var row: HTMLTableRowElement;
		var cell: HTMLTableCellElement;
		var tileCode: string;
		for (var j = 0; j < this.maze.y; j++) {
			row = <HTMLTableRowElement>table.insertRow();
		  	for (var i = 0; i < this.maze.x; i++) {
				cell = <HTMLTableCellElement>row.insertCell();
				cell.style.position = 'relative';
				cell.style.minWidth = this.imageSize + 'px';
				cell.style.height = this.imageSize + 'px';
				cell.style.border = '0px solid black';
				cell.style.padding = '0';
				cell.id = i + "," + j;

				tileCode = this.maze.cells[i][j].openingsCode.toString(16);

				cell.appendChild(MazeUtils.createImage('images/' + tileCode + '.png', this.imageSize));
		  	}
		}
		this.container.appendChild(table);
		this.mazeDisplayed = true;
	}

  	resetMazeView(): void {
		// set up the current display cell ready for if/when we need to display the maze being solved
		var entryCellId: string = this.maze.cells[0][0].id
		this.currentDisplayCell = <HTMLTableCellElement>document.getElementById(entryCellId);
		this.prevDisplayCell = null;
		this.mazeDisplayed = false;
  	}

  	supportsRobots(): boolean {
		return true; 
  	}

  	updateRobotDisplay(cell: Cell): void {
		this.currentDisplayCell = <HTMLTableCellElement>document.getElementById(cell.id);

		if (this.prevDisplayCell && this.robotIcon.parentNode == this.prevDisplayCell) {
	  		this.prevDisplayCell.removeChild(this.robotIcon);
		}
		this.currentDisplayCell.appendChild(this.robotIcon);

		this.prevDisplayCell = this.currentDisplayCell;
  	}
}

