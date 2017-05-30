
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ArticleGroup from './article-group';

export default class ArticleSingle extends Component {
  render() {
    var props = Object.assign({query: {}}, this.props);
    Object.assign(props.query, {
      limit: 1,
    });
    return (
      <ArticleGroup {...props}>
          {articles => this.props.children ? this.props.children(articles[0]) : null}
      </ArticleGroup>
    );
  }
}

ArticleSingle.propTypes = {
  children: PropTypes.func,
};
