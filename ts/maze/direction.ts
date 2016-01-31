enum Direction { N = 8, E = 4, S = 2, W = 1 };

// Using a module allows us to create something like a static class
module DirectionUtils {
	export function dX(dir: Direction): number {
		switch (dir) {
			case Direction.E: return 1;
			case Direction.W: return -1;
			case Direction.N: return 0;
			case Direction.S: return 0;
		}
	}

	export function dY(dir: Direction): number {
		switch (dir) {
			case Direction.E: return 0;
			case Direction.W: return 0;
			case Direction.N: return -1;
			case Direction.S: return 1;
		}
	}

	export function opposite(dir: Direction): Direction {
		switch (dir) {
			case Direction.E: return Direction.W;
			case Direction.W: return Direction.E;
			case Direction.N: return Direction.S;
			case Direction.S: return Direction.N;
		}
	}

	export function getDirection(here: coordinates, next: coordinates): Direction {
		if (next.x > here.x) { return Direction.E; }
		if (next.x < here.x) { return Direction.W; }
		if (next.y > here.y) { return Direction.S; }
		if (next.y < here.y) { return Direction.N; }
	}
}