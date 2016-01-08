var FirstPersonMaze = function(thirdPersonMaze) {
	var _cells = thirdPersonMaze.cells;
	
	var _currentCoordinates = {x: 0, y: 0};
    var _currentCell = _cells[_currentCoordinates.x][_currentCoordinates.y];
	
	this.getCurrentCell = function() {
		return _currentCell;
	}
	
	/*
	var _updateCurrentCell = function() {
		_currentCell = _cells[_currentCoordinates.x][_currentCoordinates.y];
    	console.log("robot moved to new cell of x: ", _currentCoordinates.x, ", y: ", _currentCoordinates.y);
	}
	
	this.moveOld = function(facing) {
		console.log("robot is trying to move ", facing);
		if (facing == 'west' && _currentCell.openings.west) {
			_currentCoordinates.x -= 1;
		} else if (facing == 'east' && _currentCell.openings.east) {
			_currentCoordinates.x += 1;
		} else if (facing == 'north' && _currentCell.openings.north) {
			_currentCoordinates.y -= 1;
		} else if (facing == 'south' && _currentCell.openings.south) {
			_currentCoordinates.y += 1;
		} else {
			return false;
		}   

		_updateCurrentCell();
		return true;
	}*/
	
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
		// need to check we aren't going to be changing the original _currentCoordinates when we do stuff with coordinates
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
	
	/*
	var getCellInDirection = function(referenceCoordinates, direction) {
		
		var newCellCoordinates = {
			x: referenceCoordinates.x,
			y: referenceCoordinates.y
		}
		var referenceCell = _cells[referenceCoordinates.x][referenceCoordinates.y];
		
		if (direction == 'west' && referenceCell.openings.west) {
			newCellCoordinates.x -= 1;
		} else if (direction == 'east' && referenceCell.openings.east) {
			newCellCoordinates.x += 1;
		} else if (direction == 'north' && referenceCell.openings.north) {
			newCellCoordinates.y -= 1;
		} else if (direction == 'south' && referenceCell.openings.south) {
			newCellCoordinates.y += 1;
		} else {
			return null;
		}   
		
		var newCell = _cells[newCellCoordinates.x][newCellCoordinates.y];
		return newCell;
	} 
	*/
}
