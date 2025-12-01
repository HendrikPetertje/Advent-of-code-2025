/** Get the puzzle input **/
export const getDayData = async (day: number, test?: boolean) => {
  const zeroPaddedDay = day.toString().padStart(2, '0');
  const fileName = test ? 'data-test.txt' : 'data.txt'

  const file = Bun.file(`./data/day${zeroPaddedDay}/${fileName}`)
  const text = await file.text();
  return text.trim();
}
