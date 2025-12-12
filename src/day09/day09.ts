/** biome-ignore-all lint/style/noNonNullAssertion: so many non-null things */

type RedTile = { x: number; y: number };

export const getBiggestRectangleAreaWithGreenTiles = (input: string) => {
  let redTiles = parseInput(input);

  // close the polygon. I did this with a -1 in previous steps, but that becomes more and more cumbersome.
  // so here we just re-insert the first and the last and the path-finding will be easier
  redTiles = [...redTiles, redTiles[0]!];

  // Count the amount of turns to determine if the polygon is clockwise or counter-clockwise
  // this threw me off for a while. (spoiler it is not clockwise in my input data)
  if (!isClockwise(redTiles)) {
    redTiles.reverse();
  }

  let biggestArea = 0;

  // Use geometric optimization to find valid rectangles
  // this is done in 3 steps:
  // - first we do a rough quick check. obvious parts that won't work are filtered out
  // - then we iterate what remains and:
  //   - check if the area provided for the next iteration is actually bigger than the biggest found thus far
  //   - we do a slower more precise check with the remainder and then bump the biggestArea number.
  for (let i = 0; i < redTiles.length - 1; i += 1) {
    // Find all points that could form valid rectangles with point i
    const validEndpoints = filterValidEndpoints(redTiles, i);

    for (const validEndPointI of validEndpoints) {
      const tile1 = redTiles[i]!;
      const tile2 = redTiles[validEndPointI]!;
      const area = getRectangleArea(tile1, tile2);

      if (area <= biggestArea) continue; // Skip if area is not better

      // Final validation: check if the rectangle actually fits within the polygon
      // without intersecting any of the polygon's boundary walls
      const validArea = getValidArea(redTiles, i, validEndPointI);

      if (biggestArea < validArea) biggestArea = validArea;
    }
  }

  return biggestArea;
};

export const getBiggestRectangleArea = (input: string) => {
  const tiles = parseInput(input);

  let highestArea = 0;

  tiles.forEach((tile1, index) => {
    // I'm using a special for loop here, so i automatically skip over tiles i already have linked in previous iterations
    for (
      let innerIndex = index + 1;
      innerIndex < tiles.length;
      innerIndex += 1
    ) {
      const tile2 = tiles[innerIndex]!;

      // Have to do the +1 on both since the start is inclusive
      const distanceX = Math.abs(tile1.x - tile2.x) + 1;
      const distanceY = Math.abs(tile1.y - tile2.y) + 1;
      const area = distanceX * distanceY;
      if (area > highestArea) highestArea = area;
    }
  });

  return highestArea;
};

const getRectangleArea = (tile1: RedTile, tile2: RedTile): number => {
  // Calculate rectangle area from two diagonal corner points
  // +1 because coordinates are inclusive (a line from 0 to 2 has length 3)
  const distanceX = Math.abs(tile1.x - tile2.x) + 1;
  const distanceY = Math.abs(tile1.y - tile2.y) + 1;
  return distanceX * distanceY;
};

// lotsa vector operations for 2D geometry

// Create a vector (direction) from point a to point b
const delta = (a: RedTile, b: RedTile): RedTile => {
  return { x: a.x - b.x, y: a.y - b.y };
};

// "Cross product". Determines if one vector (direction) is clockwise/counter-clockwise relative to another vector
// Positive = counter-clockwise turn, Negative = clockwise turn, Zero = collinear
const cross = (v: RedTile, w: RedTile): number => {
  return v.x * w.y - v.y * w.x;
};

// "Dot product". Measures how much two vectors point in the same direction
// Positive = same general direction, Negative = opposite directions, Zero = going besides each other
const dot = (v: RedTile, w: RedTile): number => {
  return v.x * w.x + v.y * w.y;
};

// Determine if the polygon path is oriented clockwise
const isClockwise = (tiles: RedTile[]): boolean => {
  // If more right turns than left turns, the overall path is clockwise
  // negative = clockwise, positive = counter-clockwise
  let dirNum = 0;
  const tilesCount = tiles.length;

  // Check every set of 3 consecutive points to see if they make a left or right turn
  for (let i = 0; i < tilesCount - 2; i += 1) {
    // Create vectors from middle point to its neighbors
    // vector from point i+1 to point i
    const d0 = delta(tiles[i]!, tiles[i + 1]!);
    // vector from point i+1 to point i+2
    const d1 = delta(tiles[i + 2]!, tiles[i + 1]!);

    // Cross product tells us the turn direction at the middle point
    if (cross(d0, d1) > 0) {
      // Left turn (counter-clockwise)
      dirNum += 1;
    } else {
      // Right turn (clockwise)
      dirNum -= 1;
    }
  }

  return dirNum > 0;
};

