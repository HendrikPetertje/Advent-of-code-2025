/** biome-ignore-all lint/style/noNonNullAssertion: all over the place */

/**
 * Counts all possible paths from startPoint to 'out' that pass through required waypoints.
 *
 * I did start this off caching all visited paths backwards and then returning that.
 * for part 1 it worked wonders, but for part 2 this exploded into a world of pain.
 * So instead of caching all visited nodes I now only cache the current position
 * and the required waypoints progress and that works a treat!
 */
export const getPossiblePaths = (
  input: string,
  startPoint: string,
  requiredRoutPoints: string[] = [],
) => {
  const devices = parseInput(input);

  // For very large graphs, we need a different approach
  const cache = new Map<string, number>();

  const step = (
    current: string,
    visited: Set<string>,
    requiredVisited: string[],
  ): number => {
    if (current === 'out') {
      // Check if all required points are visited
      return requiredRoutPoints.every((point) =>
        requiredVisited.includes(point),
      )
        ? 1
        : 0;
    }

    // Create cache key based on current position and required points visited
    const requiredKey = Array.from(requiredVisited).sort().join(',');
    const cacheKey = `${current}:${requiredKey}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    const paths = devices[current] || [];
    let result = 0;

    // for loop since we want to be able to break out
    for (const path of paths) {
      // if we have been here before, break out.
      if (visited.has(path)) continue;

      const newVisited = new Set(visited);
      newVisited.add(path);

      const newRequiredVisited = [...requiredVisited];
      if (requiredRoutPoints.includes(path)) {
        newRequiredVisited.push(path);
      }

      result += step(path, newVisited, newRequiredVisited);
    }

    cache.set(cacheKey, result);
    return result;
  };

  const initialVisited = new Set<string>([startPoint]);
  return step(startPoint, initialVisited, []);
};

const parseInput = (input: string) => {
  const devices = input
    .split('\n')
    .reduce<Record<string, string[]>>((acc, line) => {
      const [device, rest] = line.split(': ');
      if (!device || !rest) throw new Error(`invalid line: ${line}`);
      const attachedTo = rest.split(' ');
      acc[device] = attachedTo;
      return acc;
    }, {});

  return devices;
};
