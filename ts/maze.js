/*
interface cell {
    visited: boolean;
    isExit: boolean;
    isEntry: boolean;
    openings: cellOpenings;
    id: string;
}
*/
var cell = (function () {
    function cell(i, j) {
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
    return cell;
})();
/// <reference path="cell.ts" />
var Maze = (function () {
    function Maze(x, y) {
        this.cells = [];
        this.x = x;
        this.y = y;
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
                var cell = new cell(i, j);
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
        //this.cells[0][0].openings.north = true;
        this.cells[0][0].isEntry = true;
        this.cells[this.x - 1][this.y - 1].isExit = true;
        //this.cells[this.x - 1][this.y - 1].openings.east = true;
    };
    return Maze;
})();
/// <reference path="../maze/maze.ts" />
var FirstPersonMaze = (function () {
    function FirstPersonMaze(thirdPersonMaze) {
        this._currentCoordinates = { x: 0, y: 0 };
        this._currentCell = this._cells[this._currentCoordinates.x][this._currentCoordinates.y];
        this._cells = thirdPersonMaze.cells;
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
var MazeViewer = (function () {
    function MazeViewer(maze) {
        this.maze = maze;
    }
    return MazeViewer;
})();
/// <reference path="../maze/cell.ts" />
/// <reference path="mazeRobot.ts" />
var RobotAlgorithm = (function () {
    function RobotAlgorithm(robot) {
        this.robot = robot;
    }
    RobotAlgorithm.prototype.chooseDirectionAtDeadEnd = function () {
        return this.robot.getNewDirection(this.robot.facing, 180);
    };
    RobotAlgorithm.prototype.chooseDirectionAtStraightOrTurn = function (openings) {
        return openings[0];
    };
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
    RandomMouseRobotAlgorithm.prototype.chooseDirectionAtJunction = function (openings) {
        var randomDirection = openings[Math.floor(Math.random() * openings.length)];
        return randomDirection;
    };
    return RandomMouseRobotAlgorithm;
})(RobotAlgorithm);
/// <reference path="../maze/firstPersonMaze.ts" />
/// <reference path="../viewers/mazeViewer.ts" />
/// <reference path="robotAlgorithm.ts" />
/// <reference path='randomMouseRobotAlgorithm.ts' />
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
    Robot.prototype.quit = function () {
        this.stop = true;
    };
    Robot.prototype._createRobotLoopTimeout = function (robotLoopFn, thisContext) {
        setTimeout(function () {
            robotLoopFn.call(thisContext);
        }, this.updateDelay);
    };
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
    Robot.prototype.getNewOpenings = function (cell) {
        var allOpenings = cell.openings;
        console.log("robot is in a cell with openings: ", allOpenings);
        var newOpenings = [];
        for (var opening in allOpenings) {
            if (allOpenings[opening] && opening != this.getNewDirection(this.facing, 180)) {
                newOpenings.push(opening);
            }
        }
        console.log("robot is in a cell with non-turn-around openings: ", newOpenings);
        return newOpenings;
    };
    Robot.prototype.lookToDirection = function (direction) {
        return this.maze.look(direction);
    };
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
// here we're using the 'recursive backtracker' algorithm
// ([add reference here)
/*

class RecursiveBacktrackingRobotAlgorithm extends RobotAlgorithm {

    currentCell: cell = null;
    backtracking: boolean = false;

    constructor(robot: Robot) {
        super(robot);
    }

    chooseDirectionAtDeadEnd() {
        // update backtracking
        this.backtracking = true;
    
        // use call to super to return direction
        return super.chooseDirectionAtDeadEnd();
    }

    chooseDirectionAtStraightOrTurn(openings) {
        // update backtracking
        if (this.currentCell.isEntry && this.backtracking) {
            this.backtracking = false;
        }
    
        // use call to super to return direction
        return super.chooseDirectionAtStraightOrTurn(openings);
    }

    chooseDirectionAtJunction(openings) {
        // pick random direction that is open and we haven't already visited
        var direction;
        var nonVisitedOpenings = [];
        var lineOpening
        for (var i = 0; i < openings.length; i++) {
            var cellThroughThatOpening = robot.lookToDirection(openings[i])[0];
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
        } else {
            // we've got at least one route that hasn't yet been explored. Pick one at random
            var randomDirection = nonVisitedOpenings[Math.floor(Math.random() * nonVisitedOpenings.length)];
            direction = randomDirection;
            if (this.backtracking) {
                this.backtracking = false;
            }
        }

        return direction;
    }

    chooseDirection(cell: cell) {
        this.currentCell = cell;
        this.currentCell.robotVisited = true;
    
        // call super to get direction
        var direction = super.chooseDirection(cell);
    
        // Before returning direction we need to update line drawing in order to help determine
        // which direction to go in the future
        if (this.backtracking) {
            // we're backtracking. remove line
            this.currentCell.lineDrawn = false;
        } else {
            // we're going forwards. Draw line
            this.currentCell.lineDrawn = true;
        }

        return direction;
    }
}

*/
function createImage(source, size) {
    var img = document.createElement('img');
    img.src = source;
    img.style.width = size + 'px';
    img.style.height = size + 'px';
    img.style.position = 'absolute';
    return img;
}
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
function tileToCell(tile) {
    var directions = { north: false, east: false, south: false, west: false };
    var power;
    while (tile > 0) {
        power = getLargestPowerOfTwo(tile);
        if (power == 8) {
            directions.north = true;
        }
        else if (power == 4) {
            directions.east = true;
        }
        else if (power == 2) {
            directions.south = true;
        }
        else if (power == 1) {
            directions.west = true;
        }
        tile -= power;
    }
    return directions;
}
function getLargestPowerOfTwo(number) {
    var result = 1;
    while (result < number) {
        result *= 2;
    }
    return result / 2;
}
/// <reference path="mazeViewer.ts" />
/// <reference path="../mazeUtilities.ts" />
/// <reference path="../maze/cell.ts" />
// Define the BorderMazeViewer constructor
var BorderMazeViewer = (function (_super) {
    __extends(BorderMazeViewer, _super);
    function BorderMazeViewer(maze, displayCodes) {
        _super.call(this, maze);
        this.noBorder = '1px dotted #CCC';
        this.border = '1px solid black';
        this.displayCodes = displayCodes;
        this.mazeDisplayed = false;
        this.tableWidth = this.maze.x * 8;
    }
    BorderMazeViewer.prototype.displayMaze = function () {
        var container = document.getElementById('mazeDisplay');
        var table = document.createElement('table');
        table.style.width = this.tableWidth + 'px';
        table.cellSpacing = '0';
        var row; // this should probably be HTMLTableRowElement but waiting for TS v1.8 for this change.
        var cell; // this should probably be HTMLTableCellElement but waiting for TS v1.8 for this change.
        for (var j = 0; j < this.maze.y; j++) {
            row = table.insertRow();
            for (var i = 0; i < this.maze.x; i++) {
                cell = row.insertCell();
                cell.style.border = this.border;
                cell.style.padding = '0';
                cell.style.fontSize = '4pt';
                var mazeCell = this.maze.cells[i][j];
                cell.id = mazeCell.id;
                cell.innerHTML = this.displayCodes ? cellToTile(mazeCell) : '&nbsp;';
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
function generateMaze() {
    init(proceed);
}
function solveMaze() {
    init(solve);
}
function init(fn) {
    if (robot) {
        robot.quit();
        console.log("told robot to quit, about to call next function after a delay");
        setTimeout(function () {
            fn.call(this);
        }, robot.updateDelay);
    }
    else {
        fn.call(this);
    }
}
function proceed() {
    document.getElementById('robotOptionsDiv').style.display = 'block';
    // clear away any pre-existing maze
    document.getElementById("mazeDisplay").innerHTML = "";
    userChoices = getUserOptionChoices();
    maze = new Maze(userChoices.mazeWidth, userChoices.mazeHeight);
    mazeViewer = getMazeViewer(userChoices.mazeDisplay, maze);
    mazeViewer.displayMaze();
}
function solve() {
    console.log("starting solve function");
    userChoices = getUserOptionChoices();
    mazeViewer.resetMazeView();
    maze.reset();
    document.getElementById("mazeDisplay").innerHTML = "";
    var mazeForRobot = new FirstPersonMaze(maze);
    robot = new Robot(mazeForRobot, mazeViewer, userChoices.robotDelay);
    var robotAlgorithm = getRobotAlgorithm(userChoices.robotAlgorithm, robot);
    robot.setRobotAlgorithm(robotAlgorithm);
    robot.fake();
    robot.trySolvingMaze();
}
function getUserOptionChoices() {
    var robotAlgorithmSelect = document.getElementById("robotAlgorithmSelect");
    var mazeDisplaySelect = document.getElementById("mazeDisplaySelect");
    var options = {
        mazeWidth: document.getElementById("mazeWidthInput").value,
        mazeHeight: document.getElementById("mazeHeightInput").value,
        robotDelay: document.getElementById("robotDelayInput").value,
        robotAlgorithm: robotAlgorithmSelect.options[robotAlgorithmSelect.selectedIndex].value,
        mazeDisplay: mazeDisplaySelect.options[mazeDisplaySelect.selectedIndex].value
    };
    // var mazeWidthInput: HTMLInputElement = document.getElementById("mazeWidthInput");
    // options.mazeWidth = mazeWidthInput.value;
    // var mazeHeightInput = document.getElementById("mazeHeightInput");
    // options.mazeHeight = mazeHeightInput.value;
    // var robotAlgorithmSelect = document.getElementById("robotAlgorithmSelect");
    // options.robotAlgorithm = robotAlgorithmSelect.options[robotAlgorithmSelect.selectedIndex].value;
    // var robotDelayInput = document.getElementById("robotDelayInput");
    // options.robotDelay = robotDelayInput.value;
    // var mazeDisplaySelect = document.getElementById("mazeDisplaySelect");
    // options.mazeDisplay = mazeDisplaySelect.options[mazeDisplaySelect.selectedIndex].value;
    return options;
}
function getMazeViewer(viewerType, maze) {
    if (viewerType == "borders") {
        return new BorderMazeViewer(maze);
    } //else if (viewerType == "images") {
    // 	return new ImageMazeViewer(maze);
    // } else if (viewerType == "compositeImages") {
    // 	return new CompositeImageMazeViewer(maze);
    // } else if (viewerType == "codes") {
    // 	return new CodesMazeViewer(maze);
    // }
}
// TODO Need to change this as currently robot algorithm needs a robot in constructor
function getRobotAlgorithm(algorithmType, robot) {
    if (algorithmType == "randomMouse") {
        return new RandomMouseRobotAlgorithm(robot);
    }
    else if (algorithmType == "wallFollower") {
        return new WallFollowerRobotAlgorithm(robot);
    } //else if (algorithmType == "recursiveBacktracking") {
    // 	return new RecursiveBacktrackingRobotAlgorithm(robot);
    // }
}
