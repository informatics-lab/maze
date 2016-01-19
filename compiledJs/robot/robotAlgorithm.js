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
