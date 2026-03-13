export function load(key, defaultValue) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