// Pre-check. Find which points could create valid rectangle corners.
// This is the trick that makes this puzzle a lot faster
// (imagine going in a circle clockwise, the inside of the circle is on your right. The outside on the left)
const filterValidEndpoints = (tiles: RedTile[], idx: number): number[] => {
  // Get current point and neighbors
  const y = tiles[idx]!;
  let currentTile: RedTile, nextTile: RedTile;

  if (idx === 0) {
    currentTile = tiles[tiles.length - 1]!;
    nextTile = tiles[1]!;
  } else {
    currentTile = tiles[idx - 1]!;
    nextTile = tiles[idx + 1]!;
  }

  // Create vectors (directions) from current point to its neighbors
  // Vector from y to x (previous direction)
  const d0 = delta(currentTile, y);
  // Vector from y to z (next direction)
  const d1 = delta(nextTile, y);

  let direction: 'left' | 'right';

  // Depending on whether the polygon makes a left or right turn
  // at this corner, we can determine which directions are "inside" the polygon
  if (cross(d0, d1) > 0) {
    // Left turn at this corner - the internal angle is between d0 and d1
    // Valid rectangle corners must be in directions that are "between" d0 and d1
    direction = 'left';
  } else {
    // Right turn at this corner - the internal angle is NOT between d0 and d1
    // Valid rectangle corners must be in directions outside the d0-d1 wedge
    direction = 'right';
  }

  // Test all points that come after idx+1 (must skip adjacent point)
  const result: number[] = [];
  for (let offset = 0; offset < tiles.length - idx - 2; offset += 1) {
    const tileIndex = idx + 2 + offset;
    // Vector from y to candidate point c
    const dc = delta(tiles[tileIndex]!, y);
    // How much dc aligns with d0 direction
    const dot0 = dot(dc, d0);
    // How much dc aligns with d1 direction
    const dot1 = dot(dc, d1);

    const filterResult =
      direction === 'left' ? dot0 > 0 && dot1 > 0 : dot0 < 0 || dot1 < 0;

    if (filterResult) {
      result.push(tileIndex);
    }
  }

  return result;
};

// Final validation: Check if a rectangle actually fits inside the polygon
// Even if the geometric filtering suggests two points could form a rectangle,
// we need to verify that the rectangle doesn't intersect any polygon walls
// how this works:
// - We turn the corner points back into a box with 4 coordinates (the bounds)
// - Then we walk along the "wall" that we created (red tiles plus the green tiles between those red tiles)
//   on every step we do 2 checks:
//   - Quick check: are we even to the rectangle or is it entirely to the left, right top or bottom?
//     if not, then obviously no intersection. Skip ahead otherwise continue
//   - does the current wall not intersect with the table, then skip ahead otherwise stop early.
//
const getValidArea = (tiles: RedTile[], i: number, j: number): number => {
  const tile1 = tiles[i]!;
  const tile2 = tiles[j]!;

  // Define the bounding box of the proposed rectangle
  const bounds = [
    [Math.min(tile1.x, tile2.x), Math.max(tile1.x, tile2.x)], // [minX, maxX]
    [Math.min(tile1.y, tile2.y), Math.max(tile1.y, tile2.y)], // [minY, maxY]
  ];

  // Check every edge of the polygon to see if it intersects our rectangle
  for (let i = 0; i < tiles.length - 1; i += 1) {
    const startTile = tiles[i]!;
    const endTile = tiles[i + 1]!;

    let constIdx: number, varIdx: number;

    // Determine if this is a vertical or horizontal wall
    if (startTile.x === endTile.x) {
      // Vertical wall: x coordinate is constant, y coordinate varies
      constIdx = 0;
      varIdx = 1;
    } else {
      // Horizontal wall: y coordinate is constant, x coordinate varies
      constIdx = 1;
      varIdx = 0;
    }

    // Get the constant coordinate value (the x for vertical walls, y for horizontal walls)
    const constCoord = constIdx === 0 ? startTile.x : startTile.y;

    // Quick check to speed things up.
    // If the wall's constant coordinate is outside our rectangle bounds,
    // then this wall definitely doesn't intersect the rectangle
    if (
      // Wall is before rectangle start or after rectangle end
      constCoord <= bounds[constIdx]![0]! ||
      constCoord >= bounds[constIdx]![1]!
    ) {
      continue;
    }

    // The wall's constant coordinate is within the rectangle bounds.
    // Now check if the wall's variable coordinate range overlaps with the rectangle
    const maxVar = Math.max(
      // Get the varying coordinate from point startTile
      constIdx === 0 ? startTile.y : startTile.x,
      // Get the varying coordinate from point endTile
      constIdx === 0 ? endTile.y : endTile.x,
    );
    const minVar = Math.min(
      constIdx === 0 ? startTile.y : startTile.x,
      constIdx === 0 ? endTile.y : endTile.x,
    );

    // Check if the wall's variable coordinate range is completely outside the rectangle
    if (maxVar <= bounds[varIdx]![0]!) {
      // Wall ends before rectangle starts in variable dimension
      continue;
    }

    if (minVar >= bounds[varIdx]![1]!) {
      // Wall starts after rectangle ends in variable dimension
      continue;
    }

    // If we get here, the wall intersects our rectangle, making it invalid
    return 0;
  }

  // No walls intersect the rectangle, so it's valid!
  return getRectangleArea(tile1, tile2);
};

const parseInput = (input: string): RedTile[] => {
  return input.split('\n').map((line) => {
    const [x, y] = line.split(',');
    if (!x || !y) throw new Error(`invalid line, ${line}`);

    return { x: parseInt(x, 10), y: parseInt(y, 10) };
  });
};
