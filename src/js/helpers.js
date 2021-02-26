export function random(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

export function key(x, y) {
  return 'cell_' + x + '_' + y;
}

export function randomLauncher(fn, intervalFrom, intervalTo) {
  setTimeout(function () {
    if (fn()) {
      return randomLauncher(fn, intervalFrom, intervalTo);
    }
  }, random(intervalFrom, intervalTo));
}

export function percents(value, percents) {
  return (value / 100) * percents;
}