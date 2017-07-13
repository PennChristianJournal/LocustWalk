
import React, { Component } from 'react';
import Optional from '../components/optional';
import urljoin from 'url-join';
import nconf from 'nconf';

function flatten(arr) {
  return arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}

class Head extends Component {
  render() {
    return (
      <head>
      {flatten([
        this.props.link.map(function(props) {
          return <link {...props} />;
        }),
        Object.keys(this.props.metadata).map(key => {
          const tag = this.props.metadata[key];
          return <meta property={key} {...tag}></meta>;
        }),
        <Optional test={this.props.title}><title>{this.props.title}</title></Optional>,
      ])}
      </head>
    );
  }
}

const DEFAULT_METADATA = {
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
};

export default ((HeadInternal) => {
  return class extends Component {
    render() {
      const ownProps = this.props;
      
      const {metadata} = ownProps;
      const {meta, link, title} = metadata || {};
    
      var props = Object.assign({}, DEFAULT_METADATA);
      if (title) {
        props.title = title;
      }
    
      props.metadata = {};
      if (meta) {
        props.meta = Object.assign({}, props.meta, meta);
      }
      if (props.meta) {
        Object.keys(props.meta).forEach(key => {
          let obj = props.meta[key];
          const {property, properties, ...rest} = obj;
          if (property) {
            Object.assign(props.metadata, {
              [property]: rest,
            });
          } else if (properties) {
            properties.forEach(property => {
              Object.assign(props.metadata, {
                [property]: rest,
              });
            });
          }
        });
      }
    
      if (link) {
        props.link = (props.link || []).concat(link);
      }
    
      return <HeadInternal {...props} />;
    }
  };
})(Head);
