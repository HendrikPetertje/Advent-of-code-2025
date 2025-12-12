#!/bin/sh

set -euo pipefail

# Get input
dayNo=$1
downloadDataOnly=${2:-false}

# run this if downloadDataOnly is false
# Check if dayNo is provided
if [[ -z "${dayNo-}" ]]; then
    echo "Error: Day number is required"
    echo "Usage: ./createDay.sh <day_number>"
    exit 1
fi

# Pad day number with leading zero if needed (e.g., 1 -> 01)
dayPadded=$(printf "%02d" "$dayNo")

echo "Creating structure for day $dayPadded..."

if [ "$downloadDataOnly" = false ]; then
  # Create day folder
  srcFolder="src/day$dayPadded"
  mkdir -p "$srcFolder"

  # Copy template files and replace xx with padded day number
  cp "./src/dayTemplate/dayxx.ts_template" "$srcFolder/day$dayPadded.ts"
  cp "./src/dayTemplate/dayxx.test.ts_template" "$srcFolder/day$dayPadded.test.ts"

  # Replace all occurrences of 'xx' with the padded day number in both files
  sed -i '' "s/xx/$dayPadded/g" "$srcFolder/day$dayPadded.ts"
  sed -i '' "s/xx/$dayPadded/g" "$srcFolder/day$dayPadded.test.ts"

  # Also replace the hardcoded 'x' in getDayData calls with the actual day number
  sed -i '' "s/getDayData(x/getDayData($dayNo/g" "$srcFolder/day$dayPadded.test.ts"
fi

# Create data folder
dataFolder="data/day$dayPadded"
mkdir -p "$dataFolder"

# Create empty test data file
touch "$dataFolder/data-test.txt"

# Download actual data from Advent of Code (remove leading zero for URL)
dayUrl=$((10#$dayPadded))  # Convert to decimal to remove leading zero
if [[ -z "${AOC_SESSION_TOKEN-}" ]]; then
    echo "Warning: AOC_SESSION_TOKEN environment variable not set"
    echo "Creating empty data.txt file - you'll need to download the input manually"
    touch "$dataFolder/data.txt"
else
    echo "Downloading input data for day $dayUrl..."
    curl -s -H "Cookie: session=$AOC_SESSION_TOKEN" \
         "https://adventofcode.com/2025/day/$dayUrl/input" \
         -o "$dataFolder/data.txt"
    
    if [[ $? -eq 0 ]]; then
        echo "Successfully downloaded input data"
    else
        echo "Failed to download input data - check your session token"
        touch "$dataFolder/data.txt"
    fi
fi

echo "Day $dayPadded setup complete!"
echo "Created:"
echo "  - $srcFolder/day$dayPadded.ts"
echo "  - $srcFolder/day$dayPadded.test.ts" 
echo "  - $dataFolder/data-test.txt"
echo "  - $dataFolder/data.txt"
