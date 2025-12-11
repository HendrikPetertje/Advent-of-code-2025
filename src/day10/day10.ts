/** biome-ignore-all lint/style/noNonNullAssertion: so many of these again */
/**
 * reasoning for today's part 1.
 * the [.##.] obviously looks a crapton like bit state (0 off 1 on)
 * the button part looks a crapton like bits as well 2 being 001 or at least toggling the bit at a position
 *
 * AoC 2023 day 23 was done using some version of "bitmask", so I might as well apply that here with Breadth First Search.
 * In breath first search we use a queue to try out different combinations at the same time and then stop the queue if we find the shortest path
 *  more info:
 * - https://examples.javacodegeeks.com/bit-masking-in-java
 * - https://cp-algorithms.com/graph/01_bfs.html
 *
 * The idea then:
 * - in input parsing:
 *  - convert all target light patterns into bitmasks
 *  - convert buttons into integer masks that can later be used to affect the bitmasks
 * - use BFS to figure out the smallest buttons to press
 */
export const turnIndicatorLightsOn = (input: string) => {
  const parsedInput = parseInput(input);

  const shortestPresses = parsedInput.map((instructionSet) => {
    // this variable provides the maximum number of different light states
    // 1 shifted by x positions where x is the number of lights
    // so for 3 lights we would have 8 different states
    // I'm pushing that in to the array to make it super easy to track what I've already
    // visited in my BFS
    const maxPossibleStates = 1 << instructionSet.config.length;
    const visitedStates = new Array<boolean>(maxPossibleStates).fill(false);

    const queue = [];
    queue.push({ state: 0, distance: 0 });
    visitedStates[0] = true;

    while (queue.length > 0) {
      const { state, distance } = queue.shift()!;

      // If we have reached our configuration, return the distance
      if (state === instructionSet.configBitmask) return distance;

      // press each button once and push the result into the queue
      instructionSet.buttonInIntegerMasks.forEach((mask) => {
        const nextState = state ^ mask; // click the button
        if (!visitedStates[nextState]) {
          visitedStates[nextState] = true;
          queue.push({ state: nextState, distance: distance + 1 });
        }
      });
    }

    throw new Error('Could not find the desired configuration');
  });

  const result = shortestPresses.reduce((acc, presses) => presses + acc, 0);
  return result;
};

/**
 * Part 2 was an ass and a half. I first did BFS, then DFS, then i did weird stuff where i would try to opitimize that which failed.. But i think this works!.
 * (though for part two it will take 15 minutes, number 165 in my input took 10 minutes alone!)
 *
 * This adapted DFS approach is special :p:
 * - At each recursive step, we pick the joltage counter with the fewest available buttons that can affect it and remove the rest early
 * - For the chosen counter, we generate ALL possible ways to distribute button presses that sum to the needed joltage
 * - We use bitmasks to track which buttons are "consumed" at each level and can't be reused in deeper recursion
 * - The combinationsSummingTo function generates "integer partitions" (all ways to break a number into parts)
 * - We go back when a path leads to impossible states (negative joltages or unsatisfiable counters)
 */
export const fixJoltageSettings = (input: string) => {
  const parsedInput = parseInput(input);

  const results = parsedInput.map((instructionSet) => {
    // Create bitmask with all buttons available (all bits set to 1)
    // If we have 3 buttons: (1 << 3) - 1 = 111 (in binary that would be 7)
    const mask = (1 << instructionSet.buttons.length) - 1;
    const result = dfsPart2(
      [...instructionSet.joltages], // copy array to avoid mutations
      mask,
      instructionSet.buttons,
    );
    if (!Number.isFinite(result)) {
      throw new Error('No solution for this machine');
    }
    return result;
  });

  return results.reduce((acc, val) => acc + val, 0);
};

const parseInput = (input: string) => {
  return input.split('\n').map((line) => {
    const match = line.match(/\[(.+?)\] (.+?) \{(.+)\}/);
    if (!match) throw new Error(`Invalid input line: ${line}`);

    const rawConfig = match[1]!;
    const rawButtons = match[2]!.split(' ');
    const rawJoltages = match[3]!;

    const config = rawConfig.split('').map((light) => light === '#');
    const configBitmask = config.reduce((acc, lightOn, index) => {
      if (lightOn) acc |= 1 << index;
      return acc;
    }, 0);

    const buttons = rawButtons.map((btn) => {
      const btnMatch = btn.match(/\((.+)\)/);
      if (!btnMatch) throw new Error(`Invalid button format: ${btn}`);
      const result = btnMatch[1]!
        .split(',')
        .map((target) => parseInt(target, 10));
      return result;
    });

    const buttonInIntegerMasks = buttons.map((button) =>
      button.reduce((acc, position) => {
        acc |= 1 << position;
        return acc;
      }, 0),
    );

    const joltages = rawJoltages
      .split(',')
      .map((joltage) => parseInt(joltage, 10));

    return { config, configBitmask, buttons, buttonInIntegerMasks, joltages };
  });
};

