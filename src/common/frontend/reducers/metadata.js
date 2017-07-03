
import { RECEIVE_ARTICLES } from '../actions/articles';
import { htmlPreview } from '../helpers/format';
import { getFileURL } from '../helpers/file';

import nconf from 'nconf';
import urljoin from 'url-join';

export default function metadata(state = {
  title: 'Locust Walk - Penn Christian Journal',
  meta: {
    description: {
      properties: ['description', 'og:description', 'twitter:description'],
      content: 'Locust Walk is a student-led Christian publication that exists to present the perspectives of faith and non-faith worldviews on questions of truth and purpose. Through active dialogue within the University of Pennsylvania, we seek to build relationships modeled after the life and teachings of Jesus Christ who informs our understanding of cultural engagement, reconciliation, and community. We pledge to cultivate an environment where the pursuit of solidarity in diversity can lay a foundation for conversation conducted with love and mutual respect.',
    },
    image: {
      properties: ['og:image', 'twitter:image'],
      content: urljoin(nconf.get('SERVER_ROOT'), '/img/social-share.png'),
    },
    imageWidth: {
      properties: ['og:image:width', 'twitter:image:width'],
      content: '1280',
    },
    imageHeight: {
      properties: ['og:image:height', 'twitter:image:height'],
      content: '667',
    },
    siteName: {
      property: 'og:site_name',
      content: 'Penn Christian Journal',
    },

    author: {
      properties: ['author'],
    },
    type: {
      property: 'og:type',
    },
    publishedTime: {
      property: 'article:published_time',
    },
  },
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
  switch (action.type) {
    case RECEIVE_ARTICLES:
      if (action.name === 'main') {
        let article = action.articles[0] || {};


        let title = `${article.title} - Locust Walk`;

        let description = Object.assign({}, state.meta.description, {
          content: htmlPreview(article.content, 160),
        });

        let image = Object.assign({}, state.meta.image, {

          content: urljoin(nconf.get('SERVER_ROOT'), getFileURL(article.thumb)),
        });

        let author = Object.assign({}, state.meta.author, {
          content: article.author,
        });

        let type = Object.assign({}, state.meta.type, {
          content: 'article',
        });

        let publishedTime = Object.assign({}, state.meta.publishedTime, {
          content: article.date && (new Date(article.date)).toISOString(),
        });

        let meta = Object.assign({}, state.meta, {
          description,
          image,

          author,
          type,
          publishedTime,
        });

        state = Object.assign({}, state, {
          title,
          meta,

        });
      }
      break;
    default:
      break;
  }

  return state;
}
