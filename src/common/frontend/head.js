'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Optional from '~/common/frontend/components/optional';
import urljoin from 'url-join';
import nconf from 'nconf';

function flatten(arr) {
  return arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}

export default class Head extends Component {
  render() {
    return (
      <head>
        {flatten([
          (this.props.link || []).map(function(props) {
            return <link {...props} />;
          }),
          Object.keys(this.props.meta || {}).map(key => {
            let obj = this.props.meta[key];
            const {property, content} = obj;
            if (content) {
              if (Array.isArray(property)) {
                const properties = property;
                return properties.map(property => <meta property={property} content={content}></meta>);
              } else {
                return <meta property={property} content={content}></meta>;
              }
            }
          }),
          <Optional test={this.props.title}><title>{this.props.title}</title></Optional>,
        ])}
      </head>
    );
  }
}

export function makeHeadContext() {
  var data = {
    title: 'Locust Walk - Penn Christian Journal',
    meta: {
      description: {
        property: ['description', 'og:description', 'twitter:description'],
        content: 'Locust Walk is a student-led Christian publication that exists to present the perspectives of faith and non-faith worldviews on questions of truth and purpose. Through active dialogue within the University of Pennsylvania, we seek to build relationships modeled after the life and teachings of Jesus Christ who informs our understanding of cultural engagement, reconciliation, and community. We pledge to cultivate an environment where the pursuit of solidarity in diversity can lay a foundation for conversation conducted with love and mutual respect.',
      },
      image: {
        property: ['og:image', 'twitter:image'],
        content: urljoin(nconf.get('SERVER_ROOT'), '/img/social-share.png'),
      },
      imageWidth: {
        property: ['og:image:width', 'twitter:image:width'],
        content: '1280',
      },
      imageHeight: {
        property: ['og:image:height', 'twitter:image:height'],
        content: '667',
      },
      siteName: {
        property: 'og:site_name',
        content: 'Penn Christian Journal',
      },
      author: {
        property: 'author',
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

  class HeadContext extends Component {

    constructor(props) {
      super(props);

      this.head = {
        addLink(params) {
          if (Array.isArray(params)) {
            const paramsArray = params;
            paramsArray.forEach(params => {
              if (!data.link.map(p => p.href).includes(params.href)) {
                data.link.push(params);
              }
            });
          } else {
            if (!data.link.map(p => p.href).includes(params.href)) {
              data.link.push(params);
            }
          }
        },
        setMetadata(property, content) {
          data.meta[property].content = content;
        },
        setTitle(title) {
          data.title = title;
        },
      };
    }

    getChildContext() {
      return {
        head: this.head,
      };
    }

    render() {
      return this.props.children;
    }
  }

  HeadContext.childContextTypes = {
    head: PropTypes.object,
  };

  HeadContext.data = data;

  return HeadContext;
}

export function headData(toHead) {
  return (WrappedComponent) => {
    class HeadData extends Component {
      constructor(props) {
        super(props);
      }

      render() {
        if (this.context && this.context.head && toHead) {
          toHead(this.context.head, this.props);
        }
        return <WrappedComponent {...this.props} />;
      }
    }

    HeadData.contextTypes = {
      head: PropTypes.object,
    };

    return HeadData;
  };
}