// Returns all m-length non-negative integer vectors that sum to n.
const combinationsSummingTo = (m: number, n: number): number[][] => {
  const results: number[][] = [];
  const comb = new Array(m).fill(0);
  comb[m - 1] = n;

  while (true) {
    results.push(comb.slice());

    // Find rightmost nonzero value
    let i = m - 1;
    while (i >= 0 && comb[i] === 0) i--;

    // no more combinations
    if (i <= 0) break;

    const v = comb[i];
    comb[i] = 0;
    comb[i - 1] += 1;
    comb[m - 1] = v - 1;
  }

  return results;
};

/**
 * Returns true if button index `i` is still available in bitmask.
 */
const isButtonAvailable = (i: number, mask: number): boolean => {
  return (mask & (1 << i)) !== 0;
};

/**
 * Main DFS solver for one machine.
 * joltage: number[] of remaining required jolts
 * mask: bitmask of available buttons (1 bit per button)
 * buttons: array of buttons, where each button is an array of counter indices
 */
const dfsPart2 = (
  joltage: number[],
  mask: number,
  buttons: number[][],
): number => {
  // Base case set all to 0
  if (joltage.every((v) => v === 0)) {
    return 0;
  }

  const numButtons = buttons.length;

  // Choose the counter index `mini`
  let mini = -1;
  let minButtonCount = Infinity;
  let bestJoltage = -1;

  joltage.forEach((joltageValue, counterIndex) => {
    if (joltageValue <= 0) return;

    // count matching available buttons
    const count = Array.from(
      { length: numButtons },
      (_, buttonIdx) => buttonIdx,
    ).filter(
      (buttonIdx) =>
        isButtonAvailable(buttonIdx, mask) &&
        buttons[buttonIdx]!.includes(counterIndex),
    ).length;

    // This will be handled after the loop
    if (count === 0) return;

    if (
      count < minButtonCount ||
      (count === minButtonCount && joltageValue > bestJoltage)
    ) {
      minButtonCount = count;
      bestJoltage = joltageValue;
      mini = counterIndex;
    }
  });

  // Check if any counter has no available buttons
  const hasUnsatisfiableCounter = joltage.some((joltageValue, counterIndex) => {
    if (joltageValue <= 0) return false;
    const count = Array.from(
      { length: numButtons },
      (_, buttonIdx) => buttonIdx,
    ).filter(
      (buttonIdx) =>
        isButtonAvailable(buttonIdx, mask) &&
        buttons[buttonIdx]!.includes(counterIndex),
    ).length;
    return count === 0;
  });

  if (hasUnsatisfiableCounter || mini === -1) return Infinity;

  const needed = joltage[mini]!;

  // Collect all matching buttons
  const matchingButtons = Array.from(
    { length: numButtons },
    (_, buttonIdx) => buttonIdx,
  ).filter(
    (buttonIdx) =>
      isButtonAvailable(buttonIdx, mask) && buttons[buttonIdx]!.includes(mini),
  );

  if (matchingButtons.length === 0) return Infinity;

  let best = Infinity;

  // Build new mask with matching buttons removed
  const newMaskBase = matchingButtons.reduce(
    (acc, buttonIdx) => acc & ~(1 << buttonIdx),
    mask,
  );

  // Try all combinations of counts for these buttons (sum = needed)
  combinationsSummingTo(matchingButtons.length, needed).forEach((counts) => {
    const newJoltage = joltage.slice();

    const isValidCombination = counts.every(
      (pressCount, matchingButtonIndex) => {
        if (pressCount === 0) return true;

        const buttonIndex = matchingButtons[matchingButtonIndex]!;

        return buttons[buttonIndex]!.every((affectedCounterIndex) => {
          newJoltage[affectedCounterIndex]! -= pressCount;
          return newJoltage[affectedCounterIndex]! >= 0;
        });
      },
    );

    if (!isValidCombination) return;

    // Recurse
    const result = dfsPart2(newJoltage, newMaskBase, buttons);
    if (result !== Infinity) {
      best = Math.min(best, needed + result);
    }
  });

  return best;
};
