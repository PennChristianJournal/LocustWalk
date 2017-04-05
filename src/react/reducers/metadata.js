
export default function metadata(state = {
  title: 'Locust Walk - Penn Christian Journal',
  meta: [
    {
      properties: ['description', 'og:description', 'twitter:description'],
      content: 'Locust Walk is a student-led Christian publication that exists to present the perspectives of faith and non-faith worldviews on questions of truth and purpose. Through active dialogue within the University of Pennsylvania, we seek to build relationships modeled after the life and teachings of Jesus Christ who informs our understanding of cultural engagement, reconciliation, and community. We pledge to cultivate an environment where the pursuit of solidarity in diversity can lay a foundation for conversation conducted with love and mutual respect.',
    },
    {
      properties: ['og:image', 'twitter:image'],
      content: '/img/social-share.png',
    },
    {
      properties: ['og:image:width', 'twitter:image:width'],
      content: '1280',
    },
    {
      properties: ['og:image:height', 'twitter:image:height'],
      content: '667',
    },
    {
      property: 'og:site_name',
      content: 'Penn Christian Journal',
    },
  ],
  link: [
    {
      href: '/img/favicon.ico',
      rel: 'icon',
      type: 'image/x-icon',
    },
    {
      href: 'https://fonts.googleapis.com/css?family=Lato:900,400,400italic,700,300',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: 'https://fonts.googleapis.com/css?family=Roboto:400,400italic,700',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/bower_components/normalize-css/normalize.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/bower_components/font-awesome/css/font-awesome.min.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/bower_components/bootstrap/dist/css/bootstrap.min.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/css/main.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
  ],
}, action) {
  return state;
}