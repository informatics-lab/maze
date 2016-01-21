/// <reference path="../maze/firstPersonMaze.ts" />
/// <reference path="../viewers/mazeViewer.ts" />
/// <reference path="robotAlgorithm.ts" />
/// <reference path='randomMouseRobotAlgorithm.ts' />

class Robot {

    maze: FirstPersonMaze;
    mazeViewer: MazeViewer;
    robotAlgorithm: RobotAlgorithm;

    updateDelay: number;
    facing: string = 'south';
    nSteps: number = 0;
    stop: boolean = false;

    constructor(maze: FirstPersonMaze, mazeViewer: MazeViewer, robotDelay: number) {
        this.maze = maze;
        this.mazeViewer = mazeViewer;
        // use random mouse as the default algorithm
        this.robotAlgorithm = new RandomMouseRobotAlgorithm(this);

        this.updateDelay = robotDelay;
    }

    // TODO user proper 'set' setter?
    setRobotAlgorithm(algorithm: RobotAlgorithm): void {
        this.robotAlgorithm = algorithm;
    }

    trySolvingMaze(): void {
        if (!this.mazeViewer.mazeDisplayed) {
            this.mazeViewer.displayMaze();
        }

        var stepsDiv = document.createElement('div');
        stepsDiv.id = "stepsDiv";
        stepsDiv.innerHTML = "Number of robot moves: <span id='stepsSpan'>0</span>";
        document.getElementById('mazeDisplay').appendChild(stepsDiv);

        this._createRobotLoopTimeout(this._robotLoop, this);
    }

    quit(): void {
        this.stop = true;
    }

    private _createRobotLoopTimeout(robotLoopFn: Function, thisContext): void {
        setTimeout(function() {
            robotLoopFn.call(thisContext);
        }, this.updateDelay); 
    }

    private _robotLoop(): void {
        var cell: Cell = this.maze.getCurrentCell();
    
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
        } else if (this.stop) {
            console.log("Robot told to stop. It travelled ", this.nSteps, " steps.");
            return;
        } else {
            this.nSteps++;
            document.getElementById("stepsSpan").innerHTML = this.nSteps + '';
            this._createRobotLoopTimeout(this._robotLoop, this);
        }
    }

    getNewOpenings(cell): CellOpenings[] {
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
    }

    lookToDirection(direction: string): Cell[] {
        return this.maze.look(direction);
    }

    getNewDirection(currentDirection: string, turn: number): string {
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
    }
}

