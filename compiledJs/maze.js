// In which direction(s) is there an opening from a maze cell to neighbouring cells
var CellOpenings = (function () {
    function CellOpenings() {
        this.north = false;
        this.east = false;
        this.south = false;
        this.west = false;
    }
    return CellOpenings;
})();
// Note that visited here refers to whether the cell has been visited or not during maze _creation_ (not maze solving)
var Cell = (function () {
    function Cell(i, j) {
        this.id = i + "," + j;
        this.visited = false;
        this.isExit = false;
        this.isEntry = false;
        this.openings = new CellOpenings();
    }
    return Cell;
})();
/// <reference path="cell.ts" />
var Maze = (function () {
    function Maze(x, y) {
        this.cells = [];
        this.x = x;
        this.y = y;
        this.nCells = x * y;
        this.nVisitedCells = 0;
        if (this.nCells < 1) {
            alert("illegal maze dimensions");
            return;
        }
        else {
            this.createMaze();
        }
    }
    Maze.prototype.reset = function () {
        for (var i = 0; i < this.x; i++) {
            for (var j = 0; j < this.y; j++) {
                var cell = this.cells[i][j];
                // remove any cell properties that aren't in the 'core' list. This ensures
                // that any properties added by previous robots are removed ready for new robot
                var coreProperties = ['visited', 'isExit', 'isEntry', 'openings', 'id'];
                for (var property in cell) {
                    if (coreProperties.indexOf(property) == -1) {
                        // remove this non-core property
                        delete cell[property];
                    }
                }
            }
        }
    };
    Maze.prototype.createMaze = function () {
        // start our path from a random cell
        var here = [Math.floor(Math.random() * this.x), Math.floor(Math.random() * this.y)];
        var path = [here];
        // populate cells array with all cells set as not visited and no wall openings
        for (var i = 0; i < this.x; i++) {
            this.cells[i] = [];
            for (var j = 0; j < this.y; j++) {
                var cell = new Cell(i, j);
                this.cells[i].push(cell);
            }
        }
        // adjust cells array to reflect that we've already 'visited' our starting cell
        this.cells[here[0]][here[1]].visited = true;
        this.nVisitedCells++;
        // create a path through the maze until we've visited every cell
        while (this.nVisitedCells < this.nCells) {
            // get the four potential next cells (+1 in x direction, +1 in y, 
            // -1 in x, -1 in y). Only potential because we haven't yet checked 
            // if we've already visited them
            var neighbours = [
                [here[0] + 1, here[1]],
                [here[0], here[1] + 1],
                [here[0] - 1, here[1]],
                [here[0], here[1] - 1]
            ];
            // populate list of neighbouring cells that haven't been visited
            var unvisitedNeighbours = [];
            for (var k = 0; k < 4; k++) {
                // if the neighbour in question is out of bounds then move onto next neighbour
                if (neighbours[k][0] < 0 || neighbours[k][0] > this.x - 1 || neighbours[k][1] < 0 || neighbours[k][1] > this.y - 1) {
                    continue;
                }
                if (this.cells[neighbours[k][0]][neighbours[k][1]].visited == false) {
                    unvisitedNeighbours.push(neighbours[k]);
                }
            }
            if (unvisitedNeighbours.length > 0) {
                // if there are unvisited neighbouring cells then set a randomly chosen one of 
                // them to be the next cell
                this.next = unvisitedNeighbours[Math.floor(Math.random() * unvisitedNeighbours.length)];
                // update the cell wall openings properties appropriately
                if (this.next[0] == here[0]) {
                    if (this.next[1] > here[1]) {
                        // the path moved one cell south
                        this.cells[here[0]][here[1]].openings.south = true;
                        this.cells[this.next[0]][this.next[1]].openings.north = true;
                    }
                    else {
                        // the path moved one cell north
                        this.cells[here[0]][here[1]].openings.north = true;
                        this.cells[this.next[0]][this.next[1]].openings.south = true;
                    }
                }
                else {
                    if (this.next[0] > here[0]) {
                        // the path moved one cell to the east
                        this.cells[here[0]][here[1]].openings.east = true;
                        this.cells[this.next[0]][this.next[1]].openings.west = true;
                    }
                    else {
                        // the path moved one cell to the west
                        this.cells[here[0]][here[1]].openings.west = true;
                        this.cells[this.next[0]][this.next[1]].openings.east = true;
                    }
                }
                // advance the path, set the next cell as visited, and then update where 'here' is
                path.push(this.next);
                this.cells[this.next[0]][this.next[1]].visited = true;
                this.nVisitedCells++;
                here = this.next;
            }
            else {
                // if there are no unvisited neighbouring cells then go back one step 
                // on the path and adjust path accordingly
                here = path.pop();
            }
        }
        // make entrance and exit. Set current cell to entrance, set isExit to true for exit cell
        this.cells[0][0].isEntry = true;
        this.cells[this.x - 1][this.y - 1].isExit = true;
    };
    return Maze;
})();
/// <reference path="../maze/maze.ts" />
// The reason for a first person maze is so that a robot can be passed a maze to solve, but one which
// it can't simply access a full matrix of maze cells and interrogate for the best solution. Instead
// this FirstPersonMaze class will only allow clients to see where they are now, to look in a direction
// or to move one cell in a given direction.
var FirstPersonMaze = (function () {
    function FirstPersonMaze(thirdPersonMaze) {
        this._cells = thirdPersonMaze.cells;
        this._currentCoordinates = { x: 0, y: 0 };
        this._currentCell = this._cells[this._currentCoordinates.x][this._currentCoordinates.y];
    }
    FirstPersonMaze.prototype.getCurrentCell = function () {
        return this._currentCell;
    };
    FirstPersonMaze.prototype.move = function (facing) {
        this._currentCoordinates = this._changeCoordinatesInDirection(this._currentCoordinates, facing);
        if (this._currentCoordinates == null) {
            return false;
        }
        else {
            this._currentCell = this._cells[this._currentCoordinates.x][this._currentCoordinates.y];
            console.log("robot moved to new cell of x: ", this._currentCoordinates.x, ", y: ", this._currentCoordinates.y);
            return true;
        }
    };
    FirstPersonMaze.prototype.look = function (direction) {
        // get array of cells in a straight line in this direction until we come to a wall
        var lookCells = [];
        var coordinates = {
            x: this._currentCoordinates.x,
            y: this._currentCoordinates.y
        };
        var nextCoordinates = this._changeCoordinatesInDirection(coordinates, direction);
        while (nextCoordinates != null) {
            lookCells.push(this._cells[nextCoordinates.x][nextCoordinates.y]);
            nextCoordinates = this._changeCoordinatesInDirection(coordinates, direction);
        }
        return lookCells;
    };
    FirstPersonMaze.prototype._changeCoordinatesInDirection = function (coordinates, direction) {
        var newCoordinates = coordinates;
        var cell = this._cells[coordinates.x][coordinates.y];
        if (direction == 'west' && cell.openings.west) {
            newCoordinates.x -= 1;
        }
        else if (direction == 'east' && cell.openings.east) {
            newCoordinates.x += 1;
        }
        else if (direction == 'north' && cell.openings.north) {
            newCoordinates.y -= 1;
        }
        else if (direction == 'south' && cell.openings.south) {
            newCoordinates.y += 1;
        }
        else {
            return null;
        }
        return newCoordinates;
    };
    return FirstPersonMaze;
})();
/// <reference path="../maze/maze.ts" />
/// <reference path="../maze/cell.ts" />
// Abstract superclass for maze viewers (displayers). Subclasses specifically decide how they will 
// display and reset the maze view, and how they will update the display of the robot as it solves the 
// maze. 
var MazeViewer = (function () {
    function MazeViewer(maze) {
        this.maze = maze;
        this.container = document.getElementById('mazeDisplay');
        this.mazeDisplayed = false;
    }
    return MazeViewer;
})();
/// <reference path="../maze/cell.ts" />
/// <reference path="mazeRobot.ts" />
// Robot 'brain' to be composed with a robot to decide how to solve the maze. This is the abstract
// class. The specific subclasses will attempt to solve a maze in differing ways. 
// Note that the chooseDirection method is the main engine method which delegates as appropriate
// to the other direction choosing methods based on what openings are available in the cell in question
// Default implementations are provided for dead ends, straights and turns, but subclasses must make a 
// decision on how to handle junctions.
var RobotAlgorithm = (function () {
    function RobotAlgorithm(robot) {
        this.robot = robot;
    }
    RobotAlgorithm.prototype.chooseDirection = function (cell) {
        var direction;
        var newOpenings = this.robot.getNewOpenings(cell);
        if (newOpenings.length == 0) {
            direction = this.chooseDirectionAtDeadEnd();
        }
        else if (newOpenings.length == 1) {
            direction = this.chooseDirectionAtStraightOrTurn(newOpenings);
        }
        else {
            direction = this.chooseDirectionAtJunction(newOpenings);
        }
        return direction;
    };
    RobotAlgorithm.prototype.chooseDirectionAtDeadEnd = function () {
        return this.robot.getNewDirection(this.robot.facing, 180);
    };
    RobotAlgorithm.prototype.chooseDirectionAtStraightOrTurn = function (openings) {
        return openings[0];
    };
    return RobotAlgorithm;
})();
/// <reference path="../maze/cell.ts" />
/// <reference path="robotAlgorithm" />
/// <reference path="mazeRobot" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// here we're just using the 'random mouse' algorithm 
// (https://en.wikipedia.org/wiki/Maze_solving_algorithm#Random_mouse_algorithm)
var RandomMouseRobotAlgorithm = (function (_super) {
    __extends(RandomMouseRobotAlgorithm, _super);
    function RandomMouseRobotAlgorithm(robot) {
        _super.call(this, robot);
    }
    // simply choose a random direction at each junction (ignoring the way we've come from)
    RandomMouseRobotAlgorithm.prototype.chooseDirectionAtJunction = function (openings) {
        var randomDirection = openings[Math.floor(Math.random() * openings.length)];
        return randomDirection;
    };
    return RandomMouseRobotAlgorithm;
})(RobotAlgorithm);
/// <reference path="../maze/firstPersonMaze.ts" />
/// <reference path="../viewers/mazeViewer.ts" />
/// <reference path="robotAlgorithm.ts" />
/// <reference path="randomMouseRobotAlgorithm.ts" />
/// <reference path="../maze/cell.ts" />
// A Robot to solve mazes. It is composed with a RobotAlgorithm - the type of which determines how it will
// go about solving the maze
var Robot = (function () {
    function Robot(maze, mazeViewer, robotDelay) {
        this.facing = 'south';
        this.nSteps = 0;
        this.stop = false;
        this.maze = maze;
        this.mazeViewer = mazeViewer;
        // use random mouse as the default algorithm
        this.robotAlgorithm = new RandomMouseRobotAlgorithm(this);
        this.updateDelay = robotDelay;
    }
    // TODO user proper 'set' setter?
    Robot.prototype.setRobotAlgorithm = function (algorithm) {
        this.robotAlgorithm = algorithm;
    };
    Robot.prototype.trySolvingMaze = function () {
        if (!this.mazeViewer.mazeDisplayed) {
            this.mazeViewer.displayMaze();
        }
        var stepsDiv = document.createElement('div');
        stepsDiv.id = "stepsDiv";
        stepsDiv.innerHTML = "Number of robot moves: <span id='stepsSpan'>0</span>";
        document.getElementById('mazeDisplay').appendChild(stepsDiv);
        this._createRobotLoopTimeout(this._robotLoop, this);
    };
    // calling this tells a robot to quit. Note that it won't stop immediately, but will finish the current 
    // iteration around the '_robotLoop' function. Therefore it is only safe to assume that the robot has 
    // finally finished after a delay equal to its 'robotDelay' in milliseconds
    Robot.prototype.quit = function () {
        this.stop = true;
    };
    Robot.prototype._createRobotLoopTimeout = function (robotLoopFn, thisContext) {
        setTimeout(function () {
            robotLoopFn.call(thisContext);
        }, this.updateDelay);
    };
    // the main loop that the robot iterates through to solve the maze. Get current cell, decide which way
    // to turn next, move in that direction, update the display and check if we've finished or need to quit, or
    // should carry on
    Robot.prototype._robotLoop = function () {
        var cell = this.maze.getCurrentCell();
        // robot logic to decide which direction to face next 
        this.facing = this.robotAlgorithm.chooseDirection(cell);
        // move in chosen direction
        this.maze.move(this.facing);
        // update display
        this.mazeViewer.updateRobotDisplay(cell);
        //check if we're at the exit, or if we need to stop, or if we carry on
        if (cell.isExit) {
            console.log("Arrived at exit in ", this.nSteps, " steps!");
            return;
        }
        else if (this.stop) {
            console.log("Robot told to stop. It travelled ", this.nSteps, " steps.");
            return;
        }
        else {
            this.nSteps++;
            document.getElementById("stepsSpan").innerHTML = this.nSteps + '';
            this._createRobotLoopTimeout(this._robotLoop, this);
        }
    };
    // For a given cell get all directions which lead to another cell _ignoring the direction we've come from_
    // i.e. ignore the opening that is 180 degrees from our facing direction as we've just come from there!
    Robot.prototype.getNewOpenings = function (cell) {
        var allOpenings = cell.openings;
        //console.log("robot is in a cell with openings: ", allOpenings);
        var newOpenings = [];
        for (var opening in allOpenings) {
            if (allOpenings[opening] && opening != this.getNewDirection(this.facing, 180)) {
                newOpenings.push(opening);
            }
        }
        //console.log("robot is in a cell with non-turn-around openings: ", newOpenings);
        return newOpenings;
    };
    // Look in the maze in a given direction. Gets back an array of cells that are visible in that direction.
    Robot.prototype.lookToDirection = function (direction) {
        return this.maze.look(direction);
    };
    // Based on an initial direcion and a turn (in degrees), return the new direction.
    Robot.prototype.getNewDirection = function (currentDirection, turn) {
        var directions = ['north', 'east', 'south', 'west'];
        var indexChange = turn / 90;
        var currentDirectionIndex = 0;
        for (var currentDirectionIndex = 0; currentDirectionIndex < directions.length; currentDirectionIndex++) {
            if (directions[currentDirectionIndex] == currentDirection) {
                break;
            }
        }
        var newDirectionIndex = (currentDirectionIndex + indexChange) % directions.length;
        return directions[newDirectionIndex];
    };
    return Robot;
})();
/// <reference path="../maze/cell.ts" />
/// <reference path="robotAlgorithm" />
/// <reference path="mazeRobot" />
// here we're using the 'wall follower' algorithm
// (https://en.wikipedia.org/wiki/Maze_solving_algorithm#Wall_follower)
var WallFollowerRobotAlgorithm = (function (_super) {
    __extends(WallFollowerRobotAlgorithm, _super);
    function WallFollowerRobotAlgorithm(robot) {
        _super.call(this, robot);
    }
    // The wall follower chooses the right-most opening that is available 
    // (choice of right-most instead of left-most was arbitrary)
    WallFollowerRobotAlgorithm.prototype.chooseDirectionAtJunction = function (openings) {
        var newDirection = this.robot.getNewDirection(this.robot.facing, 90);
        while (openings.indexOf(newDirection) == -1) {
            newDirection = this.robot.getNewDirection(newDirection, -90);
        }
        return newDirection;
    };
    return WallFollowerRobotAlgorithm;
})(RobotAlgorithm);
/// <reference path="../maze/cell.ts" />
/// <reference path="robotAlgorithm" />
/// <reference path="mazeRobot" />
// here we're using the 'recursive backtracker' algorithm:
// Draw a line behind us at all times unless backtracking. At a junction pick a random direction 
// that hasn't been explored yet (ignoring the direction we've come from). When we come to a dead
// end then turn around and start backtracking, erasing the line. Finish backtracking when we come
// to a junction which has openings that haven't yet been explored - i.e. go in one of these directions
// and resume drawing the line. When we get to the finish there will be a single solution marked out 
// by the line that we've drawn. This method will always find a solution if one exists, but it 
// won't necessarily be the shortest solution if they are multiple.
var RecursiveBacktrackingRobotAlgorithm = (function (_super) {
    __extends(RecursiveBacktrackingRobotAlgorithm, _super);
    function RecursiveBacktrackingRobotAlgorithm(robot) {
        _super.call(this, robot);
        this.currentCell = null;
        this.backtracking = false;
    }
    RecursiveBacktrackingRobotAlgorithm.prototype.chooseDirection = function (cell) {
        this.currentCell = cell;
        this.currentCell.robotVisited = true;
        // call super to get direction
        var direction = _super.prototype.chooseDirection.call(this, cell);
        // Before returning direction we need to update line drawing in order to help determine 
        // which direction to go in the future
        if (this.backtracking) {
            // we're backtracking. remove line
            this.currentCell.lineDrawn = false;
        }
        else {
            // we're going forwards. Draw line
            this.currentCell.lineDrawn = true;
        }
        return direction;
    };
    RecursiveBacktrackingRobotAlgorithm.prototype.chooseDirectionAtDeadEnd = function () {
        // update backtracking
        this.backtracking = true;
        // use call to super to return direction
        return _super.prototype.chooseDirectionAtDeadEnd.call(this);
    };
    RecursiveBacktrackingRobotAlgorithm.prototype.chooseDirectionAtStraightOrTurn = function (openings) {
        // update backtracking
        if (this.currentCell.isEntry && this.backtracking) {
            this.backtracking = false;
        }
        // use call to super to return direction
        return _super.prototype.chooseDirectionAtStraightOrTurn.call(this, openings);
    };
    RecursiveBacktrackingRobotAlgorithm.prototype.chooseDirectionAtJunction = function (openings) {
        // pick random direction that is open and we haven't already visited
        var direction;
        var nonVisitedOpenings = [];
        var lineOpening;
        for (var i = 0; i < openings.length; i++) {
            var cellThroughThatOpening = this.robot.lookToDirection(openings[i])[0];
            if (!cellThroughThatOpening.robotVisited) {
                nonVisitedOpenings.push(openings[i]);
            }
            if (cellThroughThatOpening.lineDrawn) {
                lineOpening = openings[i];
            }
        }
        if (nonVisitedOpenings.length == 0) {
            // we've been down all routes. We're backtracking and need to follow the route with the line
            direction = lineOpening;
        }
        else {
            // we've got at least one route that hasn't yet been explored. Pick one at random
            var randomDirection = nonVisitedOpenings[Math.floor(Math.random() * nonVisitedOpenings.length)];
            direction = randomDirection;
            if (this.backtracking) {
                this.backtracking = false;
            }
        }
        return direction;
    };
    return RecursiveBacktrackingRobotAlgorithm;
})(RobotAlgorithm);
/// <reference path="maze/cell.ts" />
// Using a module allows us to create something like a static class
var MazeUtilities;
(function (MazeUtilities) {
    function createImage(source, size) {
        var img = document.createElement('img');
        img.src = source;
        img.style.width = size + 'px';
        img.style.height = size + 'px';
        img.style.position = 'absolute';
        return img;
    }
    MazeUtilities.createImage = createImage;
    // Encode a cell based on which direction(s) it has openings to neighbouring cells 
    function cellToTile(cell) {
        var sum = 0;
        if (cell.openings.north) {
            sum += 8;
        }
        if (cell.openings.east) {
            sum += 4;
        }
        if (cell.openings.south) {
            sum += 2;
        }
        if (cell.openings.west) {
            sum += 1;
        }
        return sum.toString(16);
    }
    MazeUtilities.cellToTile = cellToTile;
})(MazeUtilities || (MazeUtilities = {}));
/// <reference path="mazeViewer.ts" />
/// <reference path="../mazeUtilities.ts" />
/// <reference path="../maze/cell.ts" />
// Displayes the maze in an HTML table with the table cell borders represnting walls in the maze
var BorderMazeViewer = (function (_super) {
    __extends(BorderMazeViewer, _super);
    function BorderMazeViewer(maze, displayCodes) {
        _super.call(this, maze);
        this.noBorder = '1px dotted #CCC';
        this.border = '1px solid black';
        this.displayCodes = displayCodes;
        this.tableWidth = this.maze.x * 8;
    }
    BorderMazeViewer.prototype.displayMaze = function () {
        var table = document.createElement('table');
        table.style.width = this.tableWidth + 'px';
        table.cellSpacing = '0';
        var row;
        var cell;
        for (var j = 0; j < this.maze.y; j++) {
            row = table.insertRow();
            for (var i = 0; i < this.maze.x; i++) {
                cell = row.insertCell();
                cell.style.border = this.border;
                cell.style.padding = '0';
                cell.style.fontSize = '4pt';
                var mazeCell = this.maze.cells[i][j];
                cell.id = mazeCell.id;
                cell.innerHTML = this.displayCodes ? MazeUtilities.cellToTile(mazeCell) : '&nbsp;';
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
        // set up the current display cell ready for if/when we need to display the maze being solved
        var entryCellId = this.maze.cells[0][0].id;
        this.currentDisplayCell = document.getElementById(entryCellId);
    };
    BorderMazeViewer.prototype.updateRobotDisplay = function (cell) {
        this.currentDisplayCell = document.getElementById(cell.id);
        if (this.prevDisplayCell) {
            if (this.prevDisplayCell.line) {
                this.prevDisplayCell.style.backgroundColor = 'orange';
            }
            else {
                this.prevDisplayCell.style.backgroundColor = 'yellow';
            }
        }
        if (cell.lineDrawn) {
            this.currentDisplayCell.line = true;
        }
        else {
            this.currentDisplayCell.line = false;
        }
        this.currentDisplayCell.style.backgroundColor = 'red';
        this.prevDisplayCell = this.currentDisplayCell;
    };
    BorderMazeViewer.prototype.resetMazeView = function () {
        var displayCell;
        for (var j = 0; j < this.maze.y; j++) {
            for (var i = 0; i < this.maze.x; i++) {
                displayCell = document.getElementById(i + "," + j);
                displayCell.style.backgroundColor = 'white';
                displayCell.line = false;
            }
        }
        // set up the current display cell ready for if/when we need to display the maze being solved
        var entryCellId = this.maze.cells[0][0].id;
        this.currentDisplayCell = document.getElementById(entryCellId);
        this.prevDisplayCell = null;
        this.mazeDisplayed = false;
    };
    BorderMazeViewer.prototype.supportsRobots = function () {
        return true;
    };
    return BorderMazeViewer;
})(MazeViewer);
/// <reference path="maze/maze.ts" />
/// <reference path="maze/firstPersonMaze.ts" />
/// <reference path="robot/mazeRobot.ts" />
/// <reference path="robot/robotAlgorithm.ts" />
/// <reference path="robot/randomMouseRobotAlgorithm.ts" />
/// <reference path="robot/wallFollowerRobotAlgorithm.ts" />
/// <reference path="robot/recursiveBacktrackingRobotAlgorithm.ts" />
/// <reference path="viewers/mazeViewer.ts" />
/// <reference path="viewers/borderMazeViewer.ts" />
var robot;
var maze;
var userChoices;
var mazeViewer;
// Entry point for maze generation
function generateMaze() {
    init(generate);
}
// Entry point for solving maze
function solveMaze() {
    init(solve);
}
function init(fn) {
    if (robot) {
        robot.quit();
        console.log("Pre-existing robot has been told to quit. Waiting for a timeout equal to the robot's update interval before proceeding.");
        setTimeout(function () {
            fn.call(this);
        }, robot.updateDelay);
    }
    else {
        fn.call(this);
    }
}
function generate() {
    console.log("Starting maze generation.");
    // clear away any pre-existing maze
    document.getElementById("mazeDisplay").innerHTML = "";
    userChoices = getUserOptionChoices();
    maze = new Maze(userChoices.mazeWidth, userChoices.mazeHeight);
    mazeViewer = getMazeViewer(userChoices.mazeDisplay, maze);
    mazeViewer.displayMaze();
    console.log("Maze generation complete.");
    if (mazeViewer.supportsRobots()) {
        document.getElementById('robotOptionsDiv').style.display = 'block';
    }
    else {
        document.getElementById('robotOptionsDiv').style.display = 'none';
    }
}
function solve() {
    console.log("Starting maze solve function. Checking if a maze exists...");
    if (!maze) {
        // This shouldn't happen in the current design of HTML page as the solve maze button
        // only appears after a maze has been generated.
        console.log("Error: No maze exists to solve. Quitting.");
        return;
    }
    userChoices = getUserOptionChoices();
    // reset existing maze before trying to solve (it may already be mid-solve from previous robot)
    mazeViewer.resetMazeView();
    maze.reset();
    document.getElementById("mazeDisplay").innerHTML = "";
    var mazeForRobot = new FirstPersonMaze(maze);
    robot = new Robot(mazeForRobot, mazeViewer, userChoices.robotDelay);
    var robotAlgorithm = getRobotAlgorithm(userChoices.robotAlgorithm, robot);
    robot.setRobotAlgorithm(robotAlgorithm);
    robot.trySolvingMaze();
}
function getUserOptionChoices() {
    var mazeWidthSelect = document.getElementById("mazeWidthInput");
    var mazeHeightSelect = document.getElementById("mazeHeightInput");
    var robotDelaySelect = document.getElementById("robotDelayInput");
    var robotAlgorithmSelect = document.getElementById("robotAlgorithmSelect");
    var mazeDisplaySelect = document.getElementById("mazeDisplaySelect");
    var options = {
        mazeWidth: mazeWidthSelect.value,
        mazeHeight: mazeHeightSelect.value,
        robotDelay: robotDelaySelect.value,
        robotAlgorithm: robotAlgorithmSelect.options[robotAlgorithmSelect.selectedIndex].value,
        mazeDisplay: mazeDisplaySelect.options[mazeDisplaySelect.selectedIndex].value
    };
    return options;
}
function getMazeViewer(viewerType, maze) {
    if (viewerType == "borders") {
        return new BorderMazeViewer(maze);
    }
    else if (viewerType == "images") {
        return new ImageMazeViewer(maze);
    }
    else if (viewerType == "compositeImages") {
        return new CompositeImageMazeViewer(maze);
    }
    else if (viewerType == "codes") {
        return new CodesMazeViewer(maze);
    }
}
function getRobotAlgorithm(algorithmType, robot) {
    if (algorithmType == "randomMouse") {
        return new RandomMouseRobotAlgorithm(robot);
    }
    else if (algorithmType == "wallFollower") {
        return new WallFollowerRobotAlgorithm(robot);
    }
    else if (algorithmType == "recursiveBacktracking") {
        return new RecursiveBacktrackingRobotAlgorithm(robot);
    }
}
/// <reference path="mazeViewer.ts" />
/// <reference path="../maze/cell.ts" />
/// <reference path="../mazeUtilities.ts" />
// An unusual maze viewer which doesn't produce a pictorial view of the maze, but simply encodes each cell 
// in sequence (as reading a book from NW corner to SE corner) as a hexadecimal character based on the openings
// that each cell has to its neighbours. This gets displayed in a text area. Could be used for easy 'saving'
// of maze configurations.
var CodesMazeViewer = (function (_super) {
    __extends(CodesMazeViewer, _super);
    function CodesMazeViewer(maze) {
        _super.call(this, maze);
        this.textArea = null;
        this.textArea = document.createElement("textarea");
    }
    CodesMazeViewer.prototype.displayMaze = function () {
        var outString = '';
        var mazeCell;
        var tileCode;
        for (var j = 0; j < this.maze.y; j++) {
            for (var i = 0; i < this.maze.x; i++) {
                mazeCell = this.maze.cells[i][j];
                tileCode = MazeUtilities.cellToTile(mazeCell);
                outString += tileCode;
            }
        }
        this.textArea.id = "codesTextArea";
        this.textArea.cols = 150;
        this.textArea.rows = 40;
        this.textArea.value = outString;
        this.container.appendChild(this.textArea);
        this.mazeDisplayed = true;
    };
    CodesMazeViewer.prototype.resetMazeView = function () {
        var textArea = document.getElementById('codesTextArea');
        textArea.value = '';
        this.mazeDisplayed = false;
    };
    CodesMazeViewer.prototype.updateRobotDisplay = function (cell) {
        console.log("updateRobotDisplay function is not applicable for codesMazeViewer");
    };
    CodesMazeViewer.prototype.supportsRobots = function () {
        return false;
    };
    return CodesMazeViewer;
})(MazeViewer);
/// <reference path="mazeViewer.ts" />
/// <reference path="../MazeUtilities.ts" />
// Uses a HTML table with images added to cells (in this regard similar to imageMazeViewer). The difference
// is that this class uses only a total of 5 images which are all superimposed on the same cell to display
// that cell's configuration. The 5 images are a central square, and then four passages leading in the 
// four direcions - N, S, E & W. In addition there is a sixth image representing a robot solving the maze.
var CompositeImageMazeViewer = (function (_super) {
    __extends(CompositeImageMazeViewer, _super);
    function CompositeImageMazeViewer(maze) {
        _super.call(this, maze);
        this.cellSize = 10; //200 / this.maze.x;
        this.robotIcon = MazeUtilities.createImage('images/robot.png', this.cellSize);
    }
    CompositeImageMazeViewer.prototype.displayMaze = function () {
        var table = document.createElement('table');
        table.cellSpacing = "0";
        var row;
        var cell;
        for (var j = 0; j < this.maze.y; j++) {
            row = table.insertRow();
            for (var i = 0; i < this.maze.x; i++) {
                cell = row.insertCell();
                cell.style.position = 'relative';
                cell.style.minWidth = this.cellSize + 'px';
                cell.style.height = this.cellSize + 'px';
                cell.style.border = '0px solid black';
                cell.style.padding = '0';
                cell.id = i + "," + j;
                cell.appendChild(MazeUtilities.createImage('images/centre.png', this.cellSize));
                // loop through openings and create image for each direction present 
                var openings = this.maze.cells[i][j].openings;
                for (var opening in openings) {
                    if (openings[opening]) {
                        cell.appendChild(MazeUtilities.createImage('images/' + opening + '.png', this.cellSize));
                    }
                }
            }
        }
        this.container.appendChild(table);
        this.mazeDisplayed = true;
    };
    CompositeImageMazeViewer.prototype.resetMazeView = function () {
        // set up the current display cell ready for if/when we need to display the maze being solved
        var entryCellId = this.maze.cells[0][0].id;
        this.currentDisplayCell = document.getElementById(entryCellId);
        this.prevDisplayCell = null;
        this.mazeDisplayed = false;
    };
    CompositeImageMazeViewer.prototype.updateRobotDisplay = function (cell) {
        this.currentDisplayCell = document.getElementById(cell.id);
        if (this.prevDisplayCell && this.robotIcon.parentNode == this.prevDisplayCell) {
            this.prevDisplayCell.removeChild(this.robotIcon);
        }
        this.currentDisplayCell.appendChild(this.robotIcon);
        this.prevDisplayCell = this.currentDisplayCell;
    };
    CompositeImageMazeViewer.prototype.supportsRobots = function () {
        return true;
    };
    return CompositeImageMazeViewer;
})(MazeViewer);
/// <reference path="../MazeUtilities.ts" />
/// <reference path="mazeViewer.ts" />
/// <reference path="../maze/cell.ts" />
// uses a set of images of maze cells that are named by a hexadecimal character (see codesMazeView.ts). These
// images are added to cells of an HTML table to produce a view of the maze
var ImageMazeViewer = (function (_super) {
    __extends(ImageMazeViewer, _super);
    function ImageMazeViewer(maze) {
        _super.call(this, maze);
        this.imageSize = 16; //400 / maze.x;
        this.robotIcon = MazeUtilities.createImage('images/robot_test.png', this.imageSize);
    }
    ImageMazeViewer.prototype.displayMaze = function () {
        var table = document.createElement('table');
        table.cellSpacing = '0';
        var row;
        var cell;
        var tileCode;
        for (var j = 0; j < this.maze.y; j++) {
            row = table.insertRow();
            for (var i = 0; i < this.maze.x; i++) {
                cell = row.insertCell();
                cell.style.position = 'relative';
                cell.style.minWidth = this.imageSize + 'px';
                cell.style.height = this.imageSize + 'px';
                cell.style.border = '0px solid black';
                cell.style.padding = '0';
                cell.id = i + "," + j;
                tileCode = MazeUtilities.cellToTile(this.maze.cells[i][j]);
                cell.appendChild(MazeUtilities.createImage('images/' + tileCode + '.png', this.imageSize));
            }
        }
        this.container.appendChild(table);
        this.mazeDisplayed = true;
    };
    ImageMazeViewer.prototype.resetMazeView = function () {
        // set up the current display cell ready for if/when we need to display the maze being solved
        var entryCellId = this.maze.cells[0][0].id;
        this.currentDisplayCell = document.getElementById(entryCellId);
        this.prevDisplayCell = null;
        this.mazeDisplayed = false;
    };
    ImageMazeViewer.prototype.supportsRobots = function () {
        return true;
    };
    ImageMazeViewer.prototype.updateRobotDisplay = function (cell) {
        this.currentDisplayCell = document.getElementById(cell.id);
        if (this.prevDisplayCell && this.robotIcon.parentNode == this.prevDisplayCell) {
            this.prevDisplayCell.removeChild(this.robotIcon);
        }
        this.currentDisplayCell.appendChild(this.robotIcon);
        this.prevDisplayCell = this.currentDisplayCell;
    };
    return ImageMazeViewer;
})(MazeViewer);
