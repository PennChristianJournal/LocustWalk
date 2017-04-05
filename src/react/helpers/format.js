
export function truncate(text, length, noelipsis) {
  if (text.length < length) {
    return text;
  }
  text = text.substring(0, length);
  var idx = text.lastIndexOf(' ');
  var str = text.substring(0, idx);
  return noelipsis ? str  : str + '...';
}

export function htmlPreview(text, length) {
  return truncate(
    text
      .replace(/<sup><a\b[^>]*>\[\d+\]<\/a><\/sup>/ig, '')
      .replace(/(<([^>]+)>)/ig, ''),
    length
  );
}