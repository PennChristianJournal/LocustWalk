
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Optional from '../components/optional';

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

export default connect((state, ownProps) => {
  const {metadata} = ownProps;
  const {meta, link, title} = metadata || {};

  var props = Object.assign({}, state.metadata);
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
    props.link = props.link.concat(link);
  }

  return props;
})(Head);
