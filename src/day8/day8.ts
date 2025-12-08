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
  const pairs = new Map<string, number>();
  const pairToIndices = new Map<string, [number, number]>();

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
      pairToIndices.set(pairKey, [box1Index, box2Index]);
    }
  });

  // Find 1000 smallest distances
  let minThreshold = 0;
  const groups: Array<[number, number]> = [];

  for (let i = 1; i <= maxConnections; i++) {
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
    const connection = pairToIndices.get(smallestPair)!;
    groups.push(connection);
  }

  // Merge overlapping groups using Union-Find
  const parent = new Map<number, number>();
  const rank = new Map<number, number>();

  const allBoxes = new Set<number>();
  for (const [a, b] of groups) {
    allBoxes.add(a);
    allBoxes.add(b);
  }

  for (const box of allBoxes) {
    parent.set(box, box);
    rank.set(box, 0);
  }

  // Find with path compression
  const find = (x: number): number => {
    const p = parent.get(x)!;
    if (p !== x) {
      parent.set(x, find(p)); // Path compression
    }
    return parent.get(x)!;
  };

  // Union by rank
  const union = (x: number, y: number): void => {
    const rootX = find(x);
    const rootY = find(y);

    if (rootX !== rootY) {
      const rankX = rank.get(rootX)!;
      const rankY = rank.get(rootY)!;

      if (rankX < rankY) {
        parent.set(rootX, rootY);
      } else if (rankX > rankY) {
        parent.set(rootY, rootX);
      } else {
        parent.set(rootY, rootX);
        rank.set(rootX, rankX + 1);
      }
    }
  };

  // Union all connected pairs
  for (const [a, b] of groups) {
    union(a, b);
  }

  // Group boxes by their root parent
  const componentGroups = new Map<number, Set<number>>();
  for (const box of allBoxes) {
    const root = find(box);
    if (!componentGroups.has(root)) {
      componentGroups.set(root, new Set());
    }
    componentGroups.get(root)!.add(box);
  }

  const currentGroups = Array.from(componentGroups.values());

  // Sort groups by size and get product of 3 largest
  const sortedGroups = currentGroups
    .map((group) => group.size)
    .sort((a, b) => b - a);

  if (sortedGroups.length < 3) {
    console.log('Group sizes:', sortedGroups);
    throw new Error('Less than 3 groups found');
  }

  const result = sortedGroups[0]! * sortedGroups[1]! * sortedGroups[2]!;

  return result;
};

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
