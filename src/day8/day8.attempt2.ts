/** biome-ignore-all lint/style/noNonNullAssertion: There are a lot of lookups that are present */
type Box = { x: number; y: number; z: number };

type BoxPair = {
  box1: Box;
  box2: Box;
  distance: number;
  box1Index: number;
  box2Index: number;
};

/**
 * This function works using the Union-Find data structure.
 * - We create all different possible pairs
 * - sort all pairs by distance, limiting to 1000
 * - Use Union-Find to avoid connecting already-connected boxes and count circuit sizes
 */
export const countLightConnections = (input: string) => {
  const boxes = parseInput(input);

  // create pairs
  const pairs: BoxPair[] = [];

  boxes.forEach((box1, box1Index) => {
    for (
      let box2Index = box1Index + 1;
      box2Index < boxes.length;
      box2Index += 1
    ) {
      const box2 = boxes[box2Index]!;

      // This should have been straight line...
      const distance =
        Math.abs(box1.x - box2.x) +
        Math.abs(box1.y - box2.y) +
        Math.abs(box1.z - box2.z);

      pairs.push({ box1, box2, distance, box1Index, box2Index });
    }
  });

  // sort pairs by distance
  pairs.sort((a, b) => a.distance - b.distance);

  // Create new Union find parents and rank
  const parent = Array.from({ length: boxes.length }, (_, i) => i);
  const rank = Array.from({ length: boxes.length }, () => 0);
  let connectionsUsed = 0;

  const findParent = (x: number): number => {
    if (parent[x] !== x) {
      parent[x] = findParent(parent[x]!);
    }
    return parent[x]!;
  };

  const union = (x: number, y: number): boolean => {
    const rootParentX = findParent(x);
    const rootParentY = findParent(y);

    // If the 2 are already connected, return false so we don't count
    if (rootParentX === rootParentY) {
      return false;
    }

    // Union by rank
    if (rank[rootParentX]! < rank[rootParentY]!) {
      parent[rootParentX] = rootParentY;
    } else if (rank[rootParentX]! > rank[rootParentY]!) {
      parent[rootParentY] = rootParentX;
    } else {
      parent[rootParentY] = rootParentX;
      rank[rootParentX]! += 1;
    }

    // return true so we count
    return true;
  };

  // using an of loop, so we can break the loop
  for (const pair of pairs) {
    if (connectionsUsed >= 10) break;

    // try connecting the 2 boxes of a pair
    if (union(pair.box1Index, pair.box2Index)) {
      connectionsUsed += 1;
      console.log(`✓ Connected! (Connection #${connectionsUsed})`);
    } else {
      // this should have done more....
      console.log(`✗ Already connected`);
    }
  }

  // get the sisze of each circuit from its parent
  const circuitSizes: Record<number, number> = {};
  parent.forEach((_, i) => {
    const root = findParent(i);
    circuitSizes[root] = (circuitSizes[root] || 0) + 1;
  });

  console.log(circuitSizes);
  const sizes = Object.values(circuitSizes).sort().reverse();

  console.log(sizes);

  const result = sizes[0]! * sizes[1]! * sizes[2]!;
  return result;
};

// Support functions

const parseInput = (input: string): Box[] => {
  return input.split('\n').map((line) => {
    const match = line.match(/^(\d+),(\d+),(\d+)/);
    if (!match) throw new Error(`Invalid input line: ${line}`);

    return {
      x: parseInt(match[1]!, 10),
      y: parseInt(match[2]!, 10),
      z: parseInt(match[3]!, 10),
    };
  });
};
