export function getNextBusinessDate(): string {
  const today = new Date();

  let day = today.getDay(); // 0 = Sun, 6 = Sat
  let offset = 1;

  if (day === 5)
    offset = 3; // Friday → Monday
  else if (day === 6)
    offset = 2; // Saturday → Monday
  else if (day === 0) offset = 1; // Sunday → Monday

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + offset);

  const mm = String(nextDate.getMonth() + 1).padStart(2, "0");
  const dd = String(nextDate.getDate()).padStart(2, "0");
  const yyyy = nextDate.getFullYear();

  return `${mm}/${dd}/${yyyy}`;
}
