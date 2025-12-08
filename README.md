# aoc-2025

To install dependencies:

```bash
bun install
```

To all the various days:

Insert all days in the data folder. the pattern is:
data/dayxx/data-test.txt - For the test data given in the puzzle description
data/dayxx/data.txt - For the actual puzzle input

During advent of code it might happen that descriptive puzzle input changes
between part 1 and 2, when that happens I'll adjust the structure.

To run all the tests

```sh
bun test
```

To run all the tests while coding

```sh
bun test:watch
```

To create days, execute:

```
./createDay.sh <day-number>
```

To download and spawn the data for a day only, execute:

```
./createDay.sh <day-number> true
```
