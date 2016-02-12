var Direction;
(function (Direction) {
    Direction[Direction["N"] = 8] = "N";
    Direction[Direction["E"] = 4] = "E";
    Direction[Direction["S"] = 2] = "S";
    Direction[Direction["W"] = 1] = "W";
})(Direction || (Direction = {}));
;
// Using a module allows us to create something like a static class
var DirectionUtils;
(function (DirectionUtils) {
    function dX(dir) {
        switch (dir) {
            case Direction.E: return 1;
            case Direction.W: return -1;
            case Direction.N: return 0;
            case Direction.S: return 0;
        }
    }
    DirectionUtils.dX = dX;
    function dY(dir) {
        switch (dir) {
            case Direction.E: return 0;
            case Direction.W: return 0;
            case Direction.N: return -1;
            case Direction.S: return 1;
        }
    }
    DirectionUtils.dY = dY;
    function opposite(dir) {
        switch (dir) {
            case Direction.E: return Direction.W;
            case Direction.W: return Direction.E;
            case Direction.N: return Direction.S;
            case Direction.S: return Direction.N;
        }
    }
    DirectionUtils.opposite = opposite;
    function getDirection(here, next) {
        if (next.x > here.x) {
            return Direction.E;
        }
        if (next.x < here.x) {
            return Direction.W;
        }
        if (next.y > here.y) {
            return Direction.S;
        }
        if (next.y < here.y) {
            return Direction.N;
        }
    }
    DirectionUtils.getDirection = getDirection;
})(DirectionUtils || (DirectionUtils = {}));
/// <reference path="direction.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// In which direction(s) is there an opening from a maze cell to neighbouring cells
var CellOpenings = (function () {
    function CellOpenings() {
        this.north = false;
        this.east = false;
        this.south = false;
        this.west = false;
    }
    CellOpenings.prototype.getOpenDirections = function () {
        var openDirections = [];
        if (this.north) {
            openDirections.push(Direction.N);
        }
        if (this.east) {
            openDirections.push(Direction.E);
        }
        if (this.south) {
            openDirections.push(Direction.S);
        }
        if (this.west) {
            openDirections.push(Direction.W);
        }
        return openDirections;
    };
    return CellOpenings;
})();
var Cell = (function () {
    function Cell(i, j) {
        this.id = i + "," + j;
        this.isExit = false;
        this.isEntry = false;
        this.openings = new CellOpenings();
    }
    Object.defineProperty(Cell.prototype, "openings", {
        get: function () {
            return this._openings;
        },
        set: function (openings) {
            this._openings = openings;
            this._openingsCode = Cell.openingsToCode(openings);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "openingsCode", {
        get: function () {
            return this._openingsCode;
        },
        set: function (openingsCode) {
            this._openingsCode = openingsCode;
            this._openings = Cell.codeToOpenings(openingsCode);
        },
        enumerable: true,
        configurable: true
    });
    Cell.openingsToCode = function (openings) {
        var code = 0;
        if (openings.north) {
            code += 8;
        }
        if (openings.east) {
            code += 4;
        }
        if (openings.south) {
            code += 2;
        }
        if (openings.west) {
            code += 1;
        }
        return code;
    };
    Cell.codeToOpenings = function (openingsCode) {
        var openings = new CellOpenings();
        var power;
        while (openingsCode > 0) {
            power = MazeUtils.getLargestPowerOfTwo(openingsCode);
            if (power == 8) {
                openings.north = true;
            }
            else if (power == 4) {
                openings.east = true;
            }
            else if (power == 2) {
                openings.south = true;
            }
            else if (power == 1) {
                openings.west = true;
            }
            openingsCode -= power;
        }
        return openings;
    };
    return Cell;
})();
var MazeGeneratingCell = (function (_super) {
    __extends(MazeGeneratingCell, _super);
    function MazeGeneratingCell(i, j) {
        _super.call(this, i, j);
    }
    return MazeGeneratingCell;
})(Cell);
var MazeSolvingCell = (function (_super) {
    __extends(MazeSolvingCell, _super);
    function MazeSolvingCell(i, j) {
        _super.call(this, i, j);
    }
    return MazeSolvingCell;
})(Cell);
var PrimsCell = (function (_super) {
    __extends(PrimsCell, _super);
    function PrimsCell(i, j) {
        _super.call(this, i, j);
        this.frontier = false;
        this.visited = false;
    }
    return PrimsCell;
})(MazeGeneratingCell);
var RecursiveBacktrackingCell = (function (_super) {
    __extends(RecursiveBacktrackingCell, _super);
    function RecursiveBacktrackingCell(i, j) {
        _super.call(this, i, j);
        this.lineDrawn = false;
        this.robotVisited = false;
    }
    return RecursiveBacktrackingCell;
})(MazeSolvingCell);
var MazeSolvingCellFactory = (function () {
    function MazeSolvingCellFactory() {
    }
    return MazeSolvingCellFactory;
})();
var RecursiveBacktrackingCellFactory = (function (_super) {
    __extends(RecursiveBacktrackingCellFactory, _super);
    function RecursiveBacktrackingCellFactory() {
        _super.call(this);
    }
    RecursiveBacktrackingCellFactory.prototype.createCell = function (i, j) {
        return new RecursiveBacktrackingCell(i, j);
    };
    return RecursiveBacktrackingCellFactory;
})(MazeSolvingCellFactory);
var DefaultMazeSolvingCellFactory = (function (_super) {
    __extends(DefaultMazeSolvingCellFactory, _super);
    function DefaultMazeSolvingCellFactory() {
        _super.call(this);
    }
    DefaultMazeSolvingCellFactory.prototype.createCell = function (i, j) {
        return new MazeSolvingCell(i, j);
    };
    return DefaultMazeSolvingCellFactory;
})(MazeSolvingCellFactory);
/// <reference path="cell.ts" />
var MazeGenerationAlgorithm = (function () {
    function MazeGenerationAlgorithm() {
    }
    MazeGenerationAlgorithm.prototype.generateMaze = function (width, height) {
        var emptyMatrix = this.getEmptyMazeMatrix(width, height);
        return this.generateMazeInMatrix(emptyMatrix);
    };
    MazeGenerationAlgorithm.prototype.getEmptyMazeMatrix = function (width, height) {
        var cells = [];
        // populate cells array
        for (var i = 0; i < width; i++) {
            cells[i] = [];
            for (var j = 0; j < height; j++) {
                var cell = this.createCell(i, j);
                cells[i].push(cell);
            }
        }
        // make entrance and exit. Set current cell to entrance, set isExit to true for exit cell
        cells[0][0].isEntry = true;
        cells[width - 1][height - 1].isExit = true;
        return cells;
    };
    // Check if cell coordinates belong to a cell which is unvisited (no wall openings) and 
    // is within the outer bounds of the maze
    MazeGenerationAlgorithm.prototype.cellIsInBoundsAndUnvisited = function (matrix, cellCoords) {
        return cellCoords.x >= 0 && cellCoords.y >= 0 &&
            cellCoords.x < matrix.length && cellCoords.y < matrix[0].length &&
            matrix[cellCoords.x][cellCoords.y].openingsCode == 0;
    };
    return MazeGenerationAlgorithm;
})();
/// <reference path="cell.ts" />
/// <reference path="mazeGenerationAlgorithm.ts" />
var Maze = (function () {
    function Maze(x, y, generationAlgorithm) {
        this.cells = [];
        this.x = x;
        this.y = y;
        this.generationAlgorithm = generationAlgorithm;
        if (this.x * this.y < 1) {
            alert("illegal maze dimensions");
            return;
        }
        else {
            this.createMaze();
        }
    }
    Maze.prototype.createMaze = function () {
        this.cells = this.generationAlgorithm.generateMaze(this.x, this.y);
    };
    return Maze;
})();
/// <reference path="../maze/maze.ts" />
// The reason for a first person maze is so that a robot can be passed a maze to solve, but one which
// it can't simply access a full matrix of maze cells and interrogate for the best solution. Instead
// this FirstPersonMaze class will only allow clients to see where they are now, to look in a direction
// or to move one cell in a given direction.
var FirstPersonMaze = (function () {
    function FirstPersonMaze(thirdPersonMaze, mazeSolvingCellFactory) {
        this._convertCellsToMazeSolvingCells(thirdPersonMaze, mazeSolvingCellFactory);
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
        if (direction == Direction.W && cell.openings.west) {
            newCoordinates.x -= 1;
        }
        else if (direction == Direction.E && cell.openings.east) {
            newCoordinates.x += 1;
        }
        else if (direction == Direction.N && cell.openings.north) {
            newCoordinates.y -= 1;
        }
        else if (direction == Direction.S && cell.openings.south) {
            newCoordinates.y += 1;
        }
        else {
            return null;
        }
        return newCoordinates;
    };
    // convert the third-person maze's cells (which will be cells used in generating the maze) into
    // cells for solving the maze. These will have different properties needed by robots solving the maze
    // - e.g. a property to keep track of a line that the robot may have drawn while navigating the maze
    FirstPersonMaze.prototype._convertCellsToMazeSolvingCells = function (thirdPersonMaze, mazeSolvingCellFactory) {
        this._cells = [];
        for (var i = 0; i < maze.x; i++) {
            this._cells[i] = [];
            for (var j = 0; j < maze.y; j++) {
                var mazeGenerationCell = thirdPersonMaze.cells[i][j];
                var mazeSolvingCell = mazeSolvingCellFactory.createCell(i, j);
                mazeSolvingCell.isEntry = mazeGenerationCell.isEntry;
                mazeSolvingCell.isExit = mazeGenerationCell.isExit;
                mazeSolvingCell.openings = mazeGenerationCell.openings;
                this._cells[i][j] = mazeSolvingCell;
            }
        }
    };
    return FirstPersonMaze;
})();
/// <reference path="cell.ts" />
/// <reference path="mazeGenerationAlgorithm.ts" />
/// <reference path="direction.ts" />
// See (e.g.) http://weblog.jamisbuck.org/2011/1/27/maze-generation-growing-tree-algorithm
var MazeGenerationGrowingTreeAlgorithm = (function (_super) {
    __extends(MazeGenerationGrowingTreeAlgorithm, _super);
    function MazeGenerationGrowingTreeAlgorithm() {
        _super.call(this);
    }
    MazeGenerationGrowingTreeAlgorithm.prototype.createCell = function (i, j) {
        return new MazeGeneratingCell(i, j);
    };
    MazeGenerationGrowingTreeAlgorithm.prototype.generateMazeInMatrix = function (mazeMatrix) {
        var maxX = mazeMatrix.length;
        var maxY = mazeMatrix[0].length;
        // create an empty list of cells and add a random one to it
        var cellList = [];
        var here = { x: Math.floor(Math.random() * maxX), y: Math.floor(Math.random() * maxY) };
        var next;
        cellList.push(here);
        // loop through adding to cells list if there are unvisited neighbours to add, or remove cells if not
        // when cell list is empty we know that the maze contains all the cells
        while (cellList.length > 0) {
            // set the current cell to the most recently added cell in the cell list
            var index = cellList.length - 1;
            here = cellList[cellList.length - 1];
            // Try each direction randomly in turn, and for each direction...
            var directions = MazeUtils.shuffle([Direction.N, Direction.E, Direction.S, Direction.W]);
            for (var _i = 0; _i < directions.length; _i++) {
                var dir = directions[_i];
                // ...set our proposed next cell to be the one that lies immediately in that direction
                next = { x: here.x + DirectionUtils.dX(dir), y: here.y + DirectionUtils.dY(dir) };
                if (this.cellIsInBoundsAndUnvisited(mazeMatrix, next)) {
                    // If that cell had not previously been visited by the algorithm, and is within the maze bounds
                    // then carve a pasageway from our current cell to this new one, and add the new one to the cell list
                    mazeMatrix[here.x][here.y].openingsCode += dir;
                    mazeMatrix[next.x][next.y].openingsCode += DirectionUtils.opposite(dir);
                    cellList.push(next);
                    // We set index to null to indicate that we've found a neighbouring cell, and we don't need
                    // to remove a cell from the list
                    index = null;
                    break;
                }
            }
            // If index is null we know we've not found a suitable neighbouring cell and we must 'backtrack'
            // by removing the most recently added cell before continuing the loop.
            if (index !== null) {
                cellList.pop();
            }
        }
        return mazeMatrix;
    };
    return MazeGenerationGrowingTreeAlgorithm;
})(MazeGenerationAlgorithm);
/// <reference path="cell.ts" />
/// <reference path="mazeGenerationAlgorithm.ts" />
/// <reference path="direction.ts" />
/// <reference path="firstPersonMaze.ts" />
// See (e.g) http://weblog.jamisbuck.org/2011/1/10/maze-generation-prim-s-algorithm
var MazeGenerationPrimsAlgorithm = (function (_super) {
    __extends(MazeGenerationPrimsAlgorithm, _super);
    function MazeGenerationPrimsAlgorithm() {
        _super.call(this);
        this.frontier = []; // list of cells neighbouring those cells already in maze
    }
    MazeGenerationPrimsAlgorithm.prototype.createCell = function (i, j) {
        return new PrimsCell(i, j);
    };
    MazeGenerationPrimsAlgorithm.prototype.generateMazeInMatrix = function (mazeMatrix) {
        var maxX = mazeMatrix.length;
        var maxY = mazeMatrix[0].length;
        // start with adding a random cell to the maze (which adds its neighbours to the 'frontier' list)
        var here = { x: Math.floor(Math.random() * maxX), y: Math.floor(Math.random() * maxY) };
        var neighbourInMaze;
        this.addCellToMaze(here, mazeMatrix);
        // Keep looping until the length of 'frontier' cells is empty
        while (this.frontier.length > 0) {
            // Pick a new cell by randomly removing a frontier cell from the list and assigning it to the current cell
            here = this.frontier.splice(Math.floor(Math.random() * this.frontier.length), 1)[0];
            // get the current cell's neighbours which are already in the maze and pick one at random
            var neighbours = this.getNeighboursAlreadyInMaze(here, mazeMatrix);
            neighbourInMaze = neighbours[Math.floor(Math.random() * neighbours.length)];
            // get the direction from the current cell back to it's neighbour in the maze and then carve a
            // passage between the two, and finally add the current cell to the maze (which updates the list
            // of 'frontier' cells too)
            var dir = DirectionUtils.getDirection(here, neighbourInMaze);
            mazeMatrix[here.x][here.y].openingsCode += dir;
            mazeMatrix[neighbourInMaze.x][neighbourInMaze.y].openingsCode += DirectionUtils.opposite(dir);
            this.addCellToMaze(here, mazeMatrix);
        }
        return mazeMatrix;
    };
    // Mark a cell at the given coordinates as being in the maze. Then add all it's neighbours to the 
    // list of 'frontier' cells
    MazeGenerationPrimsAlgorithm.prototype.addCellToMaze = function (cellCoords, matrix) {
        matrix[cellCoords.x][cellCoords.y].visited = true;
        this.addFrontier({ x: cellCoords.x - 1, y: cellCoords.y }, matrix);
        this.addFrontier({ x: cellCoords.x + 1, y: cellCoords.y }, matrix);
        this.addFrontier({ x: cellCoords.x, y: cellCoords.y - 1 }, matrix);
        this.addFrontier({ x: cellCoords.x, y: cellCoords.y + 1 }, matrix);
    };
    // Get a list of all the neighbours of a given cell which are already in the maze
    MazeGenerationPrimsAlgorithm.prototype.getNeighboursAlreadyInMaze = function (cellCoords, matrix) {
        var neighbours = [];
        var x = cellCoords.x;
        var y = cellCoords.y;
        if (x > 0 && matrix[x - 1][y].visited) {
            neighbours.push({ x: x - 1, y: y });
        }
        if (x + 1 < matrix.length && matrix[x + 1][y].visited) {
            neighbours.push({ x: x + 1, y: y });
        }
        if (y > 0 && matrix[x][y - 1].visited) {
            neighbours.push({ x: x, y: y - 1 });
        }
        if (y + 1 < matrix[0].length && matrix[x][y + 1].visited) {
            neighbours.push({ x: x, y: y + 1 });
        }
        return neighbours;
    };
    // Add a given cell to the list of 'frontier' cells as long as it's not been visited before by the 
    // algorithm (not in the maze), is within the maze bounds, and is not already a 'frontier' cell
    MazeGenerationPrimsAlgorithm.prototype.addFrontier = function (cellCoords, matrix) {
        if (this.cellIsInBoundsAndUnvisited(matrix, cellCoords)) {
            if (matrix[cellCoords.x][cellCoords.y].frontier == false) {
                matrix[cellCoords.x][cellCoords.y].frontier = true;
                this.frontier.push(cellCoords);
            }
        }
    };
    return MazeGenerationPrimsAlgorithm;
})(MazeGenerationAlgorithm);
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
    MazeViewer.prototype.showRobotInMaze = function (robot, maze, robotDelay) {
        // Convert maze to first person maze (so robot only knows about cells it can 'see' from
        // it's current position), and assign this to the robot.
        robot.maze = new FirstPersonMaze(maze, robot.robotAlgorithm.mazeSolvingCellFactory);
        // Create a renderer to show robot navigate maze. Importantly we use the updateRobotDisplay
        // function which is abstract here, and hence left up to the runtime subclass to implement. This
        // is where we tailor the view to the user's choice of maze viewer
        var robotInMazeRenderer = {
            delay: robotDelay,
            render: this.updateRobotDisplay
        };
        // Set the robot's renderer to the one we just created
        robot.renderer = robotInMazeRenderer;
        // If maze isn't already displayed then do so before we let the robot attempt it
        if (!this.mazeDisplayed) {
            this.displayMaze();
        }
        // Create the part of the display to hold the number of steps the robot has taken
        this.createNStepsDisplay();
        // Set the robot going by calling it's recursive loop method for the first time
        robot.callRobotLoopWithDelay(robot.robotLoop);
    };
    MazeViewer.prototype.createNStepsDisplay = function () {
        var stepsDiv = document.createElement('div');
        stepsDiv.id = "stepsDiv";
        stepsDiv.innerHTML = "Number of robot moves: <span id='stepsSpan'>0</span>";
        document.getElementById('mazeDisplay').appendChild(stepsDiv);
    };
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
        this.mazeSolvingCellFactory = new DefaultMazeSolvingCellFactory();
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
    function Robot() {
        this.facing = Direction.S;
        this._renderer = null;
        this._maze = null;
        this._nSteps = 0;
        this._stop = false;
        // use random mouse as the default algorithm
        this._robotAlgorithm = new RandomMouseRobotAlgorithm(this);
    }
    Object.defineProperty(Robot.prototype, "renderer", {
        get: function () {
            return this._renderer;
        },
        set: function (renderer) {
            this._renderer = renderer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Robot.prototype, "robotAlgorithm", {
        get: function () {
            return this._robotAlgorithm;
        },
        set: function (algorithm) {
            this._robotAlgorithm = algorithm;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Robot.prototype, "maze", {
        set: function (maze) {
            this._maze = maze;
        },
        enumerable: true,
        configurable: true
    });
    // calling this tells a robot to quit. Note that it won't stop immediately, but will finish the current 
    // iteration around the '_robotLoop' function. Therefore it is only safe to assume that the robot has 
    // finally finished after a delay equal to its 'robotDelay' in milliseconds
    Robot.prototype.quit = function () {
        this._stop = true;
    };
    Robot.prototype.callRobotLoopWithDelay = function (loopFunction) {
        var thisContext = this;
        setTimeout(function () {
            loopFunction.call(thisContext);
        }, this._renderer.delay);
    };
    // the main loop that the robot iterates through to solve the maze. Get current cell, decide which way
    // to turn next, move in that direction, update the display and check if we've finished or need to quit, or
    // should carry on
    Robot.prototype.robotLoop = function () {
        var cell = this._maze.getCurrentCell();
        // robot logic to decide which direction to face next 
        this.facing = this._robotAlgorithm.chooseDirection(cell);
        // move in chosen direction
        this._maze.move(this.facing);
        // update display
        this._renderer.render(cell);
        //check if we're at the exit, or if we need to stop, or if we carry on
        if (cell.isExit) {
            console.log("Arrived at exit in ", this._nSteps, " steps!");
            return;
        }
        else if (this._stop) {
            console.log("Robot told to stop. It travelled ", this._nSteps, " steps.");
            return;
        }
        else {
            this._nSteps++;
            document.getElementById("stepsSpan").innerHTML = this._nSteps + '';
            this.callRobotLoopWithDelay(this.robotLoop);
        }
    };
    // For a given cell get all directions which lead to another cell _ignoring the direction we've come from_
    // i.e. ignore the opening that is 180 degrees from our facing direction as we've just come from there!
    Robot.prototype.getNewOpenings = function (cell) {
        var openDirections = cell.openings.getOpenDirections();
        //console.log("robot is in a cell with openings: ", allOpenings);
        var newOpenings = [];
        for (var direction in openDirections) {
            if (openDirections[direction] != this.getNewDirection(this.facing, 180)) {
                newOpenings.push(openDirections[direction]);
            }
        }
        //console.log("robot is in a cell with non-turn-around openings: ", newOpenings);
        return newOpenings;
    };
    // Look in the maze in a given direction. Gets back an array of cells that are visible in that direction.
    Robot.prototype.lookToDirection = function (direction) {
        return this._maze.look(direction);
    };
    // Based on an initial direcion and a turn (in degrees), return the new direction.
    Robot.prototype.getNewDirection = function (currentDirection, turn) {
        var directions = [Direction.N, Direction.E, Direction.S, Direction.W];
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
        this.mazeSolvingCellFactory = new RecursiveBacktrackingCellFactory();
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
var MazeUtils;
(function (MazeUtils) {
    function createImage(source, size) {
        var img = document.createElement('img');
        img.src = source;
        img.style.width = size + 'px';
        img.style.height = size + 'px';
        img.style.position = 'absolute';
        return img;
    }
    MazeUtils.createImage = createImage;
    function getLargestPowerOfTwo(number) {
        var result = 1;
        while (result <= number) {
            result *= 2;
        }
        return result / 2;
    }
    MazeUtils.getLargestPowerOfTwo = getLargestPowerOfTwo;
    // The de-facto unbiased shuffle algorithm - the Fisher-Yates (aka Knuth) shuffle. 
    // See http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffle(array) {
        var currentIndex = array.length;
        var randomIndex;
        var temporaryValue;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    MazeUtils.shuffle = shuffle;
})(MazeUtils || (MazeUtils = {}));
/// <reference path="mazeViewer.ts" />
/// <reference path="../mazeUtils.ts" />
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
                cell.innerHTML = this.displayCodes ? mazeCell.openingsCode.toString(16) : '&nbsp;';
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
    };
    BorderMazeViewer.prototype.updateRobotDisplay = function (cell) {
        if (this.prevCell) {
            if (this.prevCell.lineDrawn) {
                document.getElementById(this.prevCell.id).style.backgroundColor = 'orange';
            }
            else {
                document.getElementById(this.prevCell.id).style.backgroundColor = 'yellow';
            }
        }
        document.getElementById(cell.id).style.backgroundColor = 'red';
        this.prevCell = cell;
    };
    BorderMazeViewer.prototype.resetMazeView = function () {
        for (var j = 0; j < this.maze.y; j++) {
            for (var i = 0; i < this.maze.x; i++) {
                document.getElementById(i + "," + j).style.backgroundColor = 'white';
            }
        }
        this.prevCell = null;
        this.mazeDisplayed = false;
    };
    BorderMazeViewer.prototype.supportsRobots = function () {
        return true;
    };
    return BorderMazeViewer;
})(MazeViewer);
/// <reference path="maze/maze.ts" />
/// <reference path="maze/firstPersonMaze.ts" />
/// <reference path="maze/mazeGenerationAlgorithm" />
/// <reference path="maze/mazeGenerationGrowingTreeAlgorithm.ts" />
/// <reference path="maze/mazeGenerationPrimsAlgorithm" />
/// <reference path="robot/mazeRobot.ts" />
/// <reference path="robot/robotAlgorithm.ts" />
/// <reference path="robot/randomMouseRobotAlgorithm.ts" />
/// <reference path="robot/wallFollowerRobotAlgorithm.ts" />
/// <reference path="robot/recursiveBacktrackingRobotAlgorithm.ts" />
/// <reference path="viewers/mazeViewer.ts" />
/// <reference path="viewers/borderMazeViewer.ts" />
var robot;
var maze;
var mazeGenerationAlgorithm;
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
        }, robot.renderer.delay);
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
    mazeGenerationAlgorithm = getMazeGenerationAlgorithm(userChoices.mazeGenerationAlgorithm);
    maze = new Maze(userChoices.mazeWidth, userChoices.mazeHeight, mazeGenerationAlgorithm);
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
    // reset existing maze display before trying to solve (it may already be mid-solve from previous robot)
    mazeViewer.resetMazeView();
    document.getElementById("mazeDisplay").innerHTML = "";
    robot = new Robot();
    robot.robotAlgorithm = getRobotAlgorithm(userChoices.robotAlgorithm, robot);
    mazeViewer.showRobotInMaze(robot, maze, parseInt(userChoices.robotDelay));
}
function getUserOptionChoices() {
    var mazeWidthSelect = document.getElementById("mazeWidthInput");
    var mazeHeightSelect = document.getElementById("mazeHeightInput");
    var mazeGenerationAlgorithmSelect = document.getElementById("mazeGenerationAlgorithmSelect");
    var robotDelaySelect = document.getElementById("robotDelayInput");
    var robotAlgorithmSelect = document.getElementById("robotAlgorithmSelect");
    var mazeDisplaySelect = document.getElementById("mazeDisplaySelect");
    var options = {
        mazeWidth: mazeWidthSelect.value,
        mazeHeight: mazeHeightSelect.value,
        mazeGenerationAlgorithm: mazeGenerationAlgorithmSelect.options[mazeGenerationAlgorithmSelect.selectedIndex].value,
        robotDelay: robotDelaySelect.value,
        robotAlgorithm: robotAlgorithmSelect.options[robotAlgorithmSelect.selectedIndex].value,
        mazeDisplay: mazeDisplaySelect.options[mazeDisplaySelect.selectedIndex].value
    };
    return options;
}
function getMazeGenerationAlgorithm(algorithmType) {
    if (algorithmType == "growingTree") {
        return new MazeGenerationGrowingTreeAlgorithm();
    }
    else if (algorithmType == "prims") {
        return new MazeGenerationPrimsAlgorithm();
    }
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
/// <reference path="../mazeUtils.ts" />
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
                outString += mazeCell.openingsCode.toString(16);
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
/// <reference path="../MazeUtils.ts" />
// Uses a HTML table with images added to cells (in this regard similar to imageMazeViewer). The difference
// is that this class uses only a total of 5 images which are all superimposed on the same cell to display
// that cell's configuration. The 5 images are a central square, and then four passages leading in the 
// four direcions - N, S, E & W. In addition there is a sixth image representing a robot solving the maze.
var CompositeImageMazeViewer = (function (_super) {
    __extends(CompositeImageMazeViewer, _super);
    function CompositeImageMazeViewer(maze) {
        _super.call(this, maze);
        this.cellSize = 10; //200 / this.maze.x;
        this.robotIcon = MazeUtils.createImage('images/robot.png', this.cellSize);
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
/// <reference path="../MazeUtils.ts" />
/// <reference path="mazeViewer.ts" />
/// <reference path="../maze/cell.ts" />
// uses a set of images of maze cells that are named by a hexadecimal character (see codesMazeView.ts). These
// images are added to cells of an HTML table to produce a view of the maze
var ImageMazeViewer = (function (_super) {
    __extends(ImageMazeViewer, _super);
    function ImageMazeViewer(maze) {
        _super.call(this, maze);
        this.imageSize = 16; //400 / maze.x;
        this.robotIcon = MazeUtils.createImage('images/robot_test.png', this.imageSize);
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
                tileCode = this.maze.cells[i][j].openingsCode.toString(16);
                cell.appendChild(MazeUtils.createImage('images/' + tileCode + '.png', this.imageSize));
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
