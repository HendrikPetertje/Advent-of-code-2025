/** biome-ignore-all lint/style/noNonNullAssertion: There are a lot of lookups that are present */
type Box = { x: number; y: number; z: number };

/**
 * - Create all pairs with distances
 * - Find 1000 smallest distances
 * - Group connected pairs and merge overlapping groups
 */
export const countLightConnections = (input: string, maxConnections = 1000) => {
  const boxes = parseInput(input);

  // Create all pairs with distances
  const { pairs, pairIndices } = createPairs(boxes);

  // Find 1000 smallest distances
  const groups = getCLosestPairs(maxConnections, pairs, pairIndices);

  // Merge overlapping groups using Union-Find
  const unionFind = new UnionFind(boxes.length);

  // Union all connected pairs
  for (const [a, b] of groups) {
    unionFind.union(a, b);
  }

  // Group boxes by their root parent
  const componentGroups = unionFind.getComponents(boxes.length);
  const currentGroups = Array.from(componentGroups.values());

  // Sort groups by size and get product of 3 largest
  const sortedGroups = currentGroups
    .map((group) => group.size)
    .sort((a, b) => b - a);

  if (sortedGroups.length < 3) {
    console.error('Group sizes:', sortedGroups);
    throw new Error('Less than 3 groups found');
  }

  const result = sortedGroups[0]! * sortedGroups[1]! * sortedGroups[2]!;

  return result;
};

export const findLastConnection = (input: string) => {
  const boxes = parseInput(input);
  const { pairs, pairIndices } = createPairs(boxes);

  const unionFind = new UnionFind(boxes.length);

  let minThreshold = 0;
  let lastConnection: [number, number] | null = null;

  // Continue connecting until single circuit
  while (unionFind.countComponents(boxes.length) > 1) {
    let smallest: number | null = null;
    let smallestPair: string | null = null;

    // Find smallest distance greater than minThreshold
    for (const [pair, distance] of pairs.entries()) {
      if (
        distance > minThreshold &&
        (smallest === null || distance < smallest)
      ) {
        smallest = distance;
        smallestPair = pair;
      }
    }

    if (smallest === null || smallestPair === null) {
      break;
    }

    minThreshold = smallest;
    const connection = pairIndices.get(smallestPair)!;

    // Try to make the connection
    if (unionFind.union(connection[0], connection[1])) {
      lastConnection = connection;
    }
  }

  if (!lastConnection) {
    throw new Error('Could not connect all junction boxes');
  }

  // Get X coordinates and multiply
  const [box1Index, box2Index] = lastConnection;
  const box1X = boxes[box1Index]!.x;
  const box2X = boxes[box2Index]!.x;

  return box1X * box2X;
};

// support functions

const parseInput = (input: string): Box[] => {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      const match = line.match(/^(-?\d+),(-?\d+),(-?\d+)$/);
      if (!match) throw new Error(`Invalid input line: ${line}`);

      return {
        x: parseInt(match[1]!, 10),
        y: parseInt(match[2]!, 10),
        z: parseInt(match[3]!, 10),
      };
    });
};

const createPairs = (boxes: Box[]) => {
  const pairs = new Map<string, number>();
  const pairIndices = new Map<string, [number, number]>();

  boxes.forEach((box1, box1Index) => {
    for (
      let box2Index = box1Index + 1;
      box2Index < boxes.length;
      box2Index += 1
    ) {
      const box2 = boxes[box2Index]!;

      const distance = Math.sqrt(
        (box1.x - box2.x) ** 2 +
          (box1.y - box2.y) ** 2 +
          (box1.z - box2.z) ** 2,
      );

      const pairKey = `${box1Index},${box2Index}`;
      pairs.set(pairKey, distance);
      pairIndices.set(pairKey, [box1Index, box2Index]);
    }
  });

  return { pairs, pairIndices };
};

const getCLosestPairs = (
  maxConnections: number,
  pairs: Map<string, number>,
  pairIndices: Map<string, [number, number]>,
) => {
  let minThreshold = 0;
  const groups: Array<[number, number]> = [];

  for (let i = 1; i <= maxConnections; i += 1) {
    let smallest: number | null = null;
    let smallestPair: string | null = null;

    // Find smallest distance greater than minThreshold
    // a for loop of loop is used here so we can break it
    for (const [pair, distance] of pairs.entries()) {
      if (
        distance > minThreshold &&
        (smallest === null || distance < smallest)
      ) {
        smallest = distance;
        smallestPair = pair;
      }
    }

    if (smallest === null || smallestPair === null) {
      break;
    }

    minThreshold = smallest;
    const connection = pairIndices.get(smallestPair)!;
    groups.push(connection);
  }

  return groups;
};

class UnionFind {
  private parent = new Map<number, number>();
  private rank = new Map<number, number>();

  constructor(size: number) {
    Array.from({ length: size }, (_, i) => [
      this.parent.set(i, i),
      this.rank.set(i, 0),
    ]);
  }

  // Find with path compression
  find(x: number): number {
    const p = this.parent.get(x)!;
    if (p !== x) {
      this.parent.set(x, this.find(p)); // Path compression
    }
    return this.parent.get(x)!;
  }

  // Union by rank - returns true if connection was made, false if already connected
  // this is used in part 2
  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return false; // Already connected
    }

    const rankX = this.rank.get(rootX)!;
    const rankY = this.rank.get(rootY)!;

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }
    return true;
  }

  // Count number of separate components
  countComponents(totalSize: number): number {
    const roots = new Set<number>();
    for (let i = 0; i < totalSize; i++) {
      roots.add(this.find(i));
    }
    return roots.size;
  }

  // Get all components as groups
  getComponents(totalSize: number): Map<number, Set<number>> {
    const componentGroups = new Map<number, Set<number>>();
    for (let i = 0; i < totalSize; i++) {
      const root = this.find(i);
      if (!componentGroups.has(root)) {
        componentGroups.set(root, new Set());
      }
      componentGroups.get(root)!.add(i);
    }
    return componentGroups;
  }
}
