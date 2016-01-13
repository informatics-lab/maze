var FirstPersonMaze = function(thirdPersonMaze) {
	var _cells = thirdPersonMaze.cells;
	
	var _currentCoordinates = {x: 0, y: 0};
    var _currentCell = _cells[_currentCoordinates.x][_currentCoordinates.y];
	
	this.getCurrentCell = function() {
		return _currentCell;
	}
	
	this.move = function(facing) {
		_currentCoordinates = changeCoordinatesInDirection(_currentCoordinates, facing);
		if (_currentCoordinates == null) {
			return false
		} else {
			_currentCell = _cells[_currentCoordinates.x][_currentCoordinates.y];
			console.log("robot moved to new cell of x: ", _currentCoordinates.x, ", y: ", _currentCoordinates.y);
			return true;
		}
	}
	
	this.look = function(direction) {
		// get array of cells in a straight line in this direction until we come to a wall
		var lookCells = [];
		var coordinates = {
			x: _currentCoordinates.x,
			y: _currentCoordinates.y
		}
		
		var nextCoordinates = changeCoordinatesInDirection(coordinates, direction);
		while (nextCoordinates != null) {
			lookCells.push(_cells[nextCoordinates.x][nextCoordinates.y]);
			nextCoordinates = changeCoordinatesInDirection(coordinates, direction);
		}
		
		return lookCells;
	}
	
	var changeCoordinatesInDirection = function(coordinates, direction) {
	
		var newCoordinates = coordinates;
		var cell = _cells[coordinates.x][coordinates.y];
	
		if (direction == 'west' && cell.openings.west) {
			newCoordinates.x -= 1;
		} else if (direction == 'east' && cell.openings.east) {
			newCoordinates.x += 1;
		} else if (direction == 'north' && cell.openings.north) {
			newCoordinates.y -= 1;
		} else if (direction == 'south' && cell.openings.south) {
			newCoordinates.y += 1;
		} else {
			return null;
		}
		
		return newCoordinates;   
	}
}
