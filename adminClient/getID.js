if (document.location.host == 'drive.google.com') {
  el = document.querySelector('[aria-selected="true"]')
  if (el) {
    el.getAttribute('data-id')
  }
} else if (document.location.host == 'docs.google.com') {
  window.location.pathname.match('/document/d/(.+)/edit')[1]
}