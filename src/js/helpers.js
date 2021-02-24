export function random(from, to) {
  return Math.floor((Math.random() * to) + from);
}

export function key(x, y) {
  return 'cell_' + x + '_' + y;
}

export function randomLauncher(fn, intervalFrom, intervalTo) {
  setTimeout(function() {
    if (fn()) {
      return randomLauncher(fn, intervalFrom, intervalTo);
    }
  }, random(intervalFrom, intervalTo));
}

export function percents(value, percents) {
  return (value / 100) * percents;
}