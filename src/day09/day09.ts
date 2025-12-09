/** biome-ignore-all lint/style/noNonNullAssertion: so many non-null things */

type RedTile = { x: number; y: number };
type Tile = `${number}.${number}`;

export const getBiggestRectangleAreaWithGreenTiles = (input: string) => {
  const redTiles = parseInput(input);
  const redTilesSet = redTilesToSet(redTiles);
  const greenTilesOutline = createGreenTilesOutline(redTiles);

  // create a map of all possible rectangles and order them from biggest to smallest
  // the map should be accessed with size.index-index and contain 2 red tiles
  const candidates: { size: number; tiles: [RedTile, RedTile] }[] = [];

  redTiles.forEach((tile1, index) => {
    // I'm using a special for loop here, so i automatically skip over tiles i already have linked in previous iterations
    for (
      let innerIndex = index + 1;
      innerIndex < redTiles.length;
      innerIndex += 1
    ) {
      const tile2 = redTiles[innerIndex]!;

      // Have to do the +1 on both since the start is inclusive
      const distanceX = Math.abs(tile1.x - tile2.x) + 1;
      const distanceY = Math.abs(tile1.y - tile2.y) + 1;
      const area = distanceX * distanceY;
      candidates.push({ size: area, tiles: [tile1, tile2] });
    }
  });

  candidates.sort((a, b) => b.size - a.size);

  for (let currentI = 0; currentI < candidates.length; currentI += 1) {
    const candidate = candidates[currentI]!;
    if (
      isRectangleValid(
        candidate.tiles[0],
        candidate.tiles[1],
        redTiles,
        redTilesSet,
        greenTilesOutline,
      )
    ) {
      return candidate.size;
    }
  }
};

// function that gets the biggest rectangle area from 2 diagonal corner pieces
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

const parseInput = (input: string): RedTile[] => {
  return input.split('\n').map((line) => {
    const [x, y] = line.split(',');
    if (!x || !y) throw new Error(`invalid line, ${line}`);

    return { x: parseInt(x, 10), y: parseInt(y, 10) };
  });
};

const redTilesToSet = (redTiles: RedTile[]) => {
  // Create a set of red tiles for quick lookup
  const redTilesSet = new Set<Tile>();
  redTiles.forEach((tile) => {
    redTilesSet.add(`${tile.x}.${tile.y}`);
  });

  return redTilesSet;
};

const createGreenTilesOutline = (redTiles: RedTile[]) => {
  const greenTiles = new Set<Tile>();

  // Create horizontal and vertical lines between various red tiles
  redTiles.forEach((tile1, index) => {
    // the last tile in the list connects back to the first tile.
    const currentIndex = index + 1 === redTiles.length ? 0 : index + 1;
    const tile2 = redTiles[currentIndex]!;

    // do we have a vertical line?
    if (tile1.x === tile2.x) {
      const minY = Math.min(tile1.y, tile2.y);
      const maxY = Math.max(tile1.y, tile2.y);

      for (let y = minY; y <= maxY; y += 1) {
        greenTiles.add(`${tile1.x}.${y}`);
      }
      return;
    }
    // Do we have a horizontal line?
    if (tile1.y === tile2.y) {
      const minX = Math.min(tile1.x, tile2.x);
      const maxX = Math.max(tile1.x, tile2.x);

      for (let x = minX; x <= maxX; x += 1) {
        greenTiles.add(`${x}.${tile1.y}`);
      }
      return;
    }

    throw new Error('green tiles line between red tiles interrupted!');
  });

  return greenTiles;
};

// Neat polygon function inspired by https://en.wikipedia.org/wiki/Point_in_polygon
const isPointInPolygon = (
  point: { x: number; y: number },
  polygon: RedTile[],
): boolean => {
  let inside = false;

  // we start with previousI being the last index and then assign the previous value after that every time.
  // this way we create a perfect circle
  for (
    let currentI = 0, previousI = polygon.length - 1;
    currentI < polygon.length;
    previousI = currentI += 1
  ) {
    const pi = polygon[currentI]!;
    const pj = polygon[previousI]!;

    if (
      pi.y > point.y !== pj.y > point.y &&
      point.x < ((pj.x - pi.x) * (point.y - pi.y)) / (pj.y - pi.y) + pi.x
    ) {
      inside = !inside;
    }
  }

  return inside;
};

const isRectangleValid = (
  corner1: RedTile,
  corner2: RedTile,
  redTiles: RedTile[],
  redTilesSet: Set<Tile>,
  greenTilesOutline: Set<Tile>,
) => {
  const minX = Math.min(corner1.x, corner2.x);
  const minY = Math.min(corner1.y, corner2.y);
  const maxX = Math.max(corner1.x, corner2.x);
  const maxY = Math.max(corner1.y, corner2.y);

  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      const tileKey = `${x}.${y}` as const;
      // if we are on the red tile
      if (redTilesSet.has(tileKey)) continue;
      // if we are on the green outline, continue early
      if (greenTilesOutline.has(tileKey)) continue;
      // if point is not in the polygon, then the entire rectangle is invalid
      if (!isPointInPolygon({ x, y }, redTiles)) return false;
    }
  }

  return true;
};
