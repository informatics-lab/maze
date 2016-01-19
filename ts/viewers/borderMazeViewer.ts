/// <reference path="mazeViewer.ts" />
/// <reference path="../mazeUtilities.ts" />
/// <reference path="../maze/cell.ts" />

// Define the BorderMazeViewer constructor
class BorderMazeViewer extends MazeViewer {
  
  displayCodes: boolean;
  tableWidth: number;
  noBorder: string = '1px dotted #CCC';
  border: string = '1px solid black';

  currentDisplayCell: HTMLElement;
  prevDisplayCell: HTMLElement;

  constructor(maze: Maze, displayCodes?: boolean) {
    super(maze);
    this.displayCodes = displayCodes;
    this.mazeDisplayed = false;
    this.tableWidth = this.maze.x * 8;
  }

  displayMaze() {
    var container = document.getElementById('mazeDisplay');
    var table = document.createElement('table');

    table.style.width = this.tableWidth + 'px';
    table.cellSpacing = '0';
    var row: HTMLElement;   // this should probably be HTMLTableRowElement but waiting for TS v1.8 for this change.
    var cell: HTMLElement;  // this should probably be HTMLTableCellElement but waiting for TS v1.8 for this change.
    for (var j = 0; j < this.maze.y; j++) {
      row = table.insertRow();
      for (var i = 0; i < this.maze.x; i++) {

        cell = row.insertCell();
        cell.style.border = this.border;
        cell.style.padding = '0';
        cell.style.fontSize = '4pt';

        var mazeCell = this.maze.cells[i][j]; 
        cell.id = mazeCell.id;

        cell.innerHTML = this.displayCodes ? cellToTile(mazeCell) : '&nbsp;'

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
    container.appendChild(table);
    this.mazeDisplayed = true;
    
    // set up the current display cell ready for if/when we need to display the maze being solved
    var entryCellId: string = this.maze.cells[0][0].id;
    this.currentDisplayCell = document.getElementById(entryCellId);
  }

  updateRobotDisplay(cell: cell): void {
    this.currentDisplayCell = document.getElementById(cell.id);

    if (this.prevDisplayCell) {
      if (this.prevDisplayCell.line) {
        this.prevDisplayCell.style.backgroundColor = 'orange';
      } else {
        this.prevDisplayCell.style.backgroundColor = 'yellow';
      }
    }

    if (cell.lineDrawn) {
      this.currentDisplayCell.line = true;
    } else {
      this.currentDisplayCell.line = false;
    }
    this.currentDisplayCell.style.backgroundColor = 'red';

    this.prevDisplayCell = this.currentDisplayCell;
  }

  resetMazeView(): void {
    var displayCell: HTMLElement;
    for (var j = 0; j < this.maze.y; j++) {
      for (var i = 0; i < this.maze.x; i++) {
        displayCell = document.getElementById(i + "," + j);
        displayCell.style.backgroundColor = 'white';
        displayCell.line = false;
      }
    }
  
    // set up the current display cell ready for if/when we need to display the maze being solved
    var entryCellId: string = this.maze.cells[0][0].id
    this.currentDisplayCell = document.getElementById(entryCellId);
    this.prevDisplayCell = null;
    this.mazeDisplayed = false;
  }
  
}