/// <reference path="mazeViewer.ts" />
/// <reference path="../MazeUtils.ts" />

// Uses a HTML table with images added to cells (in this regard similar to imageMazeViewer). The difference
// is that this class uses only a total of 5 images which are all superimposed on the same cell to display
// that cell's configuration. The 5 images are a central square, and then four passages leading in the 
// four direcions - N, S, E & W. In addition there is a sixth image representing a robot solving the maze.

class CompositeImageMazeViewer extends MazeViewer {
	cellSize: number;
	robotIcon: HTMLImageElement;

	currentDisplayCell: HTMLTableCellElement;
	prevDisplayCell: HTMLTableCellElement;

	constructor(maze: Maze) {
		super(maze);

		this.cellSize = 10//200 / this.maze.x;
		this.robotIcon = MazeUtils.createImage('images/robot.png', this.cellSize);
	}

	displayMaze(): void {
		var table = <HTMLTableElement>document.createElement('table');
		table.cellSpacing = "0";
		var row : HTMLTableRowElement;
		var cell : HTMLTableCellElement;
		for (var j = 0; j < this.maze.y; j++) {
			row = <HTMLTableRowElement>table.insertRow();
			for (var i = 0; i < this.maze.x; i++) {
				cell = <HTMLTableCellElement>row.insertCell();
				cell.style.position = 'relative';
				cell.style.minWidth = this.cellSize + 'px';
				cell.style.height = this.cellSize + 'px';
				cell.style.border = '0px solid black';
				cell.style.padding = '0';
				cell.id = i + "," + j;

				cell.appendChild(MazeUtils.createImage('images/centre.png', this.cellSize));

				// loop through openings and create image for each direction present 
				var openings = this.maze.cells[i][j].openings;
				for (var opening in openings) {
					if (openings[opening]) {
						cell.appendChild(MazeUtils.createImage('images/' + opening + '.png', this.cellSize));
					}
				}

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

	updateRobotDisplay(cell: Cell): void {
		this.currentDisplayCell = <HTMLTableCellElement>document.getElementById(cell.id);

		if (this.prevDisplayCell && this.robotIcon.parentNode == this.prevDisplayCell) {
			this.prevDisplayCell.removeChild(this.robotIcon);
		}
		this.currentDisplayCell.appendChild(this.robotIcon);

		this.prevDisplayCell = this.currentDisplayCell;
	}

	supportsRobots(): boolean {
		return true;
	}
}






