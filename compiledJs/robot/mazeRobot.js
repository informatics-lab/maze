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
