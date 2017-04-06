
export function getFileURL(id, override) {
  if (override) {
    return override;
  }
  return `/files/${id}`;
}