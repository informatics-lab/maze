/// <reference path="mazeViewer.ts" />
/// <reference path="../mazeUtils.ts" />
/// <reference path="../maze/cell.ts" />

// Displayes the maze in an HTML table with the table cell borders represnting walls in the maze
class BorderMazeViewer extends MazeViewer {
	
	displayCodes: boolean;
	tableWidth: number;
	noBorder: string = '1px dotted #CCC';
	border: string = '1px solid black';

	prevCell: RecursiveBacktrackingCell;

	constructor(maze: Maze, displayCodes?: boolean) {
		super(maze);
		this.displayCodes = displayCodes;
		this.tableWidth = this.maze.x * 8;
	}

	displayMaze() {
		var table: HTMLTableElement = <HTMLTableElement>document.createElement('table');

		table.style.width = this.tableWidth + 'px';
		table.cellSpacing = '0';
		var row: HTMLTableRowElement;   
		var cell: HTMLTableCellElement;
		for (var j = 0; j < this.maze.y; j++) {
			row = <HTMLTableRowElement>table.insertRow()
			for (var i = 0; i < this.maze.x; i++) {

				cell = <HTMLTableCellElement>row.insertCell();
				cell.style.border = this.border;
				cell.style.padding = '0';
				cell.style.fontSize = '4pt';

				var mazeCell = this.maze.cells[i][j]; 
				cell.id = mazeCell.id;

				cell.innerHTML = this.displayCodes ? mazeCell.openingsCode.toString(16) : '&nbsp;'

				var directionsToBorders = {
					north: 'Top',
					east: 'Right',
					south: 'Bottom',
					west: 'Left'
				};

				for (var direction in directionsToBorders) {
					var border = 'border' + directionsToBorders[direction];
					if (mazeCell.openings[direction]) {
						cell.style[border] = this.noBorder;
					}
				}
			}
		}
		this.container.appendChild(table);
		this.mazeDisplayed = true;
	}

	updateRobotDisplay(cell: RecursiveBacktrackingCell): void {
		if (this.prevCell) {
			if (this.prevCell.lineDrawn) {
				document.getElementById(this.prevCell.id).style.backgroundColor = 'orange';
			} else {
				document.getElementById(this.prevCell.id).style.backgroundColor = 'yellow';
			}
		}

		document.getElementById(cell.id).style.backgroundColor = 'red';
		this.prevCell = cell;
	}

	resetMazeView(): void {
		for (var j = 0; j < this.maze.y; j++) {
			for (var i = 0; i < this.maze.x; i++) {
				document.getElementById(i + "," + j).style.backgroundColor = 'white';
			}
		}
	
		this.prevCell = null;
		this.mazeDisplayed = false;
	}

	supportsRobots(): boolean {
		return true;
	}
	
}