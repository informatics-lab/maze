/// <reference path="../maze/maze.ts" />
/// <reference path="../maze/cell.ts" />

abstract class MazeViewer {

	maze: Maze;
	mazeDisplayed: boolean;

	constructor(maze: Maze) {
		this.maze = maze;
	}

	abstract displayMaze(): void;

	abstract updateRobotDisplay(cell: cell): void;

	abstract resetMazeView(): void;
}
