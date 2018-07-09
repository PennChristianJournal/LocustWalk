
export function defaultValue(value, defaultVal) {
  return typeof value === 'undefined' ? defaultVal : value;
}
