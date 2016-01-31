/// <reference path="mazeViewer.ts" />
/// <reference path="../maze/cell.ts" />
/// <reference path="../mazeUtils.ts" />

// An unusual maze viewer which doesn't produce a pictorial view of the maze, but simply encodes each cell 
// in sequence (as reading a book from NW corner to SE corner) as a hexadecimal character based on the openings
// that each cell has to its neighbours. This gets displayed in a text area. Could be used for easy 'saving'
// of maze configurations.

class CodesMazeViewer extends MazeViewer {

	textArea: HTMLTextAreaElement = null;

	constructor(maze) {
		super(maze);

		this.textArea = <HTMLTextAreaElement>document.createElement("textarea");
	}

	displayMaze(): void {
		var outString = '';
		var mazeCell: Cell;
		var tileCode: string;

		for (var j = 0; j < this.maze.y; j++) {
			for (var i = 0; i < this.maze.x; i++) {
				mazeCell = this.maze.cells[i][j];
				outString += mazeCell.openingsCode.toString(16);
			}
		}

		this.textArea.id = "codesTextArea";
		this.textArea.cols = 150;
		this.textArea.rows = 40;
		this.textArea.value = outString;

		this.container.appendChild(this.textArea);
		this.mazeDisplayed = true;
	}

	resetMazeView(): void {
		var textArea: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById('codesTextArea');
		textArea.value = '';
		this.mazeDisplayed = false;
	}

	updateRobotDisplay(cell: Cell): void {
		console.log("updateRobotDisplay function is not applicable for codesMazeViewer");
	}

	supportsRobots(): boolean {
		return false;
	}
}



