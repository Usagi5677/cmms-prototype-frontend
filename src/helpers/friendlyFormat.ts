//number friendly format. e.g. 1k, 2k, 1.1k, 2.1k
//n = number
//d = decimal

export function friendlyFormat(n: number, d: number) {
  if (n < 1000) {
    return n;
  }
  let x = ("" + n).length;
  const p = Math.pow,
    newDecimal = p(10, d);
  x -= x % 3;
  return (
    Math.round((n * newDecimal) / p(10, x)) / newDecimal + " kMGTPE"[x / 3]
  );
}
